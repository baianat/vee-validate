import { inject, unref } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { MaybeRef, PrivateFieldContext, ValidationResult } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  let field: PrivateFieldContext | undefined = path ? undefined : inject(FieldContextKey);

  return function validateField(): Promise<ValidationResult> {
    if (path) {
      field = normalizeField(form?.fieldsByPath.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return Promise.resolve({
        errors: [],
        valid: true,
      });
    }

    return field.validate();
  };
}
