import { defineRule, configure } from '@/vee-validate';
import { mountWithHoc, setValue, dispatchEvent, setChecked, flushPromises } from './helpers';
import * as yup from 'yup';
import { reactive, ref, Ref } from 'vue';

jest.useFakeTimers();

beforeEach(() => {
  configure({
    bails: true,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
    generateMessage: undefined,
  });
});

describe('<Field />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', (value: string) => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  defineRule('email', (email: string) => {
    return email === 'email' ? true : 'The field must be a valid email';
  });

  defineRule('min', (value: string, [min]: any) => {
    return value && value.length >= min ? true : 'This field must be at least 3 characters';
  });

  // FIXME: typing here should be more lax
  defineRule('confirmed', (value: string, [target]: any) => {
    return value === target ? true : 'inputs do not match';
  });

  defineRule('confirmedObj', (value: string, { target }: any) => {
    return value === target ? true : 'inputs do not match';
  });

  test('renders an input by default', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" as="input" />
    `,
    });

    expect(wrapper.$el.tagName).toBe(`INPUT`);
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" as="div" />
    `,
    });

    expect(wrapper.$el.tagName).toBe(`DIV`);
  });

  test('renderless if no as prop and default slot exists', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" v-slot="{ field }">
        <select v-bind="field">
          <option>1</option>
        </select>
      </Field>
    `,
    });

    expect(wrapper.$el.tagName).toBe(undefined);
  });

  test('accepts functions to be passed as rules', async () => {
    const isRequired = (val: any) => (val ? true : 'Field is required');

    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: isRequired,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field, meta }">
          <input v-bind="field" type="text">
          <span>{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('span');
    expect(error.textContent).toBe('');
    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe('Field is required');
  });

  test('accepts objects to be passed as rules', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: { required: true, min: [3], confirmedObj: { target: '@other' } },
        };
      },
      template: `
      <VForm as="form">
        <Field name="field" :rules="rules" v-slot="{ errors, field }">
          <input v-bind="field" type="text">
          <span id="fieldError">{{ errors[0] }}</span>
        </Field>
    
        <Field name="other" rules="required" v-slot="{ errors, field }">
          <input v-bind="field" type="text">
          <span>{{ errors[0] }}</span>
        </Field>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#fieldError');
    expect(error.textContent).toBe('');
    setValue(input, '1');
    await flushPromises();
    expect(error.textContent).toBe('This field must be at least 3 characters');
    setValue(input, '123');
    await flushPromises();
    expect(error.textContent).toBe('inputs do not match');
  });

  test('listens for input and blur events to set meta flags', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ errors, field, meta }">
          <input v-bind="field" type="text">
          <pre id="pre">{{ meta }}</pre>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const pre = wrapper.$el.querySelector('pre');

    expect(pre.textContent).toContain('"touched": false');
    expect(pre.textContent).toContain('"dirty": false');
    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(pre.textContent).toContain('"touched": true');
    expect(pre.textContent).toContain('"dirty": false');
    dispatchEvent(input, 'input');
    await flushPromises();
    expect(pre.textContent).toContain('"dirty": true');
  });

  test('listens for change events', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form" v-slot="{ errors }">
        <Field name="select" as="select" rules="required">
          <option value="">0</option>
          <option value="1">1</option>
        </Field>
        <span id="error">{{ errors.select }}</span>
      </VForm>
    `,
    });

    const select = wrapper.$el.querySelector('select');
    const error = wrapper.$el.querySelector('#error');

    setValue(select, '');
    await flushPromises();
    // validation triggered on change.
    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(select, '1');
    await flushPromises();

    expect(error.textContent).toBe('');
  });

  test('validates initially with validateOnMount prop', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" validateOnMount rules="required" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');

    // flush the pending validation.
    await flushPromises();

    expect(error.textContent).toContain(REQUIRED_MESSAGE);
  });

  test('watches rules and re-validates', async () => {
    let rules!: Ref<any>;
    const wrapper = mountWithHoc({
      setup() {
        rules = ref({ required: true });

        return {
          rules,
        };
      },
      template: `
        <div>
          <Field name="field" :rules="rules" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#error');
    setValue(input, '1');
    // flush the pending validation.
    await flushPromises();

    expect(error.textContent).toBe('');

    rules.value = {
      required: false,
      min: 3,
    };

    await flushPromises();
    expect(error.textContent).toBe('This field must be at least 3 characters');
  });

  test('validates custom components', async () => {
    const wrapper = mountWithHoc({
      components: {
        TextInput: {
          props: ['value'],
          template: `
            <div>
              <input id="input" :value="value" @input="$emit('change', $event.target.value)">
            </div>
          `,
        },
      },
      template: `
        <div>
          <Field name="field" rules="required" v-slot="{ field, errors }">
            <TextInput ref="input" v-bind="field" />
            <span id="error">{{ errors && errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('#input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(input, 'val');
    await flushPromises();
    expect(error.textContent).toBe('');
  });

  test('validates target fields using targeted params', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form">
        <Field rules="required" name="confirmation" as="input" />

        <Field name="password" rules="required|confirmed:@confirmation" v-slot="{ field, errors }">
          <input type="password" v-bind="field">
          <span id="err">{{ errors[0] }}</span>
        </Field>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    expect(error.textContent).toBeFalsy();
    setValue(inputs[0], 'val');
    await flushPromises();
    // the password input hasn't changed yet.
    expect(error.textContent).toBeFalsy();
    setValue(inputs[1], '12');
    await flushPromises();
    // the password input was interacted with and should be validated.
    expect(error.textContent).toBeTruthy();

    setValue(inputs[1], 'val');
    await flushPromises();
    // the password input now matches the confirmation.
    expect(error.textContent).toBeFalsy();

    setValue(inputs[0], 'val1');
    await flushPromises();
    expect(error.textContent).toBeTruthy();
  });

  test('validates file input in scoped slots', async () => {
    defineRule('atLeastOne', (files: File[]) => {
      return files && files.length >= 1;
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required|atLeastOne" v-slot="{ field, errors }">
          <input type="file" v-bind="field">
          <p id="error">{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    dispatchEvent(input, 'change');
    await flushPromises();

    const error = wrapper.$el.querySelector('#error');
    expect(error.textContent).toBeTruthy();
  });

  test('validates file input by rendering', async () => {
    defineRule('atLeastOne', (files: File[]) => {
      return files && files.length >= 1;
    });

    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors }">
        <Field name="field" rules="required|atLeastOne" type="file" />
        <span id="error">{{ errors.field }}</span>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    dispatchEvent(input, 'change');
    await flushPromises();

    const error = wrapper.$el.querySelector('#error');
    expect(error.textContent).toBeTruthy();
  });

  test('setting bails prop to false disables exit on first error', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field :bails="false" name="field" rules="email|min:3" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p v-for="error in errors">{{ error }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    setValue(input, '1');
    await flushPromises();

    const errors = wrapper.$el.querySelectorAll('p');
    expect(errors).toHaveLength(2);
    expect(errors[0].textContent).toBe('The field must be a valid email');
    expect(errors[1].textContent).toBe('This field must be at least 3 characters');
  });

  test('yup rules can be used', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().required().min(8);

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p>{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('p');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe('this is a required field');
    setValue(input, '12');
    await flushPromises();
    expect(error.textContent).toBe('this must be at least 8 characters');
    setValue(input, '12345678');
    await flushPromises();
    expect(error.textContent).toBe('');
  });

  test('avoids race conditions between successive validations', async () => {
    // A decreasing timeout (the most recent validation will finish before new ones).
    defineRule('longRunning', (value: unknown): Promise<boolean | string> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(value === 42 ? true : 'No Life');
        }, 20);
      });
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required|longRunning" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p>{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('p');

    setValue(input, '123');
    setValue(input, '12');
    setValue(input, '');
    jest.advanceTimersByTime(100);
    await flushPromises();
    // LAST message should be the required one.
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('resets validation state using handleReset() in slot scope props', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ field, errors, handleReset }">
          <input type="text" v-bind="field">
          <span id="error">{{ errors && errors[0] }}</span>
          <button @click="handleReset">Reset</button>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '123');
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(error.textContent).toBe('');
    expect(input.value).toBe('');
  });

  test('resets validation state using resetField() in slot scope props', async () => {
    const resetMessage = 'field is bad';
    const resetValue = 'val';
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ field, errors, resetField, meta }">
          <input type="text" v-bind="field">
          <span id="error">{{ errors && errors[0] }}</span>
          <span id="touched">{{ meta.touched.toString() }}</span>
          <span id="dirty">{{ meta.dirty.toString() }}</span>
          <button @click="resetField({ value: '${resetValue}', touched: true, errors: ['${resetMessage}'] })">Reset</button>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    const dirty = wrapper.$el.querySelector('#dirty');
    const touched = wrapper.$el.querySelector('#touched');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    expect(dirty.textContent).toBe('true');
    expect(touched.textContent).toBe('false');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(error.textContent).toBe(resetMessage);
    expect(input.value).toBe(resetValue);
    expect(dirty.textContent).toBe('false');
    expect(touched.textContent).toBe('true');
  });

  test('yup abortEarly is set by bails global option', async () => {
    configure({
      bails: false,
    });
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().min(8).url();

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field }">
          <input type="text" v-bind="field">
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('ul');
    const input = wrapper.$el.querySelector('input');
    expect(errors.children).toHaveLength(0);

    setValue(input, '1234');
    await flushPromises();
    expect(errors.children).toHaveLength(2);
  });

  test('yup abortEarly is set by bails prop', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().min(8).url();

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field }" :bails="false">
          <input type="text" v-bind="field">
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('ul');
    const input = wrapper.$el.querySelector('input');
    expect(errors.children).toHaveLength(0);

    setValue(input, '1234');
    await flushPromises();
    expect(errors.children).toHaveLength(2);
  });

  test('is synced with v-model', async () => {
    let inputValue!: Ref<string>;
    const wrapper = mountWithHoc({
      setup() {
        inputValue = ref('');
        return {
          value: inputValue,
        };
      },
      template: `
      <div>
        <Field v-model="value" type="text" name="field" />
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    setValue(input, '1234');
    await flushPromises();
    expect(inputValue.value).toBe('1234');

    inputValue.value = '455';
    await flushPromises();
    expect(input.value).toBe('455');
  });

  test('generateMessage is invoked with custom fn rules', async () => {
    configure({
      generateMessage: ({ field }) => `${field} is bad`,
    });
    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: () => false,
        };
      },
      template: `
      <div>
        <Field :rules="rules" name="field" v-slot="{ field, errors }">
          <input type="text" v-bind="field">
          <p id="error">{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#error');
    setValue(input, '1234');
    await flushPromises();
    expect(error.textContent).toBe('field is bad');
  });

  test('can customize validation triggers via global config', async () => {
    configure({
      validateOnChange: false,
      validateOnInput: true,
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    input.value = '';
    dispatchEvent(input, 'change');
    await flushPromises();
    // nothing got triggered
    expect(error.textContent).toBe('');

    input.value = '';
    dispatchEvent(input, 'input');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('can customize validation triggers via props', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ field, errors }" validateOnInput :validateOnChange="false">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    input.value = '';
    dispatchEvent(input, 'change');
    await flushPromises();
    // nothing got triggered
    expect(error.textContent).toBe('');

    input.value = '';
    dispatchEvent(input, 'input');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('can show custom labels for fields in messages', async () => {
    configure({
      generateMessage: ({ field }) => `${field} is bad`,
    });

    defineRule('noMessage', (value: number) => {
      return value === 48;
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="_bad_field_name" label="nice name" rules="noMessage" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    setValue(input, '3');
    await flushPromises();
    expect(error.textContent).toBe('nice name is bad');
  });

  test('can set touched meta', async () => {
    mountWithHoc({
      template: `
      <Field name="field" v-slot="{ meta, setTouched }">
        <span>{{ meta.touched }}</span>
        <button @click="setTouched(true)">Set Meta</button>
      </Field>
    `,
    });

    await flushPromises();
    const span = document.querySelector('span');
    expect(span?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });

  // #3053
  test('labels can be set dynamically', async () => {
    const label = ref('label');
    const message = (field: string) => `${field} is not valid`;

    mountWithHoc({
      setup() {
        const rules = (_: any, { field }: any) => message(field);

        return {
          rules,
          label,
        };
      },
      template: `
        <Field name="field" :rules="rules" :label="label" v-slot="{ errors, field }">
          <input v-bind="field" type="text">
          <span>{{ errors[0] }}</span>
        </Field>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    setValue(input, '1');
    await flushPromises();
    expect(document.querySelector('span')?.textContent).toBe(message(label.value));

    label.value = 'updated';
    await flushPromises();
    setValue(input, '2');
    await flushPromises();
    expect(document.querySelector('span')?.textContent).toBe(message(label.value));
  });

  // #3048
  test('proxies native listeners', async () => {
    const onBlur = jest.fn();
    mountWithHoc({
      setup() {
        return {
          onBlur,
        };
      },
      template: `
      <Field name="field" @blur="onBlur" />
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    dispatchEvent(input as HTMLInputElement, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('can customize checkboxes unchecked value', async () => {
    const spy = jest.fn();
    const wrapper = mountWithHoc({
      setup() {
        return { onSubmit: spy };
      },
      template: `
      <VForm @submit="onSubmit">
        <Field name="terms" as="input" type="checkbox" :unchecked-value="false" :value="true" /> Coffee

        <button type="submit">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    setChecked(input, true);
    await flushPromises();
    setChecked(input, false);
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ terms: false }), expect.anything());
  });

  // #3105
  test('single checkboxes without forms toggles their value with v-model', async () => {
    let model!: Ref<boolean>;
    const wrapper = mountWithHoc({
      setup() {
        model = ref(false);

        return { model };
      },
      template: `
      <div>
        <Field name="terms" type="checkbox" v-model="model" :unchecked-value="false" :value="true" /> Dinner?
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    setChecked(input, true);
    await flushPromises();
    expect(model.value).toBe(true);
    setChecked(input, false);
    await flushPromises();
    expect(model.value).toBe(false);
  });

  // #3107
  test('sets initial value with v-model', async () => {
    const modelValue = 'allo';
    const wrapper = mountWithHoc({
      setup() {
        const model = ref(modelValue);

        return { model };
      },
      template: `
      <div>
        <Field name="whatever" v-model="model" />
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    expect(input.value).toBe(modelValue);
  });

  test('resetField should reset the valid flag to true', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="whatever" v-slot="{ meta, field, resetField }" rules="required">
          <input v-bind="field" />
          <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
          <button @click="resetField">Reset</button>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    const meta = wrapper.$el.querySelector('#meta');

    expect(meta?.textContent).toBe('invalid');
    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(meta?.textContent).toBe('valid');
  });

  test('valid flag is synced with the field errors array length', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="whatever" v-slot="{ meta, field, resetField }" rules="required">
          <input v-bind="field" />
          <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
          <button @click="resetField({ errors: ['bad'] })">Reset</button>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const meta = wrapper.$el.querySelector('#meta');
    expect(meta?.textContent).toBe('invalid');
    const input = wrapper.$el.querySelector('input');
    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');
  });

  test('can set multiple field errors', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="whatever" v-slot="{ field, errors, setErrors }" rules="required">
          <input v-bind="field" />
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
          <button type="button" @click="setErrors(['bad', 'wrong'])">Set errors</button>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const list = document.querySelector('ul');
    expect(list?.children).toHaveLength(0);
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(list?.children).toHaveLength(2);
    expect(list?.textContent).toBe('badwrong');
  });

  // #3230
  test('v-model.number should not ignore the validation triggers', async () => {
    const errorMessage = 'Field is invalid';
    let model!: Ref<string | number>;
    const wrapper = mountWithHoc({
      setup() {
        model = ref('');
        const isAlwaysInvalid = () => errorMessage;

        return { model, isAlwaysInvalid };
      },
      template: `
      <div>
        <Field v-model.number="model" name="field" :rules="isAlwaysInvalid" v-slot="{ field, errors }" :validateOnModelUpdate="false">
          <input v-bind="field" id="input" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('#input');
    input.value = '310';
    dispatchEvent(input, 'input');
    await flushPromises();
    expect(model.value).toBe(310);
    expect(error.textContent).toBe('');

    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(error.textContent).toBe(errorMessage);
  });

  //  #3312
  test('v-model on a non-existent nested prop should still emit model events', async () => {
    const form = reactive({});
    const wrapper = mountWithHoc({
      setup() {
        return { form };
      },
      template: `
      <div>
        <Field v-model="form.field" name="field" />
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    input.value = 'hello';
    dispatchEvent(input, 'input');
    await flushPromises();
    expect((form as any).field).toBe('hello');
  });
});
