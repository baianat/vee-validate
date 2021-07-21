import { useField, useForm, useResetForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useResetForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('resets a form', async () => {
    let resetForm: any;
    let value: any;
    let errorMessage: any;
    mountWithHoc({
      setup() {
        useForm();
        const field = useField('test', validate);
        value = field.value;
        errorMessage = field.errorMessage;
        resetForm = useResetForm();

        return {
          value,
          errorMessage,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);

    const inputValue = '123';

    resetForm({
      values: {
        test: inputValue,
      },
    });

    await flushPromises();
    expect(error?.textContent).toBe('');
    expect(input?.value).toBe(inputValue);
  });

  test('warns if the form does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    let resetForm: any;

    mountWithHoc({
      setup() {
        resetForm = useResetForm();

        return {};
      },
      template: `<div></div>`,
    });

    resetForm({
      values: {
        test: 'someValue',
      },
    });

    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
