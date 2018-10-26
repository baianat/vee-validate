# Validation Components

::: tip
 This feature is available as of `v2.1.0`.
:::

VeeValidate ships with components for more advanced use cases. The `ValidationProvider` component is a regular component that wraps your inputs and provides validation using the [scoped slots feature](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to pass down validation state and results.

Using the ValidationProvider component offers isolated scope for each field validation state, and does not inject/mutate anything in your template or the Vue instance. And you can import it and use whenever you need it. Using the validation context will allow you to apply classes, flags and pass state to your template.

Here is a quick example:

```vue
<template>
  <div>
    <ValidationProvider rules="required">
      <template slot-scope="{ errors }">
        <input v-model="value" type="text">
        <span id="error">{{ errors[0] }}</span>
      </template>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  }
};
</script>
```

It also works for custom components and solves the issue of authoring __self validated__ components which are hard to achieve normally because of the directive limitations.

::: tip
The fields being validated __must have__ a `v-model` so the component can correctly identify the element/component being validated.
:::

## Validation Context

The object passed down to the slot scope is called the __validation context__ it has the following properties:

| Name    | Type                       |  Description |
|:--------|:--------------------------:|:--------------------------------------------------------------------|
| errors  | `string[]`                 | The list of error messages.                                         |
| valid   | `boolean`                  | The current validation state.                                       |
| flags   | `{ [x: string]: boolean }` | The flags map object state.                                         |
| aria    | `{ [x: string]: string }`  | Map object of aria attributes for accessibility.                    |
| classes | `{ [x: string]: boolean }` | Map object of the classes configured based on the validation state. |

Since slot scopes can take advantage of ES6 destructing; you can opt-in for any of those properties and pass down to your slot template as you see fit. The example above only needed the `errors` array.

## Usage Examples

The previous quick sample validates simple HTML inputs, lets take this up a notch and validate popular 3rd party components like [Vuetify's TextInput](https://vuetifyjs.com/en/components/text-fields).

### Basic Example

Thise example wraps and passes error messages down to Vuetify's text field component.

```html
<ValidationProvider rules="required">
  <template slot-scope="{ errors }">
    <VTextField v-model="value" :error-messages="errors" />
  </template>
</ValidationProvider>
```

### Confirmed/Target based Validation

When using the directive, the `confirmed` rule targets the other field that has a match ref. Using the ValidationProvider is slightly diffrent as it looks for provider components that has a matching `vid` prop which can be either a number or a string.

```html
<ValidationProvider rules="required|confirmed:confirm">
  <template slot-scope="{ errors }">
    <VTextField v-model="password" type="password" :error-messages="errors" />
  </template>
</ValidationProvider>

<ValidationProvider vid="confirm" rules="required">
  <template slot-scope="{ errors }">
    <VTextField v-model="passwordConfirm" type="password" :error-messages="errors" />
  </template>
</ValidationProvider>
```

## Refactoring Validation Providers

The ValidationProvider while have its advantages, it is more verbose than using the directive, and can be very annoying when create large forms, there are a couple of ways to address this issue.

### Creating High Order Components

A common pattern in React is to use higher order components to produce new components with slightly different behavior, It is similair to creating a wrapper or a mixin for our component except it uses props/events to communicate state.

The ValidationProvider provides a `wrap` method which takes in a component and outputs another with the validation behavior enabled. Lets create a `VTextFieldWithValidation` using this method:

```js
import { ValidationProvider } from 'vee-validate';
import { VTextField } from 'vuetify/lib';

const VTextFieldWithValidation = ValidationProvider.wrap(VTextField, ({ errors }) => ({
  'error-messages': errors
}));

export default {
  components: {
    VTextFieldWithValidation
  }
};
```

::: tip
Note that the second parameter is a function that transforms the validation context to props object to be passed to the wrapped component. In this case we want to pass the `errors` array as the `error-messages` prop to the `VTextField` component.
:::

With this approach the last example becomes:

```html
<VTextFieldWithValidation rules="required|confirmed:confirm" v-model="password" />

<VTextFieldWithValidation vid="confirm" rules="required" v-model="password" />
```

::: danger
This approach has some cons, for example if the wrapped component accepts props that has the same name as the `ValidationProvider` component - while it will receive them - it may be in a different type which might cause serious issues. The problem with HOCs is that you need to be aware of the underlying component implementation which can be problematic for 3rd party components.
:::

### Wrapping Components Manually

Instead We can wrap the field component with the ValidationProvider in a new component. This is much simpler and flexible and doesn't have any of the HOC problems.

Consider this new `VTextFieldWithValidation` component.

```vue
<template>
  <ValidationProvider :rules="rules">
    <template slot-scope="{ errors }">
      <VTextField v-model="innerValue" :error-messages="errors" />
    </template>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  props: {
    rules: [String],
    value: null
  },
  components: {
    ValidationProvider
  },
  data: () => ({
    innerValue: null
  }),
  watch: {
    innerValue (val) {
      this.$emit('input', val);
    }
  }
};
</script>

```

Ideally you would pass the props you need to either `ValidationProvider` or the `VTextField` being validated, with this approach solves the verbosity problem while preserving the simple scoped slots API. It also allows you to distrubute props without the issues of having a conflict unlike HOC.

Using either approaches is up to you.

## Reference

Below is the reference of the ValidationProvider public API.

### Props

All the following props are optional.

|Prop  |Type  |Default Value  | Description  |
|---------|---------|---------|---------|
| rules   | `string`      | `undefined` | The validation rules. |
| vid     |  `string` | auto increment number | Identifier used for target based rules. |
| immediate  | `boolean` | `false` | If the field should be validated immediatly after render (initially). |
| events  | `string | string[]` | `['input']` | Events that will trigger validation. |
| name  | `string` | `undefined` | a String that will be used to replace `{field}` in error messages. |
| tag  | `string` | `span` | The default HTML tag to be used to render the root element of the component. |

### Events

The validation provider does not emit any events at this time.
