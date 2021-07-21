import { useField, useForm, useIsFieldDirty } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useIsFieldDirty()', () => {
  test('gives access to a single field isDirty status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput } = useField('test');
        const isDirty = useIsFieldDirty('test');

        return {
          value,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isDirty.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to a single field isDirty status in a child component without specifying a path', async () => {
    const DirtyIcon = defineComponent({
      template: '<span>{{ isDirty.toString() }}</span>',
      setup() {
        const isDirty = useIsFieldDirty();

        return {
          isDirty,
        };
      },
    });
    mountWithHoc({
      components: {
        DirtyIcon,
      },
      setup() {
        useForm();
        const { value, handleInput } = useField('test');

        return {
          value,
          handleInput,
        };
      },
      template: `
        <input name="field" v-model="value" @input="handleInput" />
        <DirtyIcon />
      `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to array fields isDirty status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput } = useField('test');
        useField('test');
        const isDirty = useIsFieldDirty('test');

        return {
          value,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isDirty.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if field does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        useForm();
        const isDirty = useIsFieldDirty('something');

        return {
          isDirty,
        };
      },
      template: `
      <span>{{ isDirty.toString() }}</span>
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
        const isDirty = useIsFieldDirty('something');

        return {
          isDirty,
        };
      },
      template: `
      <span>{{ isDirty.toString() }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
