import { useField, useForm, useFormErrors } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useFormErrors()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('gives access to all form errors', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const messages = useFormErrors();

        return {
          value,
          messages,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ messages.test }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('returns empty object and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const messages = useFormErrors();

        return {
          messages,
        };
      },
      template: `
      <span>{{ messages }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('{}');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
