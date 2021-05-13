import { computed, inject, unref } from 'vue';
import { FieldContextSymbol, FormContextSymbol } from './symbols';
import { MaybeRef, PrivateFieldComposite } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * If a field is validated and is valid
 */
export function useIsFieldValid(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextSymbol);
  let field: PrivateFieldComposite | undefined = path ? undefined : inject(FieldContextSymbol);

  return computed(() => {
    if (path) {
      field = normalizeField(form?.fieldsById.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return false;
    }

    return field.meta.valid;
  });
}
