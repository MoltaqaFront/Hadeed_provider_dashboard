import Vue from "vue";

// Start::Forms Inputs
import BaseInput from "@/components/formInputs/BaseInput.vue";
import BaseSelectInput from "@/components/formInputs/BaseSelectInput.vue";
import BasePickerInput from "@/components/formInputs/BasePickerInput.vue";
import BaseSwitchInput from "@/components/formInputs/BaseSwitchInput.vue";
import BaseRateInput from "@/components/formInputs/BaseRateInput.vue";
import BaseImageUploadInput from "@/components/formInputs/BaseImageUploadInput.vue";
import BaseNamePreviewFileUploadInput from "@/components/formInputs/BaseNamePreviewFileUploadInput.vue";
import BaseTextEditor from "@/components/formInputs/BaseTextEditor.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
// End::Forms Inputs

Vue.component("base-input", BaseInput);
Vue.component("base-select-input", BaseSelectInput);
Vue.component("base-picker-input", BasePickerInput);
Vue.component("base-switch-input", BaseSwitchInput);
Vue.component("base-image-upload-input", BaseImageUploadInput);
Vue.component("base-rate-input", BaseRateInput);
Vue.component(
  "base-name-preview-file-upload-input",
  BaseNamePreviewFileUploadInput
);
Vue.component("base-text-editor", BaseTextEditor);
Vue.component("base-button", BaseButton);
