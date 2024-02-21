<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.News_tap.edit") }}</h4>
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
  name: "EditNewsTapes",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

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
      // End:: Data Collection To Send
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
    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `news-tapes/${this.id}`,
        });
        // console.log( "DATA TO EDIT =>", res.data.data.region );

        // Start:: Set Data
        this.data.name_ar = res.data.data.NewsTape.content_ar;
        this.data.name_en = res.data.data.NewsTape.content_en;
        this.data.is_type = res.data.data.NewsTape.content;

         if (!this.data.is_type) {
          this.data.is_type =
          {
            id: 1,
            name: this.$t("STATUS.add"),
            value: "up",
          }
        } else {
          this.data.is_type =
          {
            id: 2,
            name: this.$t("STATUS.miuns"),
            value: "down",
          }
        }
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit
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
      REQUEST_DATA.append("_method", "PUT")

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `news-tapes/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/news_tapes/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form
  
    // End:: Submit Form
  },

  async created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
