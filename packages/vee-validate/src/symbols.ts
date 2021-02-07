import { ComputedRef, InjectionKey } from 'vue';
import { FormContext, PrivateFieldComposite } from './types';

export const FormContextSymbol: InjectionKey<FormContext> = Symbol('vee-validate-form');

export const FormErrorsSymbol: InjectionKey<ComputedRef<Record<string, string | undefined>>> = Symbol(
  'vee-validate-form-errors'
);

export const FormInitialValuesSymbol: InjectionKey<ComputedRef<Record<string, unknown>>> = Symbol(
  'vee-validate-form-initial-values'
);

export const FieldContextSymbol: InjectionKey<PrivateFieldComposite<unknown>> = Symbol('vee-validate-field-instance');
