import { useField } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useField()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  test('validates when value changes', async () => {
    mountWithHoc({
      setup() {
        const { value, errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

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

    const input = document.querySelector('input');
    const error = document.querySelector('span');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('valid flag is true after reset', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
      <button @click="resetField()">Reset</button>
    `,
    });

    const input = document.querySelector('input') as HTMLInputElement;
    const meta = document.querySelector('#meta');

    await flushPromises();
    expect(meta?.textContent).toBe('invalid');

    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('valid');
  });

  test('valid flag is synced with fields errors length', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
      <button @click="resetField({ errors: ['bad'] })">Reset</button>
    `,
    });

    await flushPromises();
    const meta = document.querySelector('#meta');
    const input = document.querySelector('input') as HTMLInputElement;

    expect(meta?.textContent).toBe('invalid');

    setValue(input, '12');
    await flushPromises();
    expect(meta?.textContent).toBe('valid');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');
  });

  test('dirty flag is false after reset', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.dirty ? 'dirty' : 'clean' }}</span>
      <button @click="resetField()">Reset</button>
    `,
    });

    const input = document.querySelector('input') as HTMLInputElement;
    const meta = document.querySelector('#meta');

    await flushPromises();
    expect(meta?.textContent).toBe('clean');

    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('dirty');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('clean');
  });

  test('dirty flag is false after reset with a new value', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.dirty ? 'dirty' : 'clean' }}</span>
      <button @click="resetField({ value: '12' })">Reset</button>
    `,
    });

    const input = document.querySelector('input') as HTMLInputElement;
    const meta = document.querySelector('#meta');

    await flushPromises();
    expect(meta?.textContent).toBe('clean');

    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('dirty');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('clean');
  });
});
