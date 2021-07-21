import { computed, ref, Ref, provide, reactive, onMounted, isRef, watch, unref, nextTick, warn, markRaw } from 'vue';
import isEqual from 'fast-deep-equal/es6';
import type { SchemaOf } from 'yup';
import { klona as deepCopy } from 'klona/lite';
import {
  FieldMeta,
  SubmissionHandler,
  GenericValidateFunction,
  ValidationResult,
  MaybeRef,
  FormState,
  FormValidationResult,
  PrivateFieldContext,
  PrivateFormContext,
  FormContext,
  FormErrors,
  FormErrorBag,
  SchemaValidationMode,
  RawFormSchema,
} from './types';
import {
  applyFieldMutation,
  getFromPath,
  isYupValidator,
  keysOf,
  resolveNextCheckboxValue,
  setInPath,
  unsetPath,
  isFormSubmitEvent,
  normalizeField,
  debounceAsync,
} from './utils';
import { FormErrorsKey, FormContextKey, FormInitialValuesKey } from './symbols';
import { validateYupSchema, validateObjectSchema } from './validate';

interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: MaybeRef<
    Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | SchemaOf<TValues> | undefined
  >;
  initialValues?: MaybeRef<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
}

type RegisteredField = PrivateFieldContext | PrivateFieldContext[];

export function useForm<TValues extends Record<string, any> = Record<string, any>>(
  opts?: FormOptions<TValues>
): FormContext<TValues> {
  // A lookup containing fields or field groups
  const fieldsByPath: Ref<Record<keyof TValues, RegisteredField>> = ref({} as any);

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // The number of times the user tried to submit the form
  const submitCount = ref(0);

  // a private ref for all form values
  const formValues = reactive(deepCopy(unref(opts?.initialValues) || {})) as TValues;
  // a lookup to keep track of values by their field ids
  // this is important because later we need it if fields swap names
  const valuesByFid: Record<string, any> = {};

  // the source of errors for the form fields
  const { errorBag, setErrorBag, setFieldErrorBag } = useErrorBag(opts?.initialErrors);

  // Gets the first error of each field
  const errors = computed<FormErrors<TValues>>(() => {
    return keysOf(errorBag.value).reduce((acc, key) => {
      const bag = errorBag.value[key];
      if (bag && bag.length) {
        acc[key] = bag[0];
      }

      return acc;
    }, {} as FormErrors<TValues>);
  });

  /**
   * Holds a computed reference to all fields names and labels
   */
  const fieldNames = computed(() => {
    return keysOf(fieldsByPath.value).reduce((names, path) => {
      const field = normalizeField(fieldsByPath.value[path]);
      if (field) {
        names[path as string] = unref(field.label || field.name) || '';
      }

      return names;
    }, {} as Record<string, string>);
  });

  const fieldBailsMap = computed(() => {
    return keysOf(fieldsByPath.value).reduce((map, path) => {
      const field = normalizeField(fieldsByPath.value[path]);
      if (field) {
        map[path as string] = field.bails ?? true;
      }

      return map;
    }, {} as Record<string, boolean>);
  });

  // mutable non-reactive reference to initial errors
  // we need this to process initial errors then unset them
  const initialErrors = { ...(opts?.initialErrors || {}) };

  // initial form values
  const { readonlyInitialValues, initialValues, setInitialValues } = useFormInitialValues<TValues>(
    fieldsByPath,
    formValues,
    opts?.initialValues
  );

  // form meta aggregations
  const meta = useFormMeta(fieldsByPath, formValues, readonlyInitialValues, errors);

  const schema = opts?.validationSchema;
  const formCtx: PrivateFormContext<TValues> = {
    fieldsByPath,
    values: formValues,
    errorBag,
    schema,
    submitCount,
    meta,
    isSubmitting,
    validateSchema: unref(schema) ? validateSchema : undefined,
    validate,
    register: registerField,
    unregister: unregisterField,
    setFieldErrorBag,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    resetForm,
    handleSubmit,
    stageInitialValue,
    setFieldInitialValue,
  };

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: keyof TValues, message: string | string[] | undefined) {
    setFieldErrorBag(field, message);
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrors(fields: Partial<Record<keyof TValues, string | string[] | undefined>>) {
    setErrorBag(fields);
  }

  /**
   * Sets a single field value
   */
  function setFieldValue<T extends keyof TValues = string>(
    field: T,
    value: TValues[T] | undefined,
    { force } = { force: false }
  ) {
    const fieldInstance: RegisteredField | undefined = fieldsByPath.value[field];
    // field wasn't found, create a virtual field as a placeholder
    if (!fieldInstance) {
      setInPath(formValues, field as string, value);
      return;
    }

    // Multiple checkboxes, and only one of them got updated
    if (Array.isArray(fieldInstance) && fieldInstance[0]?.type === 'checkbox' && !Array.isArray(value)) {
      const newVal = resolveNextCheckboxValue(getFromPath(formValues, field as string) || [], value, undefined);
      setInPath(formValues, field as string, newVal);
      fieldInstance.forEach(fieldItem => {
        valuesByFid[fieldItem.fid] = newVal;
      });
      return;
    }

    let newValue = value;
    // Single Checkbox: toggles the field value unless the field is being reset then force it
    if (!Array.isArray(fieldInstance) && fieldInstance?.type === 'checkbox' && !force) {
      newValue = resolveNextCheckboxValue<TValues[T]>(
        getFromPath<TValues[T]>(formValues, field as string) as TValues[T],
        value as TValues[T],
        unref(fieldInstance.uncheckedValue) as TValues[T]
      );
    }

    setInPath(formValues, field as string, newValue);
    // multiple radio fields
    if (fieldInstance && Array.isArray(fieldInstance)) {
      fieldInstance.forEach(fieldItem => {
        valuesByFid[fieldItem.fid] = newValue;
      });
      return;
    }

    valuesByFid[fieldInstance.fid] = newValue;
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: Partial<TValues>) {
    // clean up old values
    keysOf(formValues).forEach(key => {
      delete formValues[key];
    });

    // set up new values
    keysOf(fields).forEach(path => {
      setFieldValue(path, fields[path]);
    });
  }

  /**
   * Sets the touched meta state on a field
   */
  function setFieldTouched(field: keyof TValues, isTouched: boolean) {
    const fieldInstance: RegisteredField | undefined = fieldsByPath.value[field];
    if (!fieldInstance) {
      return;
    }

    applyFieldMutation(fieldInstance, f => f.setTouched(isTouched));
  }

  /**
   * Sets the touched meta state on multiple fields
   */
  function setTouched(fields: Partial<Record<keyof TValues, boolean>>) {
    keysOf(fields).forEach(field => {
      setFieldTouched(field, !!fields[field]);
    });
  }

  /**
   * Resets all fields
   */
  function resetForm(state?: Partial<FormState<TValues>>) {
    // set initial values if provided
    if (state?.values) {
      setInitialValues(state.values);
      setValues(state?.values);
    } else {
      // otherwise clean the current values
      setValues(initialValues.value);
    }

    // Reset all fields state
    Object.values(fieldsByPath.value).forEach(fieldGroup => applyFieldMutation(fieldGroup, f => f.resetField()));

    if (state?.touched) {
      setTouched(state.touched);
    }

    setErrors(state?.errors || {});
    submitCount.value = state?.submitCount || 0;
  }

  function insertFieldAtPath(field: PrivateFieldContext, path: string) {
    const rawField = markRaw(field);
    const fieldPath: keyof TValues = path;
    // if the field was not added before
    if (!fieldsByPath.value[path]) {
      fieldsByPath.value[fieldPath] = rawField;
      return;
    }

    const existingField: RegisteredField = fieldsByPath.value[fieldPath];
    if (!Array.isArray(existingField)) {
      fieldsByPath.value[fieldPath] = [existingField];
    }

    const fieldGroup = fieldsByPath.value[fieldPath] as PrivateFieldContext[];
    fieldGroup.push(rawField);
  }

  function removeFieldFromPath(field: PrivateFieldContext, path: string) {
    const fieldPath: keyof TValues = path;
    const fieldOrFieldGroup = fieldsByPath.value[fieldPath];
    if (!fieldOrFieldGroup) {
      return;
    }

    if (!Array.isArray(fieldOrFieldGroup)) {
      // delete the path if its a singular field
      delete fieldsByPath.value[fieldPath];

      return;
    }

    // if its a field group remove that specific field
    const fieldIdx = fieldOrFieldGroup.indexOf(field);
    if (fieldIdx !== -1) {
      fieldOrFieldGroup.splice(fieldIdx, 1);
    }

    // if no field in the group remains, remove the entire group
    if (fieldOrFieldGroup.length === 0) {
      delete fieldsByPath.value[fieldPath];
    }
  }

  function fieldGroupExists(path: string) {
    const oldGroup = fieldsByPath.value[path];

    if (Array.isArray(oldGroup)) {
      return oldGroup.length > 0;
    }

    return !!oldGroup;
  }

  function registerField(field: PrivateFieldContext) {
    const fieldPath = unref(field.name);
    insertFieldAtPath(field, fieldPath);

    if (isRef(field.name)) {
      valuesByFid[field.fid] = field.value.value;
      // ensures when a field's name was already taken that it preserves its same value
      // necessary for fields generated by loops

      watch(
        field.name,
        (newPath, oldPath) => {
          removeFieldFromPath(field, oldPath);
          insertFieldAtPath(field, newPath);
          setFieldValue(newPath, valuesByFid[field.fid]);
          // const isSharingName = fields.value.find(f => unref(f.name) === oldPath);
          // clean up the old path if no other field is sharing that name
          // #3325
          if (!fieldGroupExists(oldPath)) {
            unsetPath(formValues, oldPath);
            unsetPath(initialValues.value, oldPath);
          }
        },
        {
          flush: 'post',
        }
      );
    }

    // if field already had errors (initial errors) that's not user-set, validate it again to ensure state is correct
    // the difference being that `initialErrors` will contain the error message while other errors (pre-validated schema) won't have them as initial errors
    // #3342
    const initialErrorMessage = unref(field.errorMessage);
    if (initialErrorMessage && initialErrors?.[fieldPath] !== initialErrorMessage) {
      validateField(fieldPath);
    }

    // marks the initial error as "consumed" so it won't be matched later with same non-initial error
    delete initialErrors[fieldPath];
  }

  function unregisterField(field: PrivateFieldContext<unknown>) {
    const fieldName = unref(field.name);
    removeFieldFromPath(field, fieldName);
    const fid = field.fid;
    // cleans up the field value from fid lookup
    nextTick(() => {
      delete valuesByFid[fid];
      // clears a field error on unmounted
      // we wait till next tick to make sure if the field is completely removed and doesn't have any siblings like checkboxes
      // #3384
      if (!fieldsByPath.value[fieldName]) {
        setFieldError(fieldName, undefined);
      }
    });

    const fieldGroup = fieldsByPath.value[fieldName];
    // in this case, this is a single field not a group (checkbox or radio)
    // so remove the field value key immediately
    if (!Array.isArray(fieldGroup)) {
      // avoid un-setting the value if the field was switched with another that shares the same name
      // they will be unset once the new field takes over the new name, look at `#registerField()`
      // #3166
      if (!fieldGroupExists(fieldName)) {
        unsetPath(formValues, fieldName);
        unsetPath(initialValues.value, fieldName);
      }

      return;
    }

    // otherwise find the actual value in the current array of values and remove it
    const valueIdx: number | undefined = getFromPath<unknown[] | undefined>(formValues, fieldName)?.indexOf?.(
      unref(field.checkedValue)
    );

    if (valueIdx === undefined) {
      unsetPath(formValues, fieldName);

      return;
    }

    if (valueIdx === -1) {
      return;
    }

    if (Array.isArray(formValues[fieldName])) {
      unsetPath(formValues, `${fieldName}.${valueIdx}`);
      return;
    }

    unsetPath(formValues, fieldName);
    unsetPath(initialValues.value, fieldName);
  }

  async function validate(): Promise<FormValidationResult<TValues>> {
    if (formCtx.validateSchema) {
      return formCtx.validateSchema('force');
    }

    // No schema, each field is responsible to validate itself
    const validations = await Promise.all(
      Object.values(fieldsByPath.value).map(fieldGroup => {
        const field = normalizeField(fieldGroup);
        if (!field) {
          return Promise.resolve({ key: '', valid: true, errors: [] });
        }

        return field.validate().then((result: ValidationResult) => {
          return {
            key: unref(field.name),
            valid: result.valid,
            errors: result.errors,
          };
        });
      })
    );

    const results: Partial<Record<keyof TValues, ValidationResult>> = {};
    const errors: Partial<Record<keyof TValues, string>> = {};
    for (const validation of validations) {
      results[validation.key as keyof TValues] = {
        valid: validation.valid,
        errors: validation.errors,
      };

      if (validation.errors.length) {
        errors[validation.key as keyof TValues] = validation.errors[0];
      }
    }

    return {
      valid: validations.every(r => r.valid),
      results,
      errors,
    };
  }

  async function validateField(field: keyof TValues): Promise<ValidationResult> {
    const fieldInstance: RegisteredField | undefined = fieldsByPath.value[field];
    if (!fieldInstance) {
      warn(`field with name ${field} was not found`);

      return Promise.resolve({ errors: [], valid: true });
    }

    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map(f => f.validate())[0];
    }

    return fieldInstance.validate();
  }

  function handleSubmit(fn?: SubmissionHandler<TValues>) {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Touch all fields
      setTouched(
        keysOf(fieldsByPath.value).reduce((acc, field) => {
          acc[field] = true;

          return acc;
        }, {} as Record<keyof TValues, boolean>)
      );

      isSubmitting.value = true;
      submitCount.value++;
      return validate()
        .then(result => {
          if (result.valid && typeof fn === 'function') {
            return fn(deepCopy(formValues), {
              evt: e as Event,
              setErrors,
              setFieldError,
              setTouched,
              setFieldTouched,
              setValues,
              setFieldValue,
              resetForm,
            });
          }
        })
        .then(
          () => {
            isSubmitting.value = false;
          },
          err => {
            isSubmitting.value = false;

            // re-throw the err so it doesn't go silent
            throw err;
          }
        );
    };
  }

  function setFieldInitialValue(path: string, value: unknown) {
    setInPath(initialValues.value, path, value);
  }

  /**
   * Sneaky function to set initial field values
   */
  function stageInitialValue(path: string, value: unknown) {
    if (formValues[path] && value === undefined) {
      return;
    }

    setInPath(formValues, path, value);
    setFieldInitialValue(path, value);
  }

  async function _validateSchema(): Promise<FormValidationResult<TValues>> {
    const schemaValue = unref(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }

    const formResult = isYupValidator(schemaValue)
      ? await validateYupSchema(schemaValue, formValues)
      : await validateObjectSchema(schemaValue as RawFormSchema<TValues>, formValues, {
          names: fieldNames.value,
          bailsMap: fieldBailsMap.value,
        });

    return formResult;
  }

  /**
   * Batches validation runs in 5ms batches
   */
  const debouncedSchemaValidation = debounceAsync(_validateSchema, 5);

  async function validateSchema(mode: SchemaValidationMode): Promise<FormValidationResult<TValues>> {
    const formResult = await debouncedSchemaValidation();

    // fields by id lookup
    const fieldsById = formCtx.fieldsByPath.value || {};
    // errors fields names, we need it to also check if custom errors are updated
    const currentErrorsPaths = keysOf(formCtx.errorBag.value);
    // collect all the keys from the schema and all fields
    // this ensures we have a complete keymap of all the fields
    const paths = [
      ...new Set([...keysOf(formResult.results), ...keysOf(fieldsById), ...currentErrorsPaths]),
    ] as string[];

    // aggregates the paths into a single result object while applying the results on the fields
    return paths.reduce(
      (validation, path) => {
        const field: RegisteredField | undefined = fieldsById[path];
        const messages = (formResult.results[path] || { errors: [] as string[] }).errors;
        const fieldResult = {
          errors: messages,
          valid: !messages.length,
        };
        validation.results[path as keyof TValues] = fieldResult;
        if (!fieldResult.valid) {
          validation.errors[path as keyof TValues] = fieldResult.errors[0];
        }

        // field not rendered
        if (!field) {
          setFieldError(path, messages);

          return validation;
        }

        // always update the valid flag regardless of the mode
        applyFieldMutation(field, f => (f.meta.valid = fieldResult.valid));
        if (mode === 'silent') {
          return validation;
        }

        const wasValidated = Array.isArray(field) ? field.some(f => f.meta.validated) : field.meta.validated;
        if (mode === 'validated-only' && !wasValidated) {
          return validation;
        }

        applyFieldMutation(field, f => f.setValidationState(fieldResult), true);

        return validation;
      },
      { valid: formResult.valid, results: {}, errors: {} } as FormValidationResult<TValues>
    );
  }

  const submitForm = handleSubmit((_, { evt }) => {
    if (isFormSubmitEvent(evt)) {
      evt.target.submit();
    }
  });

  // Trigger initial validation
  onMounted(() => {
    if (opts?.initialErrors) {
      setErrors(opts.initialErrors);
    }

    if (opts?.initialTouched) {
      setTouched(opts.initialTouched);
    }

    // if validate on mount was enabled
    if (opts?.validateOnMount) {
      validate();
      return;
    }

    // otherwise run initial silent validation through schema if available
    // the useField should skip their own silent validation if a yup schema is present
    if (formCtx.validateSchema) {
      formCtx.validateSchema('silent');
    }
  });

  if (isRef(schema)) {
    watch(schema, () => {
      formCtx.validateSchema?.('validated-only');
    });
  }

  // Provide injections
  provide(FormContextKey, formCtx as PrivateFormContext);
  provide(FormErrorsKey, errors);

  return {
    errors,
    meta,
    values: formValues,
    isSubmitting,
    submitCount,
    validate,
    validateField,
    handleReset: () => resetForm(),
    resetForm,
    handleSubmit,
    submitForm,
    setFieldError,
    setErrors,
    setFieldValue,
    setValues,
    setFieldTouched,
    setTouched,
  };
}

/**
 * Manages form meta aggregation
 */
function useFormMeta<TValues extends Record<string, unknown>>(
  fieldsByPath: Ref<Record<keyof TValues, RegisteredField>>,
  currentValues: TValues,
  initialValues: MaybeRef<TValues>,
  errors: Ref<FormErrors<TValues>>
) {
  const MERGE_STRATEGIES: Record<keyof Pick<FieldMeta<unknown>, 'touched' | 'pending' | 'valid'>, 'every' | 'some'> = {
    touched: 'some',
    pending: 'some',
    valid: 'every',
  };

  const isDirty = computed(() => {
    return !isEqual(currentValues, unref(initialValues));
  });

  const flags = computed(() => {
    const fields = Object.values(fieldsByPath.value)
      .map(f => normalizeField(f))
      .filter(Boolean) as PrivateFieldContext[];

    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, boolean>);
  });

  return computed(() => {
    return {
      initialValues: unref(initialValues) as TValues,
      ...flags.value,
      valid: flags.value.valid && !keysOf(errors.value as any).length,
      dirty: isDirty.value,
    };
  });
}

/**
 * Manages the initial values prop
 */
function useFormInitialValues<TValues extends Record<string, any>>(
  fields: Ref<Record<keyof TValues, RegisteredField>>,
  formValues: TValues,
  providedValues?: MaybeRef<TValues>
) {
  const initialValues = ref<TValues>((unref(providedValues) as TValues) || ({} as TValues));
  // acts as a read only proxy of the initial values object
  const computedInitials = computed<TValues>(() => {
    return initialValues.value as TValues;
  });

  function setInitialValues(values: Partial<TValues>, updateFields = false) {
    initialValues.value = {
      ...values,
    };

    if (!updateFields) {
      return;
    }

    // update the pristine non-touched fields
    // those are excluded because it's unlikely you want to change the form values using initial values
    // we mostly watch them for API population or newly inserted fields
    // if the user API is taking too much time before user interaction they should consider disabling or hiding their inputs until the values are ready
    const hadInteraction = (f: PrivateFieldContext) => f.meta.touched;
    keysOf(fields.value).forEach(fieldPath => {
      const field: RegisteredField = fields.value[fieldPath];
      const touchedByUser = Array.isArray(field) ? field.some(hadInteraction) : hadInteraction(field);
      if (touchedByUser) {
        return;
      }

      const newValue = getFromPath(initialValues.value, fieldPath as string);
      setInPath(formValues, fieldPath as string, newValue);
    });
  }

  if (isRef(providedValues)) {
    watch(
      providedValues,
      value => {
        setInitialValues(value, true);
      },
      {
        deep: true,
      }
    );
  }

  provide(FormInitialValuesKey, computedInitials);

  return {
    readonlyInitialValues: computedInitials,
    initialValues,
    setInitialValues,
  };
}

function useErrorBag<TValues extends Record<string, any>>(initialErrors?: FormErrors<TValues>) {
  const errorBag: Ref<FormErrorBag<TValues>> = ref({});

  function normalizeErrorItem(message: string | string[]) {
    return Array.isArray(message) ? message : message ? [message] : [];
  }

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldErrorBag(field: keyof TValues, message: string | undefined | string[]) {
    if (!message) {
      delete errorBag.value[field];
      return;
    }

    errorBag.value[field] = normalizeErrorItem(message);
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrorBag(fields: Partial<Record<keyof TValues, string | string[] | undefined>>) {
    errorBag.value = keysOf(fields).reduce((acc, key) => {
      const message = fields[key] as string | string[] | undefined;
      if (message) {
        acc[key] = normalizeErrorItem(message);
      }

      return acc;
    }, {} as FormErrorBag<TValues>);
  }

  if (initialErrors) {
    setErrorBag(initialErrors);
  }

  return {
    errorBag,
    setErrorBag,
    setFieldErrorBag,
  };
}
