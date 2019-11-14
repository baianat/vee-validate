import Vue, { CreateElement, VNode, VueConstructor } from 'vue';
import { normalizeRules, extractLocators } from '../utils/rules';
import { normalizeEventValue } from '../utils/events';
import { extractVNodes, normalizeChildren, resolveRules } from '../utils/vnode';
import { isCallable, isEqual, isNullOrUndefined, createFlags } from '../utils';
import { getConfig, ValidationClassMap } from '../config';
import { validate } from '../validate';
import { RuleContainer } from '../extend';
import { ProviderInstance, ValidationFlags, ValidationResult, VeeObserver, VNodeWithVeeContext } from '../types';
import { addListeners, computeModeSetting, createValidationCtx } from './common';
import { EVENT_BUS } from '../localeChanged';

let PROVIDER_COUNTER = 0;

type withProviderPrivates = VueConstructor<
  Vue & {
    $_veeObserver: VeeObserver;
    _needsValidation: boolean;
    _inputEventName: string;
    _ignoreImmediate: boolean;
    _pendingValidation?: Promise<ValidationResult>;
    _resolvedRules: any;
    _regenerateMap?: Record<string, () => string>;
    _veeWatchers: Record<string, Function>;
    $veeDebounce?: number;
    $veeHandler?: Function;
    $veeOnInput?: Function;
    $veeOnBlur?: Function;
    $vnode: VNodeWithVeeContext;
    $localeHandler: Function;
  }
>;

function data() {
  const errors: string[] = [];

  const defaultValues = {
    errors,
    value: undefined,
    initialized: false,
    initialValue: undefined,
    flags: createFlags(),
    failedRules: {},
    isDeactivated: false,
    id: ''
  };
  return defaultValues;
}

export const ValidationProvider = (Vue as withProviderPrivates).extend({
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default() {
        if (!this.$vnode.context.$_veeObserver) {
          this.$vnode.context.$_veeObserver = createObserver();
        }

        return this.$vnode.context.$_veeObserver;
      }
    }
  },
  props: {
    vid: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    mode: {
      type: [String, Function],
      default: () => {
        return getConfig().mode;
      }
    },
    rules: {
      type: [Object, String],
      default: null
    },
    immediate: {
      type: Boolean,
      default: false
    },
    persist: {
      type: Boolean,
      default: false
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails
    },
    skipIfEmpty: {
      type: Boolean,
      default: () => getConfig().skipOptional
    },
    debounce: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      default: 'span'
    },
    slim: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customMessages: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    rules: {
      deep: true,
      handler(val: any, oldVal: any) {
        this._needsValidation = !isEqual(val, oldVal);
      }
    }
  },
  data,
  computed: {
    fieldDeps(): string[] {
      return Object.keys(this.normalizedRules).reduce((acc: string[], rule: string) => {
        const deps = extractLocators(this.normalizedRules[rule]).map((dep: any) => dep.__locatorRef);

        acc.push(...deps);
        deps.forEach(depName => {
          watchCrossFieldDep(this, depName);
        });

        return acc;
      }, []);
    },
    normalizedEvents(): string[] {
      const { on } = computeModeSetting(this);

      return (on || []).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired(): boolean {
      const rules = { ...this._resolvedRules, ...this.normalizedRules };

      const isRequired = Object.keys(rules).some(RuleContainer.isRequireRule);
      this.flags.required = !!isRequired;

      return isRequired;
    },
    classes() {
      const names = getConfig().classes;

      return computeClassObj(names, this.flags);
    },
    normalizedRules() {
      return normalizeRules(this.rules);
    }
  },
  created() {
    const onLocaleChanged = () => {
      if (!this.flags.validated) {
        return;
      }

      const regenerateMap = this._regenerateMap;
      if (regenerateMap) {
        const errors: string[] = [];
        const failedRules: Record<string, string> = {};
        Object.keys(regenerateMap).forEach(rule => {
          const msg = regenerateMap[rule]();
          errors.push(msg);
          failedRules[rule] = msg;
        });

        this.applyResult({ errors, failedRules, regenerateMap });
        return;
      }

      this.validate();
    };

    EVENT_BUS.$on('change:locale', onLocaleChanged);
    this.$on('hook:beforeDestroy', () => {
      EVENT_BUS.$off('change:locale', onLocaleChanged);
    });
  },
  render(h: CreateElement): VNode {
    this.registerField();
    const ctx = createValidationCtx(this);
    const children = normalizeChildren(this, ctx);

    // Handle single-root slot.
    extractVNodes(children).forEach(input => {
      // resolved rules are not reactive because it has a new reference each time.
      // causing infinite render-loops.
      // So we are comparing them manually to decide if we need to validate or not.
      const resolved = getConfig().useConstraintAttrs ? resolveRules(input) : {};
      if (!isEqual(this._resolvedRules, resolved)) {
        this._needsValidation = true;
      }

      this._resolvedRules = resolved;
      addListeners(this, input);
    });

    return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
  },
  beforeDestroy() {
    // cleanup reference.
    this.$_veeObserver.unsubscribe(this.id);
  },
  activated() {
    this.$_veeObserver.subscribe(this);
    this.isDeactivated = false;
  },
  deactivated() {
    this.$_veeObserver.unsubscribe(this.id);
    this.isDeactivated = true;
  },
  methods: {
    setFlags(flags: Partial<ValidationFlags>) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue(v: any) {
      const value = normalizeEventValue(v);
      this.value = value;
      this.flags.changed = this.initialValue !== value;
    },
    reset() {
      this.errors = [];
      this.initialValue = this.value;
      const flags = createFlags();
      flags.required = this.isRequired;
      this.setFlags(flags);
      this.validateSilent();
    },
    async validate(...args: any[]): Promise<ValidationResult> {
      if (args.length > 0) {
        this.syncValue(args[0]);
      }

      const result = await this.validateSilent();
      this.applyResult(result);

      return result;
    },
    async validateSilent(): Promise<ValidationResult> {
      this.setFlags({ pending: true });
      const rules = { ...this._resolvedRules, ...this.normalizedRules };
      Object.defineProperty(rules, '_$$isNormalized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      const result = await validate(this.value, rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails,
        skipIfEmpty: this.skipIfEmpty,
        isInitial: !this.initialized,
        customMessages: this.customMessages
      });

      this.setFlags({
        pending: false,
        valid: result.valid,
        invalid: !result.valid
      });

      return result;
    },
    setErrors(errors: string[]) {
      this.applyResult({ errors, failedRules: {} });
    },
    applyResult({ errors, failedRules, regenerateMap }: Omit<ValidationResult, 'valid'>) {
      this.errors = errors;
      this._regenerateMap = regenerateMap;
      this.failedRules = { ...(failedRules || {}) };
      this.setFlags({
        valid: !errors.length,
        passed: !errors.length,
        invalid: !!errors.length,
        failed: !!errors.length,
        validated: true,
        changed: this.value !== this.initialValue
      });
    },
    registerField() {
      updateRenderingContextRefs(this);
    }
  }
});

function computeClassObj(names: ValidationClassMap, flags: ValidationFlags) {
  const acc: Record<string, boolean> = {};
  const keys = Object.keys(flags);
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const flag = keys[i];
    const className = (names && names[flag]) || flag;
    const value = flags[flag];
    if (isNullOrUndefined(value)) {
      continue;
    }

    if ((flag === 'valid' || flag === 'invalid') && !flags.validated) {
      continue;
    }

    if (typeof className === 'string') {
      acc[className] = value;
    } else if (Array.isArray(className)) {
      className.forEach(cls => {
        acc[cls] = value;
      });
    }
  }

  return acc;
}

function createValuesLookup(vm: ProviderInstance) {
  const providers = vm.$_veeObserver.refs;
  const reduced: Record<string, any> = {};

  return vm.fieldDeps.reduce((acc: typeof reduced, depName: string) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, reduced);
}

function extractId(vm: ProviderInstance): string {
  if (vm.vid) {
    return vm.vid;
  }

  if (vm.name) {
    return vm.name;
  }

  if (vm.id) {
    return vm.id;
  }

  PROVIDER_COUNTER++;

  return `_vee_${PROVIDER_COUNTER}`;
}

function updateRenderingContextRefs(vm: ProviderInstance) {
  const providedId = extractId(vm);

  const { id } = vm;
  // Nothing has changed.
  if (vm.isDeactivated || (id === providedId && vm.$_veeObserver.refs[id])) {
    return;
  }

  // vid was changed.
  if (id !== providedId && vm.$_veeObserver.refs[id] === vm) {
    vm.$_veeObserver.unsubscribe(id);
  }

  vm.id = providedId;
  vm.$_veeObserver.subscribe(vm);
}

function createObserver(): VeeObserver {
  return {
    refs: {},
    subscribe(vm: ProviderInstance) {
      this.refs[vm.id] = vm;
    },
    unsubscribe(id: string) {
      delete this.refs[id];
    }
  };
}

function watchCrossFieldDep(ctx: ProviderInstance, depName: string, withHooks = true) {
  const providers = ctx.$_veeObserver.refs;
  if (!ctx._veeWatchers) {
    ctx._veeWatchers = {};
  }

  if (!providers[depName] && withHooks) {
    return ctx.$once('hook:mounted', () => {
      watchCrossFieldDep(ctx, depName, false);
    });
  }

  if (!isCallable(ctx._veeWatchers[depName]) && providers[depName]) {
    ctx._veeWatchers[depName] = providers[depName].$watch('value', () => {
      if (ctx.flags.validated) {
        ctx._needsValidation = true;
        ctx.validate();
      }
    });
  }
}
