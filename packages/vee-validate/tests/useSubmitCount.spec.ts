import { useField, useForm, useSubmitCount } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';

describe('useSubmitCount()', () => {
  test('indicates the number of submissions', async () => {
    mountWithHoc({
      setup() {
        const { submitForm } = useForm();
        useField('test');
        const submitCount = useSubmitCount();

        return {
          submitCount,
          submitForm,
        };
      },
      template: `
      <button @click="submitForm()">Submit</button>
      <span>{{ submitCount }}</span>
    `,
    });

    await flushPromises();
    const button = document.querySelector('button');
    const submitText = document.querySelector('span');
    expect(submitText?.textContent).toBe('0');
    button?.click();
    await flushPromises();
    expect(submitText?.textContent).toBe('1');
  });

  test('returns 0 and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    mountWithHoc({
      setup() {
        const submitCount = useSubmitCount();

        return {
          submitCount,
        };
      },
      template: `
      <span>{{ submitCount }}</span>
    `,
    });

    await flushPromises();
    const submitText = document.querySelector('span');
    expect(submitText?.textContent).toBe('0');
    expect(console.warn).toHaveBeenCalled();
    spy.mockRestore();
  });
});
