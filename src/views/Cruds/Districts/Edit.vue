<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Districts.edit") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.nameAr"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.nameEn"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-select-input
            col="6"
            :placeholder="$t('TABLES.Areas.name')"
            :optionsList="getAreasData"
            v-model.trim="data.region"
            @input="getCountries"
          />
          <!-- End:: Name Input -->

          <!-- {{ getCountriesData }} -->
          <base-select-input
            col="6"
            v-if="CountriesData"
            :optionsList="CountriesData"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model="data.city"
          />

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
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
        region: null,
        city: null,
        active: true,
      },

      getAreasData: [],
      CountriesData: [],
      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  methods: {
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.nameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      } else if (!this.data.nameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
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
      REQUEST_DATA.append("name_ar", this.data.nameAr);
      REQUEST_DATA.append("name_en", this.data.nameEn);
      REQUEST_DATA.append("area_id", this.data.area_id?.id);
      REQUEST_DATA.append("country_id", this.data.country_id?.id);
      REQUEST_DATA.append("is_active", +this.data.active);
      REQUEST_DATA.append("_method", "PUT");
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `districts/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/districts/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    async getAreas() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `regions`,
        });
        // console.log("Cities =>", res.data.data);
        this.getAreasData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async getCountries() {
      try {
        this.data.country_id = null;
        let res = await this.$axios({
          method: "GET",
          url: `cities`,
          params: {
            region: `${this.data.area_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.CountriesData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async getData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts/${this.$route.params.id}`,
        });
        // console.log("Cities =>", res.data.data);
        this.data.nameAr = res.data.data.District.name_ar;
        this.data.nameEn = res.data.data.District.name_en;
        this.data.region = res.data.data.District.city.region;
        this.data.city = res.data.data.District.city;
        this.data.active = res.data.data.District.is_active;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },

  async created() {
    await this.getData();
    this.getCountries();
    this.getData();
    this.getAreas();
  },
};
</script>
