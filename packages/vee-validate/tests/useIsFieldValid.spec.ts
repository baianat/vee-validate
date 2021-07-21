import { useField, useIsFieldValid, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useIsFieldValid()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('returns the validity of a single field', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const isValid = useIsFieldValid('test');

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

  test('returns the validity of a single field in child components without specifying a path', async () => {
    const ValidIcon = defineComponent({
      template: '<span>{{ isValid.toString() }}</span>',
      setup() {
        const isValid = useIsFieldValid();

        return {
          isValid,
        };
      },
    });
    mountWithHoc({
      components: {
        ValidIcon,
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
      <ValidIcon />
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

  test('returns the validity of array fields', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        useField('test', validate);
        const isValid = useIsFieldValid('test');

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

  test('returns false and warns if field is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        useForm();
        const isValid = useIsFieldValid('test');

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

  test('returns false and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isValid = useIsFieldValid('test');

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
