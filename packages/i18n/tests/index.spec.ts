import { defineRule, configure } from '@/vee-validate';
import { required, between } from '@/rules';
import { localize, setLocale } from '@/i18n';
import { mountWithHoc, setValue, flushPromises } from '../../vee-validate/tests/helpers';

defineRule('required', required);
defineRule('between', between);

localize('en', {
  messages: {
    required: 'The {field} is required',
  },
});

test('can define new locales', async () => {
  configure({
    generateMessage: localize('ar', {
      messages: {
        required: 'هذا الحقل مطلوب',
      },
    }),
  });

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

  expect(error.textContent).toContain('هذا الحقل مطلوب');
});

test('can define specific messages for specific fields', async () => {
  configure({
    generateMessage: localize('en', {
      fields: {
        test: {
          required: 'WRONG!',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="test" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="name" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('WRONG!');
  expect(errors[1].textContent).toContain('The name is required');
});

test('can merge locales without setting the current one', async () => {
  configure({
    generateMessage: localize({
      ar: {
        messages: {
          required: 'هذا الحقل مطلوب',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="field" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The field is required');
});

test('falls back to the default message if rule without message exists', async () => {
  defineRule('i18n', () => false);

  const wrapper = mountWithHoc({
    template: `
      <div>
        <Field name="field" rules="required|i18n" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
  });

  const error = wrapper.$el.querySelector('#error');
  const input = wrapper.$el.querySelector('input');
  setValue(input, '12');
  await flushPromises();

  expect(error.textContent).toContain('field is not valid');
});

test('can switch between locales with setLocale', async () => {
  configure({
    generateMessage: localize({
      en: {
        messages: {
          required: 'This field is required',
        },
      },
      ar: {
        messages: {
          required: 'هذا الحقل مطلوب',
        },
      },
    }),
  });

  setLocale('en');

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

  expect(error.textContent).toContain('This field is required');
  setLocale('ar');
  setValue(wrapper.$el.querySelector('input'), '');

  await flushPromises();
  expect(error.textContent).toContain('هذا الحقل مطلوب');
});

test('interpolates object params with short format', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: `The {field} field must be between {min} and {max}`,
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates object params with extended format', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: `The {field} field must be between 0:{min} and 1:{max}`,
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates array params', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: 'The {field} field must be between 0:{min} and 1:{max}',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1, 10] }" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates string params', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: 'The {field} field must be between 0:{min} and 1:{max}',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" rules="between:1,10" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

describe('interpolation preserves placeholders if not found', () => {
  test('array format', async () => {
    configure({
      generateMessage: localize('en', {
        messages: {
          between: 'The {field} field must be between 0:{min} and 1:{max}',
        },
      }),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1] }" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const error = wrapper.$el.querySelector('#error');
    // flush the pending validation.
    await flushPromises();

    // locale wasn't set.
    expect(error.textContent).toContain('The name field must be between 1 and 1:{max}');
  });

  test('object format', async () => {
    configure({
      generateMessage: localize('en', {
        messages: {
          between: 'The {field} field must be between 0:{min} and 1:{max}',
        },
      }),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 0 } }" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const error = wrapper.$el.querySelector('#error');
    // flush the pending validation.
    await flushPromises();

    // locale wasn't set.
    expect(error.textContent).toContain('The name field must be between 0 and {max}');
  });
});
