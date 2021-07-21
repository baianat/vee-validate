import { useField, useForm, useSubmitForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useSubmitForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('executes a form submission callback', async () => {
    const spy = jest.fn();
    mountWithHoc({
      setup() {
        useForm();
        const field = useField('test', validate);
        const value = field.value;
        const errorMessage = field.errorMessage;
        const submitForm = useSubmitForm(spy);

        return {
          value,
          errorMessage,
          submitForm,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ errorMessage }}</span>
      <button @click="submitForm"></button>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    const submitBtn = document.querySelector('button');
    submitBtn?.click();
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
    expect(spy).not.toHaveBeenCalled();

    const inputValue = '123';

    setValue(input as any, inputValue);
    submitBtn?.click();
    await flushPromises();
    expect(spy).toHaveBeenCalledWith({ test: inputValue }, expect.anything());
  });

  test('warns if the form does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        useSubmitForm(() => {
          // nothing...
        });

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
