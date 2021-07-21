import { useField, useForm, useIsFormTouched } from '@/vee-validate';
import { dispatchEvent, mountWithHoc, flushPromises } from './helpers';

describe('useIsFormTouched()', () => {
  test('gives access to the forms isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        const isTouched = useIsFormTouched();

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString()  }}</span>
    `,
    });

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isTouched = useIsFormTouched();

        return {
          isTouched,
        };
      },
      template: `
      <span>{{ isTouched.toString() }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
