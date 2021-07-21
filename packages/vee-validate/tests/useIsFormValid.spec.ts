import { useIsFormValid, useField, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useIsFormValid()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('returns validity of the form', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const isValid = useIsFormValid();

        return {
          value,
          isValid,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ isValid.toString() }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const span = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(span?.textContent).toBe('false');
    setValue(input as any, '12');
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });

  test('returns false and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isValid = useIsFormValid();

        return {
          isValid,
        };
      },
      template: `
      <span>{{ isValid.toString() }}</span>
    `,
    });

    await flushPromises();
    const span = document.querySelector('span');
    expect(span?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
