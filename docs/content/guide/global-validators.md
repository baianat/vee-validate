---
title: Global Validators
description: Defining global rules to be used throughout your web app
order: 5
next: guide/i18n
---

# Global Validators

Sometimes you are building an application that is form-heavy and needs to validate forms frequently, like an admin dashboard or a form-based application. importing validation rules every time you need them can be quite tedious.

VeeValidate allows you to define validation rules globally on the app-level which in turn can allow you to express your rules in a minimal syntax that is inspired by the [Laravel framework's validation syntax](https://laravel.com/docs/validation).

## Defining Global Validators

You can define a global validator using the `defineRule` function exported by vee-validate:

```js
import { defineRule } from 'vee-validate';
```

The `defineRule` function accepts a rule name that acts as an identifier for that validation rule, the second argument is the validator function that will verify the field value. Here is an example of a simple `required` and an `email` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('required', value => {
  if (!value || !value.length) {
    return 'This field is required';
  }

  return true;
});

defineRule('email', value => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }

  // Check if email
  if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(value)) {
    return 'This field must be a valid email';
  }

  return true;
});
```

The validator function is a simple function that receives the current field value as the first argument, and it should return:

- `true` if the validation passed
- `string` if the validation failed and there is an error message to display
- `false` if validation fails, in that case, vee-validate will try to generate an error message using `config.defaultMessage`
- `Promise` if you have an asynchronous rule, the promise must either resolve to `string` or `true`

<doc-tip title="Rules Placement">

You should make the `defineRule` calls in your application entry-point file to make sure your forms have access to them, otherwise, you may risk a form not being able to use some global rules because they weren't defined then. Here are some common entry points:

- In vue-cli applications that would be the `src/main.js` file
- In a Nuxt application, you need to create a `plugins/vee-validate.js` file and register it in `nuxt.config.js`

</doc-tip>

### Using Global Validators

Now that you've defined your validators, for example, the `email` and `required` rules. You can pass them directly to `<Field />` component's `rules` prop like this:

```vue
<Field name="name" rules="required" />

<Field name="email" rules="required|email" />
```

Notice that to define multiple rules you have to place a `|` (pipe) character between your rules as a separator.

## Configuring Global Validators

Sometimes your rules require more information to work properly, for example, if we want to define a `minLength` rule it won't be very useful to hard code the character limit, instead, it should receive it per field.

VeeValidate passes rules arguments or (configuration) as the second argument to the validator function which is often an array containing the arguments in the same order they were passed in. Here is an example defining a `minLength` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('minLength', (value, [limit]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }

  if (value.length < limit) {
    return `This field must be at least ${limit} characters`;
  }

  return true;
});
```

And then you can use it on the `Field` component like this:

```vue
<Field name="password" type="password" rules="required|min:8" />
```

Note that to pass arguments to rules, you need to place a colon `:` character to signify the beginning of rules. You can pass multiple arguments as a comma-separated list. Here is an example for a `minMax` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('minLength', (value, [min, max]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }
  const numericValue = Number(value);
  if (numericValue < min) {
    return `This field must be greater than ${min}`;
  }

  if (numericValue > max) {
    return `This field must be less than ${max}`;
  }

  return true;
});
```

Then you can use it like this:

```vue
<Field name="longitude" type="number" rules="required|minMax:-180,180" />
```

## Schema Validation

The [Form-level validation](/guide/components/validation#form-level-validation) feature isn't limited to `yup` validators, you can define your global validators and define them in the same way as the previous examples in the `Form` component `validation-schema` prop.

Here is an example that uses all the rules we've defined prior in this page in a form validation schema:

```vue
<template>
  <Form @submit="submit" :validation-schema="schema" v-slot="{ errors }">
    <Field name="email" />
    <span>{{ errors.email }}</span>

    <Field name="password" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
  },
  data() {
    const schema = {
      email: 'required|email',
      password: 'required|min:8',
    };

    return {
      schema,
    };
  },
};
</script>
```

This makes vee-validate extremely compatible with Laravel's Request validation and potentially opens the door to make your forms completely API-driven, eliminating the maintenance burden of syncing validation rules between frontend and backend.

## Cross-Field Validation

Assuming you want to create a rule that verifies that a field matches another, like a password confirmation scenario. Because globally defined rules do not have scope access to other values you may have in the component, vee-validate sends a third argument to your global validators which is a `ValidationContext` that carries useful information about the form and field being validated.

So assuming you want to build a `confirmed` rule, you would make it configurable by accepting the `target` field name and you can use the `ValidationContext.form` object to access its value:

```js
import { defineRule } from 'vee-validate';

defineRule('confirmed', (value, [target], ctx) => {
  if (value === ctx.form[target]) {
    return true;
  }

  return 'Passwords must match';
});
```

Here is an example of the two fields using that rule:

```vue
<Field name="password" rules="required" />

<Field name="confirmation" rules="required|confirmed:password" />
```

There is a shorthand for this using `@` prefix before specifying arguments, this tells vee-validate to automatically swap the specified field value in the arguments array:

```js
import { defineRule } from 'vee-validate';

defineRule('confirmed', (value, [target]) => {
  if (value === target) {
    return true;
  }

  return 'Passwords must match';
});
```

```vue
<Form>
  <Field name="password" type="password" />

  <Field name="confirmation" type="password" rules="confirmed:@password" />
</Form>
```

This allows you to create more concise rules, you can reference any number of fields using this way.

## Object Expressions

There is another way to use global validators which is more expressive by using JavaScript objects to describe the validation for your fields. For example this:

```
required|between:0,10
```

Could be rewritten as an object like this

```js
{ required: true, between: [0, 10] }
```

This makes defining rules more expressive and less limited by the string format.

For dynamic expressions, you can use computed properties in the same way to define dynamic validation rules.

</doc-tip>

## @vee-validate/rules

VeeValidate offers a wide range of common validators that you can use as global validators, they are packed in a separate package under the `@vee-validate/rules` namespace

```sh
yarn add @vee-validate/rules

# or with npm
npm install @vee-validate/rules
```

You can then start importing and defining rules globally:

```js
import { defineRule } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
```

Or you can globally define all the available rules in the `@vee-validate/rules` package:

```js
import { defineRule } from 'vee-validate';
import AllRules from '@vee-validate/rules';

Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule]);
});
```

## Caveats

- Be careful of having too many global rules as this can slow down your initial website load time due to the large initial bundle size
- It is recommended to treat your validation rules as pure functions, meaning they only operate with the information given to them
- Having small, pure global validations is preferable to allow reusing them across the app
- You could possibly trigger an infinite render-loop when using the [object expressions](/guide/global-validators#object-expressions) to define your validations for a field, read the [linked section](/guide/global-validators#object-expressions) for a workaround

## Available Rules

<ul class="grid grid-cols-2 col-gap-4 lg:grid-cols-3 lg:col-gap-8 text-accent-800">
  <li><a href="/guide/global-validators#alpha">alpha</a></li>
  <li><a href="/guide/global-validators#alpha-dash">alpha_dash</a></li>
  <li><a href="/guide/global-validators#alpha-num">alpha_num</a></li>
  <li><a href="/guide/global-validators#alpha-spaces">alpha_spaces</a></li>
  <li><a href="/guide/global-validators#between">between</a></li>
  <li><a href="/guide/global-validators#checked">checked</a></li>
  <li><a href="/guide/global-validators#confirmed">confirmed</a></li>
  <li><a href="/guide/global-validators#digits">digits</a></li>
  <li><a href="/guide/global-validators#dimensions">dimensions</a></li>
  <li><a href="/guide/global-validators#email">email</a></li>
  <li><a href="/guide/global-validators#excluded">excluded</a></li>
  <li><a href="/guide/global-validators#ext">ext</a></li>
  <li><a href="/guide/global-validators#image">image</a></li>
  <li><a href="/guide/global-validators#one_of">one_of</a></li>
  <li><a href="/guide/global-validators#integer">integer</a></li>
  <li><a href="/guide/global-validators#is">is</a></li>
  <li><a href="/guide/global-validators#is-not">is_not</a></li>
  <li><a href="/guide/global-validators#length">length</a></li>
  <li><a href="/guide/global-validators#max">max</a></li>
  <li><a href="/guide/global-validators#max-value">max_value</a></li>
  <li><a href="/guide/global-validators#mimes">mimes</a></li>
  <li><a href="/guide/global-validators#min">min</a></li>
  <li><a href="/guide/global-validators#min-value">min_value</a></li>
  <li><a href="/guide/global-validators#numeric">numeric</a></li>
  <li><a href="/guide/global-validators#regex">regex</a></li>
  <li><a href="/guide/global-validators#required">required</a></li>
  <li><a href="/guide/global-validators#size">size</a></li>
  <li><a href="/guide/global-validators#url">url</a></li>
</ul>

### Playground

Here is a live demo where you can view and test all the global validators live

<code-sandbox id="global-rules-playground-hd5r8" title="Global Rules Playground" view="preview"></code-sandbox>

#### alpha

The field under validation may only contain alphabetic characters.

```vue
<!-- string format -->
<Field name="field" rules="alpha" />

<!-- object format -->
<Field name="field" :rules="{ alpha: true }" />
```

#### alpha_dash

The field under validation may contain alphabetic characters, numbers, dashes, or underscores.

```vue
<!-- string format -->
<Field name="field" rules="alpha_dash" />

<!-- object format -->
<Field name="field" :rules="{ alpha_dash: true }" />
```

#### alpha_num

The field under validation may contain alphabetic characters or numbers.

```vue
<!-- string format -->
<Field name="field" rules="alpha_num" />

<!-- object format -->
<Field name="field" :rules="{ alpha_num: true }" />
```

#### alpha_spaces

The field under validation may contain alphabetic characters or spaces.

```vue
<!-- string format -->
<Field name="field" rules="alpha_spaces" />

<!-- object format -->
<Field name="field" :rules="{ alpha_spaces: true }" />
```

#### between

The field under validation must have a numeric value bounded by a minimum value and a maximum value.

```vue
<!-- string format -->
<Field name="field" rules="between:1,10" />

<!-- object format with shorthand array -->
<Field name="field" :rules="{ between: [1, 10] }" />

<!-- object format with named arguments -->
<Field name="field" :rules="{ between: { min: 1, max: 10 } }" />
```

| Param Name | Required? | Default | Description        |
| ---------- | --------- | ------- | ------------------ |
| `min`      | **yes**   |         | The minimum value. |
| `max`      | **yes**   |         | The maximum value. |

#### checked

The field under validation must be valid.

```vue
<!-- string format -->
<Field name="field" rules="checked" />

<!-- object format -->
<Field name="field" :rules="{ checked: true }" />
```

#### confirmed

The field under validation must have the same value as the confirmation field.

```vue
<Form>
  <Field name="password" type="password" />

  <Field name="confirmation" type="password" rules="confirmed:@password" />
</Form>
```

| Param Name | Required? | Default | Description                                                                  |
| ---------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `target`   | **yes**   |         | The other field's `name` value, must use `@` to prefix the target field name |

<doc-tip type="danger">

Any fields defined to have this rule must have a `<Form />` parent in their hierarchy or `useForm()` called on their parent hierarchy.

</doc-tip>

#### digits

The field under validation must be numeric and have the specified number of digits.

```vue
<!-- string format -->
<Field name="field" rules="digits:3" />

<!-- object format -->
<Field name="field" :rules="{ digits: 3 }" />
```

| Param Name | Required? | Default | Description                   |
| ---------- | --------- | ------- | ----------------------------- |
| `length`   | **yes**   |         | The number of digits allowed. |

#### dimensions

The file added to the field under validation must be an image (jpg,svg,jpeg,png,bmp,gif) having the exact specified dimension.

```vue
<!-- string format -->
<Field name="field" type="file" rules="dimensions:120,120" />

<!-- object format -->
<Field name="field" :rules="{ dimensions: [120, 120] }" />

<!-- object format with named arguments -->
<Field name="field" :rules="{ dimensions: { width: 120, height: 120 } }" />
```

| Param Name | Required? | Default | Description           |
| ---------- | --------- | ------- | --------------------- |
| `width`    | **yes**   |         | The width in pixels.  |
| `height`   | **yes**   |         | The height in pixels. |

#### email

The field under validation must be a valid email.

```vue
<!-- string format -->
<Field name="field" rules="email" />

<!-- object format -->
<Field name="field" :rules="{ email: true }" />
```

#### excluded

The field under validation must have a value that is not in the specified list. **Uses double equals** for checks.

```vue
<!-- string format -->
<Field name="field" rules="excluded:1,3" />

<!-- object format -->
<Field name="field" :rules="{ excluded: [1, 3] }" />
```

`excluded` accepts an infinite number of params, each is a value that is disallowed.

#### ext

The file added to the field under validation must have one of the extensions specified.

```vue
<!-- string format -->
<Field name="field" rules="ext:jpg,png" />

<!-- object format -->
<Field name="field" :rules="{ ext: ['jpg', 'png'] }" />
```

`ext` accepts an infinite number of arguments representing extensions. ex: `ext:jpg,png,bmp,svg`.

#### image

The file added to the field under validation must have an image mime type (image/\*).

```vue
<!-- string format -->
<Field name="field" rules="image" />

<!-- object format -->
<Field name="field" :rules="{ image: true }" />
```

#### integer

The field under validation must be a valid integer value. Doesn't accept exponential notation.

```vue
<!-- string format -->
<Field name="field" rules="integer" />

<!-- object format -->
<Field name="field" :rules="{ integer: true }" />
```

#### is

The field under validation must match the given value, uses strict equality.

```vue
<!-- string format -->
<Field name="field" rules="is:hello" />

<!-- object format -->
<Field name="field" :rules="{ is: 'hello' }" />
```

| Param Name | Required? | Default | Description                                                 |
| ---------- | --------- | ------- | ----------------------------------------------------------- |
| `value`    | **yes**   |         | A value of any type to be compared against the field value. |

#### is_not

The field under validation must not match the given value, uses strict equality.

```vue
<!-- string format -->
<Field name="field" rules="is_not:world" />

<!-- object format -->
<Field name="field" :rules="{ is_not: 'world' }" />
```

| Param Name | Required? | Default | Description                                                 |
| ---------- | --------- | ------- | ----------------------------------------------------------- |
| `value`    | **yes**   |         | A value of any type to be compared against the field value. |

#### length

The field under validation must exactly have the specified number of items, only works for iterables.

Allowed Iterable values are `string`, `array`, and any object that can be used with `Array.from`.

```vue
<!-- string format -->
<Field name="field" rules="length:5" />

<!-- object format -->
<Field name="field" :rules="{ length: 5 }" />
```

| Param Name | Required? | Default | Description                                                                   |
| ---------- | --------- | ------- | ----------------------------------------------------------------------------- |
| `length`   | **yes**   |         | A numeric value representing the exact number of items the value can contain. |

#### max

The field under validation length may not exceed the specified length.

```vue
<!-- string format -->
<Field name="field" rules="max:10" />

<!-- object format -->
<Field name="field" :rules="{ max: 10 }" />
```

| Param Name | Required? | Default | Description                                                    |
| ---------- | --------- | ------- | -------------------------------------------------------------- |
| `length`   | **yes**   |         | A numeric value representing the maximum number of characters. |

#### max_value

The field under validation must be a numeric value and must not be greater than the specified value.

```vue
<!-- string format -->
<Field name="field" rules="max_value:10" />

<!-- object format -->
<Field name="field" :rules="{ max_value: 10 }" />
```

| Param Name | Required? | Default | Description                                              |
| ---------- | --------- | ------- | -------------------------------------------------------- |
| `max`      | **yes**   |         | A numeric value representing the greatest value allowed. |

#### mimes

The file type added to the field under validation should have one of the specified mime types.

```vue
<!-- string format -->
<Field name="field" rules="mimes:image/jpeg" />

<!-- object format -->
<Field name="field" :rules="{ mimes: ['image/jpeg'] }" />
```

`mimes` accepts an infinite number of arguments that are formatted as file types. EG: `mimes:image/jpeg,image/png`.

<doc-tip>

You can use '\*' to specify a wild card, something like `mimes:image/*` will accept all image types.

</doc-tip>

#### min

The field under validation length should not be less than the specified length.

```vue
<!-- string format -->
<Field name="field" rules="min:3" />

<!-- object format -->
<Field name="field" :rules="{ min: 3 }" />
```

| Param Name | Required? | Default | Description                                                    |
| ---------- | --------- | ------- | -------------------------------------------------------------- |
| `length`   | **yes**   |         | A numeric value representing the minimum number of characters. |

#### min_value

```vue
<!-- string format -->
<Field name="field" rules="min_value:5" />

<!-- object format -->
<Field name="field" :rules="{ min_value: 5 }" />
```

The field under validation must be a numeric value and must not be less than the specified value.

| Param Name | Required? | Default | Description                                              |
| ---------- | --------- | ------- | -------------------------------------------------------- |
| `min`      | **yes**   |         | A numeric value representing the smallest value allowed. |

#### numeric

The field under validation must only consist of numbers.

```vue
<!-- string format -->
<Field name="field" rules="numeric" />

<!-- object format -->
<Field name="field" :rules="{ numeric: true }" />
```

#### one_of

The field under validation must have a value that is in the specified list. **Uses double equals** for checks.

```vue
<!-- string format -->
<Field name="field" rules="one_of:1,2,3" />

<!-- object format -->
<Field name="field" :rules="{ one_of: [1, 2, 3] }" />
```

`one_of` takes an infinite number of params, each is a value that is allowed.

#### regex

The field under validation must match the specified regular expression.

```vue
<!-- string format: NOT RECOMMENDED -->

<!-- object format -->
<Field name="field" :rules="{ regex: /^[0-9]+$/ }" />
```

| Param Name | Required? | Default | Description                                               |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `pattern`  | **yes**   |         | A regular expression instance or string representing one. |

<doc-tip type="warn">

You should not use the pipe '|' or commas ',' within your regular expression when using the string rules format as it will cause a conflict with how validators parsing works. You should use the object format of the rules instead as shown in the last snippet

</doc-tip>

<doc-tip type="warn" title="The g flag">

When using the `regex` rule, using the `g` flag may result in unexpected falsy validations. This is because vee-validate uses the same instance across validation attempts.

</doc-tip>

#### required

The field under validation must have a non-empty value. By default, all validators pass the validation if they have "empty values" unless they are required. Those empty values are empty strings, `undefined`, `null`, `false`, and empty arrays.

```vue
<!-- string format -->
<Field name="field" rules="required" />

<!-- object format -->
<Field name="field" :rules="{ required: true }" />
```

#### size

The file size added to the field under validation must not exceed the specified size in kilobytes.

```vue
<!-- string format -->
<Field name="field" type="file" rules="size:250" />

<!-- object format -->
<Field name="field" :rules="{ size: 250 }" />
```

| Param Name | Required? | Default | Description                         |
| ---------- | --------- | ------- | ----------------------------------- |
| `size`     | **yes**   |         | The maximum file size in kilobytes. |

#### url

The field under validation must be a valid url. You can pass a `pattern` if you need the url to be more restricted.

```vue
<!-- string format -->
<Field name="field" type="url" rules="url" />

<!-- object format -->
<Field name="field" type="text" :rules="{ url: 'https://.*' }" />
```

| Param Name | Required? | Default | Description                                               |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `pattern`  | **no**    |         | A regular expression instance or string representing one. |
