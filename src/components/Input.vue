<template>
  <div
    :class="{
      error: error,
    }"
    @mousedown.stop
  >
    <imask-input
      class="u-full-width"
      v-bind="mask"
      :value="inputValue"
      :placeholder="placeholder"
      unmask="typed"
      :type="inputType"
      @accept="onAccept"
    />
  </div>
</template>

<script>
import ImaskInput from "../common/imask-input";

export default {
  name: "Input",
  components: {
    "imask-input": ImaskInput,
  },
  props: {
    inputType: {
      type: String,
      default: "text",
    },
    error: {
      type: Boolean,
      default: false,
    },
    inputValue: {
      type: [String, Number],
      default: "",
    },
    fieldName: {
      type: [String, Array],
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    mask: {
      type: Object,
      default: () => ({
        mask: /^.*$/,
        nullOnEmpty: true,
      }),
    },
  },
  methods: {
    onAccept(value) {
      this.$emit("input");
      this.$emit("update", {
        newValue: value,
        fieldName: this.fieldName,
      });
    },
  },
};
</script>
