import validate from '../src/checked';

test('validates required', () => {
  // valid
  expect(validate('t')).toBe(true);
  expect(validate('true')).toBe(true);
  expect(validate('false')).toBe(true);
  expect(validate('f')).toBe(true);
  expect(validate('on')).toBe(true);
  expect(validate('off')).toBe(true);
  expect(validate('yes')).toBe(true);
  expect(validate('no')).toBe(true);
  expect(validate(0)).toBe(true);
  expect(validate(1)).toBe(true);
  expect(validate(true)).toBe(true);
  expect(validate(false)).toBe(true);

  // invalid
  expect(validate('')).toBe(false);
  expect(validate(' ')).toBe(false);
  expect(validate([])).toBe(false);
  expect(validate(undefined)).toBe(false);
  expect(validate(null)).toBe(false);
  expect(validate('undefined')).toBe(false);
  expect(validate('null')).toBe(false);
  expect(validate('s ')).toBe(false);
});
