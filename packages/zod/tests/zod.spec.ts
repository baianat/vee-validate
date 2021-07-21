import { mountWithHoc, setValue, setChecked, flushPromises } from '../../vee-validate/tests/helpers';
import * as zod from 'zod';

import { toFieldValidator, toFormValidator } from '../src/index';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

test('validates field with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const rules = toFieldValidator(zod.string().nonempty(REQUIRED_MSG).min(8, MIN_MSG));

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
  expect(error.textContent).toBe(REQUIRED_MSG);
  setValue(input, '12');
  await flushPromises();
  expect(error.textContent).toBe(MIN_MSG);
  setValue(input, '12345678');
  await flushPromises();
  expect(error.textContent).toBe('');
});

test('validates form with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toFormValidator(
        zod.object({
          email: zod.string().email({ message: EMAIL_MSG }),
          password: zod.string().min(8, { message: MIN_MSG }),
        })
      );

      const initialValues = {
        email: '',
        password: '',
      };

      return {
        schema,
        initialValues,
      };
    },
    template: `
      <VForm as="form" :validationSchema="schema" :initialValues="initialValues" v-slot="{ errors }">
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

  setValue(email, 'hello@');
  setValue(password, '1234');
  await flushPromises();

  expect(emailError.textContent).toBe(EMAIL_MSG);
  expect(passwordError.textContent).toBe(MIN_MSG);

  setValue(email, 'hello@email.com');
  setValue(password, '12346789');
  await flushPromises();

  expect(emailError.textContent).toBe('');
  expect(passwordError.textContent).toBe('');
});

test('cross field validation with zod', async () => {
  const CONFIRM_MSG = "Passwords don't match";
  const wrapper = mountWithHoc({
    setup() {
      const original = zod
        .object({
          password: zod.string(),
          confirmation: zod.string(),
        })
        .refine(data => data.confirmation === data.password, {
          message: CONFIRM_MSG,
          path: ['confirmation'],
        });

      const schema = toFormValidator(original);

      const initialValues = {
        email: '',
        password: '',
      };

      return {
        schema,
        initialValues,
      };
    },
    template: `
      <VForm as="form" :validationSchema="schema" v-slot="{ errors }">
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
  expect(confirmationError.textContent).toBe(CONFIRM_MSG);

  setValue(password, '1234');
  setValue(confirmation, '1234');
  await flushPromises();
  expect(confirmationError.textContent).toBe('');
});

test('checkboxes with zod schema', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toFormValidator(
        zod.object({
          drink: zod.array(zod.string()).min(1, REQUIRED_MSG),
        })
      );

      const initialValues = {
        drink: [],
      };
      return {
        schema,
        initialValues,
      };
    },
    template: `
      <VForm :validation-schema="schema" :initialValues="initialValues" v-slot="{ errors, values }">
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
  expect(err.textContent).toBe(REQUIRED_MSG);
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
