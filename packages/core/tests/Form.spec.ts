import flushPromises from 'flush-promises';
import { defineRule } from '@vee-validate/core';
import { mountWithHoc, setValue, setChecked } from './helpers';
import * as yup from 'yup';
import { ref, Ref } from 'vue';

describe('<Form />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', value => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm as="form" />
      </div>
    `,
    });

    expect(wrapper.$el.innerHTML).toBe(`<form novalidate=""></form>`);
  });

  test('observes the current state of providers', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form" v-slot="{ meta }">
        <Field name="field" rules="required" as="input" type="text" />

        <span id="state">{{ meta.valid }}</span>
      </VForm>
    `,
    });

    const stateSpan = wrapper.$el.querySelector('#state');
    const input = wrapper.$el.querySelector('input');
    setValue(input, '');

    await flushPromises();
    // initially the field valid flag is false.
    expect(stateSpan.textContent).toBe('false');

    setValue(input, 'value');
    await flushPromises();

    expect(stateSpan.textContent).toBe('true');
  });

  test('submit handler only executes if observer is valid', async () => {
    let calls = 0;
    const wrapper = mountWithHoc({
      setup() {
        return {
          submit() {
            calls++;
          },
        };
      },
      template: `
      <VForm @submit="submit" as="form" v-slot="{ errors }">
        <Field name="field" rules="required" as="input" />
        <span id="error">{{ errors.field }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    await flushPromises();
    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(calls).toBe(0);

    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(error.textContent).toBe('');
    expect(calls).toBe(1);
  });

  test('handles reset', async () => {
    let isReset = false;
    const wrapper = mountWithHoc({
      setup() {
        return {
          reset: () => {
            isReset = true;
          },
        };
      },
      template: `
      <VForm @reset="reset" as="form" v-slot="{ errors }">
        <Field rules="required" name="field" as="input"/>
        <span id="error">{{ errors.field }}</span>

        <button id="submit">Validate</button>
        <button id="reset" type="reset">Reset</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('#submit').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    wrapper.$el.querySelector('#reset').click();
    await flushPromises();

    expect(error.textContent).toBe('');
    expect(isReset).toBe(true);
  });

  test('disabled fields do not participate in validation', async () => {
    let isInObject = false;
    const wrapper = mountWithHoc({
      setup() {
        return {
          disabled: false,
          submit: (values: Record<string, any>) => {
            isInObject = 'field' in values;
          },
        };
      },
      template: `
      <VForm @submit="submit" as="form">
        <Field rules="required" name="field" as="input" :disabled="disabled"/>

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    setValue(input, '123');
    const button = wrapper.$el.querySelector('#submit');

    button.click();
    await flushPromises();

    expect(isInObject).toBe(true);

    (wrapper as any).disabled = true;
    button.click();
    await flushPromises();

    expect(isInObject).toBe(false);
  });

  test('initial values can be set with initialValues prop', async () => {
    const initialValues = {
      field: 'hello',
    };
    const wrapper = mountWithHoc({
      setup() {
        return {
          initialValues,
        };
      },
      template: `
      <VForm :initialValues="initialValues" @submit="submit" as="form">
        <Field rules="required" name="field" as="input" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');

    expect(input.value).toBe(initialValues.field);
  });

  test('having no submit listener will submit the form natively', async () => {
    const submitMock = jest.fn();
    const wrapper = mountWithHoc({
      template: `
      <VForm @submit="submit" as="form" v-slot="{ errors }">
        <Field name="field" rules="required" as="input" />
        <span id="error">{{ errors.field }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const form = wrapper.$el;
    form.submit = submitMock;
    const input = wrapper.$el.querySelector('input');
    await flushPromises();

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(submitMock).toHaveBeenCalledTimes(0);

    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  test('can be renderless', async () => {
    const submitMock = jest.fn();
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm as="" v-slot="{ errors, submitForm }">
          <form @submit="submitForm">
            <Field name="field" rules="required" as="input" />
            <span id="error">{{ errors.field }}</span>

            <button>Validate</button>
          </form>
        </VForm>
      </div>
    `,
    });

    const form = wrapper.$el.querySelector('form');
    form.submit = submitMock;
    const input = wrapper.$el.querySelector('input');
    await flushPromises();

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(submitMock).toHaveBeenCalledTimes(0);

    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  test('validation schema with yup', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field id="email" name="email" as="input" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" as="input" type="password" />
        <span id="passwordErr">{{ errors.password }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const email = wrapper.$el.querySelector('#email');
    const password = wrapper.$el.querySelector('#password');
    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(emailError.textContent).toBe('email is a required field');
    expect(passwordError.textContent).toBe('password is a required field');

    setValue(email, 'hello@');
    setValue(password, '1234');
    await flushPromises();

    expect(emailError.textContent).toBe('email must be a valid email');
    expect(passwordError.textContent).toBe('password must be at least 8 characters');

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
  });

  test('validation schema to validate form', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          field: 'required',
          other: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field name="field" as="input" />
        <span id="field">{{ errors.field }}</span>
        
        <Field name="other" as="input" />
        <span id="other">{{ errors.other }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const first = wrapper.$el.querySelector('#field');
    const second = wrapper.$el.querySelector('#other');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(first.textContent).toBe(REQUIRED_MESSAGE);
    expect(second.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('cross field validation with yup schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          password: yup.string().required(),
          confirmation: yup.string().oneOf([yup.ref('password')], 'passwords must match'),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field id="password" name="password" as="input" />
        <span id="field">{{ errors.password }}</span>
        
        <Field id="confirmation" name="confirmation" as="input" />
        <span id="confirmationError">{{ errors.confirmation }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const password = wrapper.$el.querySelector('#password');
    const confirmation = wrapper.$el.querySelector('#confirmation');
    const confirmationError = wrapper.$el.querySelector('#confirmationError');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    setValue(password, 'hello@');
    setValue(confirmation, '1234');
    await flushPromises();
    expect(confirmationError.textContent).toBe('passwords must match');

    setValue(password, '1234');
    setValue(confirmation, '1234');
    await flushPromises();
    expect(confirmationError.textContent).toBe('');
  });

  test('supports radio inputs', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors }">
        <Field name="drink" as="input" type="radio" value="" /> Coffee
        <Field name="drink" as="input" type="radio" value="Tea" /> Tea
        <Field name="drink" as="input" type="radio" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');
  });
  
  test('supports radio inputs with check after submit', async () => {
    console.log('radios');
    const initialValues = { test: 'one' };

    const showFields = ref(true);
    const result = ref();

    const wrapper = mountWithHoc({
      setup() {
        const values = ['one', 'two', 'three'];
        const onSubmit = (formData: Record<string, any>) => {
          result.value = formData.test;
        };

        return {
          values,
          onSubmit,
          initialValues,
          showFields,
          result,
        };
      },
      template: ` 
      <VForm  @submit="onSubmit"  >
      
      <label v-for="(value, index) in values" v-bind:key="index">
              <div v-if="showFields">

        <Field name="test" as="input" type="radio" :value="value" /> {{value}}
        </div>
              </label>
    
        <button>Submit</button>
        <div>{{$result}}</div>
      </VForm>
    `,
    });

    // const err = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    setChecked(inputs[1]);
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    showFields.value = false;
    await flushPromises();
    expect(result.value).toBe('two');
  });

  test('supports checkboxes inputs', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');

    expect(values.textContent).toBe(['Coke', '', 'Tea'].toString());

    setChecked(inputs[1], false);
    await flushPromises();
    expect(values.textContent).toBe(['Coke', ''].toString());
  });

  test('supports a singular checkbox', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" as="input" type="checkbox" :value="true" /> Coffee

        <span id="err">{{ errors.drink }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const input = wrapper.$el.querySelector('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(input, true);
    await flushPromises();
    expect(err.textContent).toBe('');
    setChecked(input, false);
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('unmounted fields gets unregistered and their values cleaned up', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          field: 'required',
          drink: 'required',
        };

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors, values }">
        <template v-if="showFields">
          <Field name="field" as="input" />          
          <Field name="drink" as="input" type="checkbox" value="" /> Coffee
          <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        </template>
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[2]);
    setChecked(inputs[3]);
    await flushPromises();

    showFields.value = false;
    await flushPromises();
    expect(errors.textContent).toBe('{}');
    expect(values.textContent).toBe(JSON.stringify({ drink: ['Coke'] }, null, 2));
  });

  test('checkboxes with yup schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          drink: yup.array().required().min(1),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');

    expect(values.textContent).toBe(['Coke', '', 'Tea'].toString());

    setChecked(inputs[1], false);
    await flushPromises();
    expect(values.textContent).toBe(['Coke', ''].toString());
  });

  test('checkboxes v-model value syncing', async () => {
    let drinks!: Ref<string[]>;
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          drink: yup.array().required(),
        });

        drinks = ref([]);

        return {
          schema,
          drinks,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(drinks.value).toEqual(['Tea']);

    drinks.value = [];
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    expect(values.textContent).toBe('');

    drinks.value = ['Coke'];
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(values.textContent).toBe(['Coke'].toString());
  });

  test('isSubmitting state', async () => {
    jest.useFakeTimers();

    let throws = false;
    let errMsg = '';
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit() {
            return new Promise((resolve, reject) => {
              if (throws) {
                setTimeout(() => {
                  reject(new Error('Sorry'));
                }, 500);
                return;
              }

              setTimeout(resolve, 1000);
            }).catch(err => {
              errMsg = err.message;

              throw err;
            });
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" as="form" v-slot="{ isSubmitting }">

        <button id="submit">Submit</button>
        <span id="submitting">{{ isSubmitting }}</span>
      </VForm>
    `,
    });

    const submit = wrapper.$el.querySelector('#submit');
    const submitting = wrapper.$el.querySelector('#submitting');
    submit.click();
    await flushPromises();
    expect(submitting.textContent).toBe('true');
    jest.advanceTimersByTime(1001);
    await flushPromises();
    expect(submitting.textContent).toBe('false');

    throws = true;
    submit.click();
    await flushPromises();
    expect(submitting.textContent).toBe('true');
    jest.advanceTimersByTime(501);
    await flushPromises();
    expect(submitting.textContent).toBe('false');
    expect(errMsg).toBe('Sorry');

    jest.useRealTimers();
  });

  test('aggregated meta reactivity', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm @submit="onSubmit" v-slot="{ meta }">
        <Field name="field" as="input" rules="required"  />

        <button :disabled="meta.invalid" id="submit">Submit</button>
      </VForm>
    `,
    });

    const submitBtn = wrapper.$el.querySelector('#submit');
    const input = wrapper.$el.querySelector('input');
    await flushPromises();
    expect(submitBtn.disabled).toBe(true);
    setValue(input, '12');
    await flushPromises();
    expect(submitBtn.disabled).toBe(false);
  });
});
