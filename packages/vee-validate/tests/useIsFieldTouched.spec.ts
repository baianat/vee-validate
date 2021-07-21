import { useField, useForm, useIsFieldTouched } from '@/vee-validate';
import { dispatchEvent, mountWithHoc, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useIsFieldTouched()', () => {
  test('gives access to a single field isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        const isTouched = useIsFieldTouched('test');

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to a single field isTouched status in child components without path prop', async () => {
    const TouchedIcon = defineComponent({
      template: '<span>{{ isTouched.toString() }}</span>',
      setup() {
        const isTouched = useIsFieldTouched();

        return {
          isTouched,
        };
      },
    });
    mountWithHoc({
      components: {
        TouchedIcon,
      },
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');

        return {
          value,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <TouchedIcon />
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to array fields isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        useField('test');
        const isTouched = useIsFieldTouched('test');

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if field does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        useForm();
        const isTouched = useIsFieldTouched('something');

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

  test('returns false and warns if form does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isTouched = useIsFieldTouched('something');

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
