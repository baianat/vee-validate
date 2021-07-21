import { useField, useForm, useValidateField } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useValidateField()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const rules = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('validates a single field', async () => {
    let validate!: ReturnType<typeof useValidateField>;
    mountWithHoc({
      setup() {
        useForm();
        const { errorMessage } = useField('test', rules);
        validate = useValidateField('test');

        return {
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
    await validate();
    await flushPromises();

    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('validates a single field from a child component without specifying a path', async () => {
    const ValidateBtn = defineComponent({
      setup() {
        const validate = useValidateField();

        return {
          validate,
        };
      },
      template: '<button @click="validate"></button>',
    });
    mountWithHoc({
      components: {
        ValidateBtn,
      },
      setup() {
        useForm();
        const { errorMessage } = useField('test', rules);

        return {
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
      <ValidateBtn />
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();

    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('validates array fields', async () => {
    let validate!: ReturnType<typeof useValidateField>;
    mountWithHoc({
      setup() {
        useForm();
        const { errorMessage } = useField('test', rules);
        useField('test', rules);
        validate = useValidateField('test');

        return {
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
    await validate();
    await flushPromises();

    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('warns if the field does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    let validate!: ReturnType<typeof useValidateField>;
    mountWithHoc({
      setup() {
        useForm();
        validate = useValidateField('something');

        return {};
      },
      template: `<div></div>`,
    });

    await validate();
    await flushPromises();
    expect(console.warn).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('warns if the form does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    let validate!: ReturnType<typeof useValidateField>;
    mountWithHoc({
      setup() {
        validate = useValidateField('something');

        return {};
      },
      template: `<div></div>`,
    });

    await validate();
    await flushPromises();
    expect(console.warn).toHaveBeenCalled();
    spy.mockRestore();
  });
});
