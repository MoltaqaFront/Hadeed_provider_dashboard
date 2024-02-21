<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("BUTTONS.addOffer") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- <base-image-upload-input col="12" identifier="image" :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage" required /> -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.name_ar" required />
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.name_en" required />
          <!-- End:: Name Input -->

          <base-select-input col="6" :optionsList="allPackages" :placeholder="$t('PLACEHOLDERS.package_name')"
            v-model="data.package" required />

          <!-- Start:: Name Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.discount_percentage_on_booking')"
            v-model.trim="data.discount" required />

          <base-picker-input col="6" type="date" :disabledDate="disabledDate" :placeholder="$t('PLACEHOLDERS.startDate')"
            v-model.trim="data.publish_start_date" required />

          <base-picker-input col="6" type="date" :disabledDate="disabledDate" :placeholder="$t('PLACEHOLDERS.end_date')"
            v-model.trim="data.publish_end_date" required />

          <!-- End:: Name Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

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
import moment from "moment";

export default {
  name: "CreateStore",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {

        image: {
          path: null,
          file: null,
        },
        name_ar: null,
        name_en: null,
        offer_value: null,
        active: true,
        discount: null,
        package: null,
        publish_start_date: null,
        publish_end_date: null,
      },

      allPackages: [],
      // End:: Data Collection To Send
    };
  },

  computed: {
  },

  methods: {
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name_ar) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      }
      else if (!this.data.name_en) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      }
      else if (!this.data.publish_start_date) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.startDate"));
        return;
      }
      else if (!this.data.publish_end_date) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.endDate"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      // REQUEST_DATA.append("image", this.data.image.file);
      REQUEST_DATA.append("name[ar]", this.data.name_ar);
      REQUEST_DATA.append("name[en]", this.data.name_en);
      REQUEST_DATA.append("offer_value", this.data.discount);
      REQUEST_DATA.append("package_id", this.data.package?.id);
      REQUEST_DATA.append("offer_date_from", this.data.publish_start_date);
      REQUEST_DATA.append("offer_date_to", this.data.publish_end_date);
      REQUEST_DATA.append("is_active", +this.data.active);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `offers`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/offers/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    async getAllPackages() {
      this.loading = true;
      this.data.vehicle_id = null;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `packages`,
          params: {
            "status": 1
          }
        });
        this.allPackages = res.data.data;
        // console.log(res.data.data)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },


  },

  created() {
    // Start:: Fire Methods
    this.getAllPackages();
    // End:: Fire Methods
  },
};
</script>
