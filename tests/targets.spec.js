import { validate } from '@/validate';
import { extend } from '@/extend';
import { between, confirmed } from '@/rules';

describe('target field placeholder', () => {
  extend('confirmed', {
    ...confirmed,
    message: '{_field_} must match {_target_}'
  });

  const names = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };

  test('uses target field name, if supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values,
      names
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match Foo');
  });

  test('uses target field key, if target field name not supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match foo');
  });

  test('works for multiple targets', async () => {
    extend('sum_of', {
      message: '{_field_} must be the sum of {_aTarget_} and {_bTarget_}',
      // eslint-disable-next-line prettier/prettier
      params: [
        { name: 'a', isTarget: true },
        { name: 'b', isTarget: true }
      ],
      validate: (value, { a, b }) => value === parseInt(a, 10) + parseInt(b, 10)
    });

    const values = { foo: 10, bar: 10, baz: 10 };
    const names = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };
    const rules = 'sum_of:bar,baz';
    const options = {
      name: names.foo,
      values,
      names
    };

    const result = await validate(values.foo, rules, options);
    expect(result.errors[0]).toEqual('Foo must be the sum of Bar and Baz');
  });
});

describe('cross-field syntax', () => {
  extend('between', {
    ...between,
    message: '{_field_} must be between {min} and {max}'
  });

  const values = { value: 20, maxValue: 15 };
  const names = { value: 'Value', maxValue: 'Max Value' };
  const rules = 'between:0,@maxValue';
  const options = {
    name: names.value,
    values
  };

  describe('should validate and generate the correct message', () => {
    test('without options.names', async () => {
      const result = await validate(values.value, rules, options);
      expect(result.errors[0]).toEqual('Value must be between 0 and maxValue');
    });

    test('with options.names', async () => {
      const result = await validate(values.value, rules, { ...options, names });
      expect(result.errors[0]).toEqual('Value must be between 0 and Max Value');
    });

    test('with options.customMessages string', async () => {
      const customMessages = {
        between: 'The Value field must be more than {min} but less than {max}'
      };
      const result = await validate(values.value, rules, { ...options, customMessages, names });
      expect(result.errors[0]).toEqual('The Value field must be more than 0 but less than Max Value');
    });

    test('with options.customMessages function', async () => {
      const customMessages = {
        between(field, { min, _maxValueTarget_ }) {
          return `Must be more than ${min} and less than ${_maxValueTarget_}`;
        }
      };
      const result = await validate(values.value, rules, { ...options, customMessages, names });
      expect(result.errors[0]).toEqual('Must be more than 0 and less than Max Value');
    });
  });
});
