# Advanced Validation

Previously you learned how to add validation rules to vee-validate, in this guide you will learn how to use the full API to create more powerful and complex rules.

## Dynamic Messages

Some rules can be really complicated, and as such you need to provide suitable feedback for your users. While you cannot provide multiple messages for your rules, you can leverage the fact that messages can be functions. Meaning you could create a dynamic message for your rules, allowing you to be more flexible.

```js{4}
import { extend } from 'vee-validate';

extend('someRule', {
  message: (field, values) => `The current timestamp is ${Date.now()}`
});
```

The previous example isn't very useful, but it showcases how dynamic the messages can be. Earlier you learned that the `values` object [contains some useful information](./displaying-errors.md#message-function) about the field and the rule. It can also contain arbitrary data that you can return from your rule's `validate` function.

Consider this dummy `profanity` rule where we have 2 states for the error message:

```js
import { extend } from 'vee-validate';

extend('profanity', value => {
  if (value === 'heck') {
    return 'You cannot say any of the H words.';
  }

  if (value === 'frick') {
    return 'You cannot say any of the F words.';
  }

  return true;
});
```

Here we take advantage of being able to return messages directly in our `validate` function, with this we are able to return multiple messages or **reasons** for failing a rule. You can find this example [live right here](https://codesandbox.io/embed/veevalidate-30-dynamic-messages-3k649).

## Cross-Field validation

Some rules validity are dependent on other fields values, a rule like `confirmed` will need access to another field's value and compare it with the current one to be able to determine validity.

Rules parameters can be marked as a **field target** by specifying a `isTarget` for that parameters. For example, this is how a basic password confirmation rule would look like:

```js{6}
import { extend } from 'vee-validate';

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'The password confirmation does not match.',
  params: [{ name: 'other', isTarget: true }]
});
```

```vue{3,11}
<ValidationObserver>
  <ValidationProvider
    rules="required|password:confirmation"
    v-slot="{ errors }"
  >
    <input v-model="password" type="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>

  <ValidationProvider
    name="confirmation"
    rules="required"
    v-slot="{ errors }"
  >
    <input v-model="confirm" type="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</ValidationObserver>
```

You will notice in your validation function that the `other` parameter is not `'confirmation'` string, but rather the confirmation field value. When a parameter is marked as `isTarget`, vee-validate replaces the parameter value with the target field value.

To make sure the providers can locate each other, they need to be wrapped by the same `ValidationObserver` component and the target field needs to have the specified target name as its `name` or `vid` prop.

Here is a working snippet of the last example:

<ValidationObserver>
  <StyledProvider
    name="password"
    :rules="{required:true, password: { confirm }}"
    v-slot="{ errors }"
  >
   <input v-model="pass" type="password">
   <span>{{ errors[0] }}</span>
  </StyledProvider>
  <StyledProvider
    name="confirmation"
    rules="required"
    v-slot="{ errors }"
  >
    <input v-model="confirm" type="password">
    <span>{{ errors[0] }}</span>
  </StyledProvider>
</ValidationObserver>

:::tip
There are some cases where you want to use a simple target name for your fields but display a user-friendly name for your user, here you would need to specify `vid` and target your fields using that instead of `name` prop.

```vue{3,11}
<ValidationObserver>
  <ValidationProvider
    rules="required|password:pConf"
    v-slot="{ errors }"
  >
    <input v-model="password" type="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>

  <ValidationProvider
    vid="pConf"
    name="Password Confirmation"
    rules="required"
    v-slot="{ errors }"
  >
    <input v-model="confirm" type="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</ValidationObserver>
```

This will display **"Password Confirmation"** in error messages, but note that you used `pConf` to target the other field because it is specified as its `vid` prop.
:::

## Required Rules

You will notice that the `required` rule is special. The default behavior in vee-validate is that when a field is **not required** and has an empty value it skips validation for that field.

### Empty values

values that are considered **empty** are:

- Empty Strings.
- `null` or `undefined`.
- Empty arrays.

:::warning
Notice that `false` is missing from this list, as it is considered a valid non-empty value. For example radio button with a Yes/No choices is considered valid when user selects either of those options.
:::

### Creating required-like rules

When calling `extend` you need to set the `computesRequired` option on the extension options and the `validate` function should return an object with both `valid` and `required` booleans present.

Consider this rule, the input will be required if the `test` param is equal to `'yes'`.

```js{2,6}
extend('requiredIf', {
  computesRequired: true,
  message: 'This field is required.',
  params: ['test'],
  validate: (value, { test }) => {
    const isEmpty = !!(!value || value.length === 0);
    const isRequired = test === 'yes';

    return {
      valid: !isRequired ? true : !isEmpty,
      required: isRequired
    };
  }
});
```

```vue
<template>
  <div>
    <span>Test Value: {{ test }}</span>
    <button @click="toggle">Toggle</button>
    <ValidationProvider rules="requiredIf" v-slot="{ errors }">
      <input v-model="value" type="text" />
      <span id="error">{{ errors[0] }}</span>
    </ValidationProvider>
  </div>
</template>

<script>
export default {
  data: () => ({
    values: {},
    test: 'yes'
  }),
  methods: {
    toggle() {
      this.test = this.test === 'yes' ? 'no' : 'yes';
    }
  }
};
</script>
```

<div>
  <span>Test Value: {{ test }}</span>
  <button @click="toggle">Toggle</button>
  <StyledProvider :rules="{ requiredIf: { test } }" v-slot="{ errors }">
    <input v-model="values.require" type="text">
    <span id="error">{{ errors[0] }}</span>
  </StyledProvider>
</div>

:::tip
You can combine this with `isTarget` to create rules coupled with with cross-field validation. Check the `required_if` rule implementation.
:::

## Lazy Rules

By default vee-validate sneaks a validation run initially to be able to set the `valid` and `invalid` flags. That very first validation run is invisible and does not generate any errors nor modify any flags but it might be unexpected in some cases.

Assuming you have a rule that sends a request to an endpoint, you might want to prevent the initial validation from executing the rule. This can be done by setting `lazy` boolean to `false` when extending the rule.

```js{2}
extend('lazyRule', {
  lazy: true,
  validate: value => {
    // Some stuff.
  }
});
```

This rule will only be executed when the input is interacted with by the user or when the provide/observer `validate` methods are triggered explicitly.

## Params Types

Because vee-validate allows both a `string` or an `object` expressions to define rules, your params won't have a consistent type which may cause a problem. Consider this example where we want to define an `isAfter` rule to compare two dates:

```js
extend('isAfter', {
  validate: function isAfter(value, { compare }) {
    return value.getTime() > compare.getTime();
  },
  params: ['compare'],
  message: 'The provided date must be after {compare}'
});
```

Except in runtime you probably won't get actual `Date` instances unless you use a custom component that emits a `Date` value. Otherwise you will either get a `number` or a `string` depending on the input implementation.

A quick fix would look like this:

```js{3,4}
extend('isAfter', {
  validate: function isAfter(value, { compare }) {
    let rhs = new Date(value);
    let lhs = new Date(compare);

    return rhs.getTime() > lhs.getTime();
  },
  params: ['compare'],
  message: 'The provided date must be after {compare}'
});
```

This would work fine for most cases but in complex rules, this starts to break down really fast as you must keep casting the param types before using them, and that example would work if the inputs values are timestamps, we didn't handle strings.

Params can have a slightly richer schema to allow you to convert types before passing them to your `validate` function, instead of defining an array of param names, we define an array of objects:

```js{21,25}
function toDate(value) {
  // handle timestamps
  if (typeof value === 'number') {
    return new Date(value);
  }

  // Handle date values
  if (value instanceof Date) {
    return value;
  }

  // handle strings, use any date parsing library
  // like: dayjs, date-fns, moment
  return parse(value);
}

extend('isAfter', {
  validate: function isAfter(value, { compare }) {
    return value.getTime() > compare.getTime();
  },
  castValue: toDate, // casts the value
  params: [
    {
      name: 'compare', // don't forget to provide a name
      cast: toDate // casts the param value
    }
  ],
  message: 'The provided date must be after {compare}'
});
```

Notice the usage of `castValue` and `cast` properties that allows your `validate` function to always get the correct types before validating them.

<script>
export default {
  data: () => ({
    values: {},
    confirm: '',
    pass: '',
    test: 'yes'
  }),
  methods: {
    toggle () {
      this.test = this.test === 'yes' ? 'no' : 'yes';
    }
  },
  mounted () {
    this.extendRule('password', {
      validate: (value,  {confirm}) => value === confirm,
      params: ['confirm'],
      message: 'The password confirmation does not match.',
    });

    this.extendRule('requiredIf', {
      computesRequired: true,
      message: 'This field is required.',
      params: ['test'],
      validate: (value, { test }) => {
        const isEmpty = !!(!value || value.length === 0);
        const isRequired = test === 'yes';

        return {
          valid: !isRequired ? true : !isEmpty,
          required: isRequired
        };
      }
    });
  }
};
</script>
