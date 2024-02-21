<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.view_advertiser_trait") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="4" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.nameAr" disabled />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="4" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.nameEn" disabled />
          <!-- End:: Name Input -->

          <base-select-input col="4" :optionsList="fal_license" :placeholder="$t('PLACEHOLDERS.broker_license_required')"
            v-model="data.license" disabled />

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details disabled></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CreateCity",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        nameAr: null,
        nameEn: null,
        license: null,
        active: true,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
      getCountriesData: "ApiGetsModule/allCountriesData",
    }),

    fal_license() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.yes"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.no"),
          value: 0,
        }
      ];
    },
  },

  methods: {

    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `characteristics/${this.$route.params.id}`,
        });
        this.data.nameAr = res.data.data.Characteristic.name_ar;
        this.data.nameEn = res.data.data.Characteristic.name_en;
        if (res.data.data.Characteristic.is_required_fal_license) {
          this.data.license = { name: this.$t("PLACEHOLDERS.yes"), value: res.data.data.Characteristic.is_required_fal_license }
        } else {
          this.data.license = { name: this.$t("PLACEHOLDERS.no"), value: res.data.data.Characteristic.is_required_fal_license }
        }
        this.data.active = res.data.data.Characteristic.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end show data

  },

  created() {
    this.showData()
  },
};
</script>
