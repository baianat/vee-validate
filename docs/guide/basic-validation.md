# Validation

Previously vee-validate shipped with many validation rules. Starting with `v3` it will ship the rules in a separate bundle. So you import only what you need. Mostly you won't use all the rules in every single form in your app so by default we wanted apps that use vee-validate to be nimble and fast as possible.

## Adding validation rules

You can add validation rules by using the `extend` function, in its simplest form the validation rule can be a function:

```js
import { extend } from 'vee-validate';

extend('required', value => !!value);
```

or an object with a `validate` function:

```js
import { extend } from 'vee-validate';

extend('required', {
  validate: value => !!value
});
```

:::danger Nuxt.js
Depending on your Nuxt config, You might get this error "Unexpected token **export**". This is because the `node_modules` folder is excluded from transpilation.

We will need to [add an exception](https://nuxtjs.org/api/configuration-build/#transpile) for the `vee-validate/dist/rules.js` file inside the `build` block in the `nuxt.config.js`:

```js
  build: {
    // Add exception
    transpile: [
      "vee-validate/dist/rules"
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
```

:::

## Rules Parameters

Rule functions can also accept params to configure their behavior.

```js
import { extend } from 'vee-validate';

extend('maxVal', {
  params: ['max'], // list of parameter names
  validate(value, { max }) {
    return Number(value) <= max;
  }
});
```

declared parameters will be passed in an object in the second parameter to the `validate` function.

## Error messages

### Returning messages directly <Badge text="3.0.6+" type="tip"/>

You can return a string in your `validate` function and it will be used as the error message.

```js
import { extend } from 'vee-validate';

extend('required', value => {
  if (!!value) {
    return true;
  }

  return 'This field is required';
});
```

This is very handy for complex rules that may have multiple reasons to fail validation, it is also very concise and allows you to dynamically return messages as needed. [Check this advanced example](./advanced-validation.md#dynamic-messages) that takes advantage of this.

### via extend Options

Alternatively, you can provide a custom error message for that rule, we will pass an object instead of a function. This object will contain a `validate` method, as well as a `message` prop.

```js
import { extend } from 'vee-validate';

extend('required', {
  validate: value => !!value, // the validation function
  message: 'This field is required' // the error message
});
```

The `message` prop can also be a function that returns a `string` which is useful if your messages are more complex.

```js
import { extend } from 'vee-validate';

extend('required', {
  validate: value => !!value,
  message() {
    // You might want to generate a more complex message with this function.
    return 'This field is required';
  }
});
```

## Importing validation rules

Implementing rules can be annoying, VeeValidate offers the most common validation rules. which you can import to your project.

### ES6

In ES6 if you are using a bundler you can `import` rules individually, you also get tree-shaking so you don't include all the rules in your output bundle.

```js
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Add the required rule
extend('required', required);

// Add the email rule
extend('email', email);
```

### Script Tag

As of `v3.0.5` there is a `rules.umd` bundle that can be used via `script` tags for convenience. All rules will be available in the `VeeValidateRules` on the global object.

```html
<script src="https://unpkg.com/browse/vee-validate@3.x/dist/rules.umd.min.js"></script>
<script src="https://unpkg.com/vee-validate@3.x/dist/vee-validate.min.js"></script>

<script>
  VeeValidate.extend('required', VeeValidateRules.required);

  VeeValidate.extend('email', VeeValidateRules.email);
</script>
```

### Importing all rules

You can import all rules with ES6 like this:

```js
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

// loop over all rules
for (let rule in rules) {
  // add the rule
  extend(rule, rules[rule]);
}
```

### Importing messages

VeeValidate also has default messages for those rules, which you can import and use:

```js
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import en from 'vee-validate/dist/locale/en';

// loop over all rules
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: en.messages[rule] // add its message
  });
}
```

### Using the **full** bundle

If you find yourself requiring most of the rules you can use a special bundle that has everything pre-configured for you. The **full** bundle includes all validation rules provided by vee-validate and their English messages.

```js
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full';

// No 'extend' is needed

// Use the provider immediately
Vue.component('ValidationProvider', ValidationProvider);
```

:::tip
Keep in mind when using the **full bundle** you need to keep all your imports pointing to that bundle, meaning you should always use `vee-validate/dist/vee-validate.full` as your import so you don't end up with two different `vee-validate` installations in your app. You can make this easier by using an alias if you are using `webpack` or `vue-cli`.
:::

This bundle comes with extra size because all rules are imported for you.

### Async Rules

Rules can also be an asynchronous function, in fact vee-validate treats all rules as asynchronous. You can return a promise in your rules `validate` function.

```js
import { extend } from 'vee-validate';

extend('asyncRule', {
  validate(value) {
    return new Promise(resolve => {
      // simulate a network request.
      setTimeout(() => {
        resolve(!!value);
      }, 300);
    });
  },
  message: 'This field is required' // the error message
});
```

Or if you are an `async/await` fan:

```js
import { extend } from 'vee-validate';

extend('asyncRule', {
  async validate(value) {
    // some heavy work/network request.

    return !!value;
  },
  message: 'This field is required' // the error message
});
```

---

:::tip Heads up!

There are more to rules, but for now you know how to use most common cases in your app. The other cases that were not covered here are:

- Cross-Field validation (confirm password).
- Required State Rules.
- Backend messages.
- Dynamic Error Messages.

You can refer to the [Advanced Validation](./advanced-validation.md) guide for these cases.

:::

---

Now that you know how to add rules to `vee-validate` it's time you know how to use them.
