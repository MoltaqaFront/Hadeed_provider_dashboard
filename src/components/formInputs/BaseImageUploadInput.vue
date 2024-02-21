<template>
  <div class="my-5" :class="col ? `col-lg-${col}` : ''">
    <div class="single_image_input_wrapper">
      <span class="input_placeholder" v-if="placeholder">
        {{ placeholder }}
        <span class="text-danger" v-if="required"> * </span>
      </span>
      <div class="wrapper">
        <label :for="identifier"></label>
        <img
          :class="(preSelectedImage || image.file) ? 'image_uploaded' : 'image_placeholder'"
          :src="preSelectedImage ? preSelectedImage : image.path"
          alt="Image To Upload"
          width="100"
          height="100"
        />
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          class="form-control"
          :id="identifier"
          @change="selectImageToUpload"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import predictFileType from "@/utils/predictFileType.js";

export default {
  name: "BaseImageUploadInput",

  emits: ["selectImage"],

  props: {
    // ====== Start:: General Inputs Props ====== //
    col: {
      required: false,
      type: String,
    },
    identifier: {
      required: true,
      type: String,
    },
    preSelectedImage: {
      required: false,
      type: String,
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
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    // ====== End:: General Inputs Props ====== //
  },

  data() {
    return {
      image: {
        path: require("@/assets/media/images/upload_image.svg"),
        file: null,
      },
    };
  },

  methods: {
    // Start:: Select Image
    selectImageToUpload(e) {
      if (predictFileType(e.target.files[0].name) !== "image_file") {
        this.$message.error(this.$t("VALIDATION.selectedFileMustBeImage"));
        return;
      } else {
        this.image.path = URL.createObjectURL(e.target.files[0]);
        this.image.file = e.target.files[0];
        this.$emit("selectImage", {
          identifier: this.identifier,
          ...this.image,
        });
        // console.log("SELECTED =>", this.image);
      }
    },
    // End:: Select Image
  },
};
</script>
