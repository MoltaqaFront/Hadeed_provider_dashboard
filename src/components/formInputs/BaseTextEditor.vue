<template>
  <div class="my-5" :class="col ? `col-lg-${col}` : ''">
    <div class="input_wrapper top_label text_editor">
      <label class="form-label">
        {{ placeholder }}
        <span class="text-danger" v-if="required">*</span>
      </label>
      <vue-editor 
        :editorToolbar="customToolbar"
        @input="updateValue($event)" 
        :value="value"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseTextEditor",

  inheritAttrs: false,

  emits: ["fireClick"],

  props: {
    // ====== Start:: General Inputs Props ====== //
    col: {
      required: false,
      type: String,
    },
    value: {
      required: true,
    },
    placeholder: {
      required: false,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    // ====== End:: General Inputs Props ====== //

    // ====== Start:: Textarea Input Props ====== //
    rows: {
      required: false,
      type: String,
      default: "4",
    },
    // ====== End:: Textarea Input Props ====== //
  },

  data() {
    return {
      customToolbar: [
        [{header: []}],
        ["bold", "italic", "underline", "strike"],
        ["align", {align: "center"}, {align: "right"}, {align: "justify"}],
        ["blockquote", "code-block"],
        [{list:"ordered"}, {list: "bullet"}, {list: "check"}],
        [{indent:"-1"}, {indent: "+1"}],
        [{color: []}, {background: []},],
        ["image", "link"],
        ["clean"],
      ]
    };
  },


  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },
  },
};
</script>
