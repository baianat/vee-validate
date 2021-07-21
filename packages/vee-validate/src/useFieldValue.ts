import { computed, inject, unref } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { MaybeRef } from './types';
import { getFromPath, injectWithSelf } from './utils';

/**
 * Gives access to a field's current value
 */
export function useFieldValue<TValue = unknown>(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  const value = computed(() => {
    if (path) {
      return getFromPath(form?.values, unref(path)) as TValue;
    }

    return field?.value?.value as TValue;
  });

  function setValue(newValue: TValue) {
    if (path) {
      form?.setFieldValue(unref(path), newValue);
      return;
    }

    field?.setValue(newValue);
  }

  return {
    value,
    setValue,
  };
}
