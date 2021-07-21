import { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { SchemaOf, AnySchema, AnyObjectSchema } from 'yup';
import { FieldValidationMetaInfo } from '../../shared';

export interface ValidationResult {
  errors: string[];
  valid: boolean;
}

export type YupValidator = AnySchema | AnyObjectSchema;

export type Locator = { __locatorRef: string } & ((values: Record<string, unknown>) => unknown);

// Extracts explicit keys of an interface without index signature
// https://stackoverflow.com/questions/51465182/typescript-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export type MaybeRef<T> = Ref<T> | T;

export interface FieldMeta<TValue> {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValue?: TValue;
}

export interface FieldState<TValue = unknown> {
  value: TValue;
  touched: boolean;
  errors: string[];
}

export type WritableRef<TValue> = Ref<TValue> | WritableComputedRef<TValue>;

export interface PrivateFieldContext<TValue = unknown> {
  fid: number;
  name: MaybeRef<string>;
  value: WritableRef<TValue>;
  meta: FieldMeta<TValue>;
  errors: Ref<string[]>;
  errorMessage: ComputedRef<string | undefined>;
  label?: MaybeRef<string | undefined>;
  type?: string;
  bails?: boolean;
  checkedValue?: MaybeRef<TValue>;
  uncheckedValue?: MaybeRef<TValue>;
  checked?: ComputedRef<boolean>;
  resetField(state?: FieldState<TValue>): void;
  handleReset(state?: FieldState<TValue>): void;
  validate(): Promise<ValidationResult>;
  handleChange(e: Event | unknown, shouldValidate?: boolean): void;
  handleBlur(e?: Event): void;
  handleInput(e?: Event | unknown): void;
  setValidationState(state: ValidationResult): void;
  setTouched(isTouched: boolean): void;
  setErrors(message: string | string[]): void;
  setValue(value: TValue): void;
}

export type FieldContext<TValue = unknown> = Omit<PrivateFieldContext<TValue>, 'idx' | 'fid'>;

export type GenericValidateFunction = (
  value: unknown,
  ctx: FieldValidationMetaInfo
) => boolean | string | Promise<boolean | string>;

export interface FormState<TValues> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string | undefined>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  submitCount: number;
}

export type FormErrors<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, string | undefined>>;
export type FormErrorBag<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, string[]>>;

export interface SetFieldValueOptions {
  force: boolean;
}
export interface FormActions<TValues extends Record<string, unknown>> {
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T], opts?: Partial<SetFieldValueOptions>): void;
  setFieldError: (field: keyof TValues, message: string | string[] | undefined) => void;
  setErrors: (fields: FormErrors<TValues>) => void;
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  resetForm: (state?: Partial<FormState<TValues>>) => void;
}

export interface FormValidationResult<TValues> {
  valid: boolean;
  results: Partial<Record<keyof TValues, ValidationResult>>;
  errors: Partial<Record<keyof TValues, string>>;
}

export interface SubmissionContext<TValues extends Record<string, unknown> = Record<string, unknown>>
  extends FormActions<TValues> {
  evt?: Event;
}

export type SubmissionHandler<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  values: TValues,
  ctx: SubmissionContext<TValues>
) => unknown;

export type RawFormSchema<TValues> = Record<keyof TValues, string | GenericValidateFunction | Record<string, any>>;

/**
 * validated-only: only mutate the previously validated fields
 * silent: do not mutate any field
 * force: validate all fields and mutate their state
 */
export type SchemaValidationMode = 'validated-only' | 'silent' | 'force';
export interface PrivateFormContext<TValues extends Record<string, any> = Record<string, any>>
  extends FormActions<TValues> {
  register(field: PrivateFieldContext): void;
  unregister(field: PrivateFieldContext): void;
  values: TValues;
  fieldsByPath: Ref<Record<keyof TValues, PrivateFieldContext | PrivateFieldContext[]>>;
  submitCount: Ref<number>;
  schema?: MaybeRef<RawFormSchema<TValues> | SchemaOf<TValues> | undefined>;
  validateSchema?: (mode: SchemaValidationMode) => Promise<FormValidationResult<TValues>>;
  validate(): Promise<FormValidationResult<TValues>>;
  validateField(field: keyof TValues): Promise<ValidationResult>;
  errorBag: Ref<FormErrorBag<TValues>>;
  setFieldErrorBag(field: string, messages: string | string[]): void;
  stageInitialValue(path: string, value: unknown): void;
  meta: ComputedRef<{
    dirty: boolean;
    touched: boolean;
    valid: boolean;
    pending: boolean;
    initialValues: TValues;
  }>;
  isSubmitting: Ref<boolean>;
  handleSubmit(cb: SubmissionHandler<TValues>): (e?: Event) => Promise<void>;
  setFieldInitialValue(path: string, value: unknown): void;
}

export interface FormContext<TValues extends Record<string, any> = Record<string, any>>
  extends Omit<
    PrivateFormContext<TValues>,
    | 'register'
    | 'unregister'
    | 'fieldsByPath'
    | 'schema'
    | 'validateSchema'
    | 'errorBag'
    | 'setFieldErrorBag'
    | 'stageInitialValue'
    | 'setFieldInitialValue'
  > {
  errors: ComputedRef<FormErrors<TValues>>;
  handleReset: () => void;
  submitForm: (e?: unknown) => Promise<void>;
}
