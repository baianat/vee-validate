import { computed } from 'vue';
import { FormContextKey } from './symbols';
import { FormContext } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * Gives access to a form's values
 */
export function useFormValues<TValues extends Record<string, unknown> = Record<string, unknown>>() {
  const form = injectWithSelf(FormContextKey) as FormContext<TValues> | undefined;
  if (!form) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  const values = computed(() => {
    return form?.values || ({} as Partial<TValues>);
  });

  function setFieldValue(path: string, value: any) {
    form?.setFieldValue(path, value);
  }

  function setValues(values: Partial<TValues>) {
    form?.setValues(values as any);
  }

  return {
    values,
    setFieldValue,
    setValues,
  };
}
