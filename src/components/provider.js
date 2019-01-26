import VeeValidate from '../plugin';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, isEvent } from '../utils/events';
import { createFlags, normalizeRules, warn, isCallable, debounce, isNullOrUndefined } from '../utils';
import { findModel, extractVNodes, addVNodeListener, getInputEventName, createRenderless } from '../utils/vnode';

let $validator = null;

let PROVIDER_COUNTER = 0;

export function createValidationCtx (ctx) {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    valid: ctx.isValid,
    reset: () => ctx.reset(),
    validate: (...args) => ctx.validate(...args),
    aria: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false'
    }
  };
}

export function onRenderUpdate (model) {
  let validateNow = (this.value !== model.value) || this._needsValidation;
  if (!this.initialized) {
    this.initialValue = model.value;
  }

  if (!this.initialized && model.value === undefined) {
    validateNow = true;
  }

  this._needsValidation = false;
  this._eventEmitted = false;

  if (!validateNow) {
    return;
  }

  const silentHandler = ({ valid }) => {
    // initially assign the valid/invalid flags.
    this.setFlags({
      valid,
      invalid: !valid
    });
  };

  this.value = model.value;
  this.validateSilent().then(this.immediate || this.flags.validated ? this.applyResult : silentHandler);
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers (ctx) {
  const onInput = (e) => {
    ctx.syncValue(e); // track and keep the value updated.
    ctx.setFlags({ dirty: true, pristine: false });
  };

  // Blur event listener.
  const onBlur = () => {
    ctx.setFlags({ touched: true, untouched: false });
  };

  const onValidate = debounce(
    () => {
      const pendingPromise = ctx.validate();
      // avoids race conditions between successive validations.
      ctx._waiting = pendingPromise;
      ctx._eventEmitted = true;
      pendingPromise.then(result => {
        if (pendingPromise === ctx._waiting) {
          ctx.applyResult(result);
          ctx._waiting = null;
        }
      });
    },
    ctx.debounce
  );

  return { onInput, onBlur, onValidate };
}

// Adds all plugin listeners to the vnode.
function addListeners (node) {
  const model = findModel(node);
  // cache the input eventName.
  this._inputEventName = this._inputEventName || getInputEventName(node, model);

  onRenderUpdate.call(this, model);

  const { onInput, onBlur, onValidate } = createCommonHandlers(this);
  addVNodeListener(node, this._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  this.normalizedEvents.forEach(evt => {
    addVNodeListener(node, evt, onValidate);
  });

  this.initialized = true;
}

function createValuesLookup (ctx) {
  let providers = ctx.$_veeObserver.refs;

  return ctx.fieldDeps.reduce((acc, depName) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, {});
}

function updateRenderingContextRefs (ctx) {
  // IDs should not be nullable.
  if (isNullOrUndefined(ctx.id) && ctx.id === ctx.vid) {
    ctx.id = PROVIDER_COUNTER;
    PROVIDER_COUNTER++;
  }

  const { id, vid } = ctx;
  // Nothing has changed.
  if (id === vid && ctx.$_veeObserver.refs[id]) {
    return;
  }

  // vid was changed.
  if (id !== vid && ctx.$_veeObserver.refs[id] === ctx) {
    ctx.$_veeObserver.$unsubscribe(ctx);
  }

  ctx.$_veeObserver.$subscribe(ctx);
  ctx.id = vid;
}

function createObserver () {
  return {
    refs: {},
    $subscribe (ctx) {
      this.refs[ctx.vid] = ctx;
    },
    $unsubscribe (ctx) {
      delete this.refs[ctx.vid];
    }
  };
}

export const ValidationProvider = {
  $__veeInject: false,
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default () {
        if (!this.$vnode.context.$_veeObserver) {
          this.$vnode.context.$_veeObserver = createObserver();
        }

        return this.$vnode.context.$_veeObserver;
      }
    }
  },
  props: {
    vid: {
      type: [String, Number],
      default: () => {
        PROVIDER_COUNTER++;

        return PROVIDER_COUNTER;
      }
    },
    name: {
      type: String,
      default: null
    },
    events: {
      type: [Array, String],
      default: () => ['input']
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
      default: () => VeeValidate.config.fastExit
    },
    debounce: {
      type: Number,
      default: () => VeeValidate.config.delay || 0
    }
  },
  watch: {
    rules: {
      deep: true,
      handler () {
        this._needsValidation = true;
      }
    }
  },
  data: () => ({
    messages: [],
    value: undefined,
    initialized: false,
    initialValue: undefined,
    flags: createFlags(),
    forceRequired: false,
    id: null
  }),
  methods: {
    setFlags (flags) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue (e) {
      const value = isEvent(e) ? e.target.value : e;

      this.value = value;
      this.flags.changed = this.initialValue === value;
    },
    reset () {
      this.messages = [];
      this._waiting = null;
      this.initialValue = this.value;
      const flags = createFlags();
      this.setFlags(flags);
    },
    validate (...args) {
      if (args[0]) {
        this.syncValue(args[0]);
      }

      return this.validateSilent().then(result => {
        this.applyResult(result);

        return result;
      });
    },
    validateSilent () {
      this.setFlags({ pending: true });

      return $validator.verify(this.value, this.rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails
      }).then(result => {
        this.setFlags({ pending: false });

        return result;
      });
    },
    applyResult ({ errors }) {
      this.messages = errors;
      this.setFlags({
        valid: !errors.length,
        changed: this.value !== this.initialValue,
        invalid: !!errors.length,
        validated: true
      });
    },
    registerField () {
      if (!$validator) {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
          if (!VeeValidate.instance) {
            warn('You must install vee-validate first before using this component.');
          }
        }

        $validator = VeeValidate.instance._validator;
      }

      updateRenderingContextRefs(this);
    }
  },
  computed: {
    isValid () {
      return this.flags.valid;
    },
    fieldDeps () {
      const rules = normalizeRules(this.rules);
      let providers = this.$_veeObserver.refs;

      return Object.keys(rules).filter(RuleContainer.isTargetRule).map(rule => {
        const depName = rules[rule][0];
        const watcherName = `$__${depName}`;
        if (!isCallable(this[watcherName])) {
          this[watcherName] = providers[depName].$watch('value', () => {
            this.validate();
          });
        }

        return depName;
      });
    },
    normalizedEvents () {
      return normalizeEvents(this.events).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired () {
      const rules = normalizeRules(this.rules);
      const forceRequired = this.forceRequired;

      return !!rules.required || forceRequired;
    },
    classes () {
      const names = VeeValidate.config.classNames;
      return Object.keys(this.flags).reduce((classes, flag) => {
        const className = (names && names[flag]) || flag;
        if (flag === 'invalid') {
          classes[className] = !!this.messages.length;

          return classes;
        }

        if (flag === 'valid') {
          classes[className] = !this.messages.length;

          return classes;
        }

        if (className) {
          classes[className] = this.flags[flag];
        }

        return classes;
      }, {});
    }
  },
  render (h) {
    this.registerField();
    const ctx = createValidationCtx(this);

    // Gracefully handle non-existent scoped slots.
    let slot = this.$scopedSlots.default;
    if (!isCallable(slot)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('ValidationProvider expects a scoped slot. Did you forget to add "slot-scope" to your slot?');
      }

      return createRenderless(h, this.$slots.default);
    }

    const nodes = slot(ctx);
    // Handle single-root slot.
    extractVNodes(nodes).forEach(input => {
      addListeners.call(this, input);
    });

    return createRenderless(h, nodes);
  },
  beforeDestroy () {
    // cleanup reference.
    this.$_veeObserver.$unsubscribe(this);
  }
};
