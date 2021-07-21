import { computed, inject, unref } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { MaybeRef, PrivateFieldContext } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * If a field is touched or not
 */
export function useIsFieldTouched(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  let field: PrivateFieldContext | undefined = path ? undefined : inject(FieldContextKey);

  return computed(() => {
    if (path) {
      field = normalizeField(form?.fieldsByPath.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return false;
    }

    return field.meta.touched;
  });
}
