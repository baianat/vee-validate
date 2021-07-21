import { useField, useFieldError, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useFieldError()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('gives access to a single field error message', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const message = useFieldError('test');

        return {
          value,
          message,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ message }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('gives access to a single field error message in a child component with specifying a path', async () => {
    const CustomErrorComponent = defineComponent({
      template: '<span>{{ message }}</span>',
      setup() {
        const message = useFieldError();

        return {
          message,
        };
      },
    });
    mountWithHoc({
      components: {
        CustomErrorComponent,
      },
      setup() {
        useForm();
        const { value } = useField('test', validate);

        return {
          value,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <CustomErrorComponent />
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('gives access to array fields error message', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        useField('test', validate);
        const message = useFieldError('test');

        return {
          value,
          message,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ message }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('returns undefined if field not found', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const message = useFieldError('something');

        return {
          message,
        };
      },
      template: `
      <span>{{ message }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });

  test('returns undefined if form is not found', async () => {
    mountWithHoc({
      setup() {
        const message = useFieldError('something');

        return {
          message,
        };
      },
      template: `
      <span>{{ message }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });
});
