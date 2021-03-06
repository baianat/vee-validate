import { inject, h, defineComponent, computed, resolveDynamicComponent } from 'vue';
import { FormErrorsKey } from './symbols';
import { normalizeChildren } from './utils';

export const ErrorMessage = defineComponent({
  name: 'ErrorMessage',
  props: {
    as: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const errors = inject(FormErrorsKey, undefined);
    const message = computed<string | undefined>(() => {
      return errors?.value[props.name];
    });

    function slotProps() {
      return {
        message: message.value,
      };
    }

    return () => {
      // Renders nothing if there are no messages
      if (!message.value) {
        return undefined;
      }

      const tag = (props.as ? resolveDynamicComponent(props.as) : props.as) as string;
      const children = normalizeChildren(tag, ctx, slotProps);

      const attrs = {
        role: 'alert',
        ...ctx.attrs,
      };

      // If no tag was specified and there are children
      // render the slot as is without wrapping it
      if (!tag && (Array.isArray(children) || !children) && children?.length) {
        return children;
      }

      // If no children in slot
      // render whatever specified and fallback to a <span> with the message in it's contents
      if ((Array.isArray(children) || !children) && !children?.length) {
        return h(tag || 'span', attrs, message.value);
      }

      return h(tag, attrs, children);
    };
  },
});
