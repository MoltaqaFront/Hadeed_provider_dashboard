<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.News_tap.add") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input 
            col="6" type="text" 
            :placeholder="$t('PLACEHOLDERS.nameAr')" 
            v-model.trim="data.name_ar" 
            @input="validateInput"
            required />
          <!-- End:: Name Input -->

          <!-- Start:: name Input -->
          <base-input col="6" 
            type="text" 
            :placeholder="$t('PLACEHOLDERS.nameEn')" 
            v-model.trim="data.name_en"
            @input="removeArabicCharacters" 
            @copy="onCopy" 
            @paste="onPaste" 
            required />
          <!-- End:: name Input -->

          <!-- Start:: Status Input -->
                <base-select-input 
                  col="6" 
                  :optionsList="activeStatuses" 
                  :placeholder="$t('SIDENAV.News_tap.type')"
                 v-model ="data.is_type" required/>
          <!-- End:: Status Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateNewsTapes",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name_ar: null,
        name_en: null,
        is_type: null
      },
      // End:: Data Collection To Send
      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,
    };
  },

  computed: {
     activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.add"),
          value: "up",
        },
        {
          id: 2,
          name: this.$t("STATUS.miuns"),
          value: "down",
        },
      ];
    },
  },

  methods: {
     onCopy(event) {
      event.preventDefault();
    },
    onPaste(event) {
      event.preventDefault();
    },
    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.name_ar = this.data.name_ar.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.name_en = this.data.name_en.replace(this.EnRegex, "");
    },
    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image

    // Start:: validate Form Inputs
   validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name_ar) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      } else if (!this.data.name_en) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else if (!this.data.is_type) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.type_news"));
        return;
      }
      else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("content_ar", this.data.name_ar);
      REQUEST_DATA.append("content_en", this.data.name_en);
      REQUEST_DATA.append("type", this.data.is_type?.value);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `news-tapes`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/news_tapes/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form
  },

  async created() {
  },
};
</script>
