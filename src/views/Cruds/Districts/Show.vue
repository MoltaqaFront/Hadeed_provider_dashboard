<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Districts.show") }}</h4>
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
            disabled
            @input="validateInput"
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.nameEn"
            disabled
            @input="removeArabicCharacters"
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            :placeholder="$t('TABLES.Areas.name')"
            type="text"
            v-model.trim="data.area_id"
            @input="getCountries"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model.trim="data.country_id"
            disabled
          />

          <!-- End:: Name Input -->

          <!-- {{ getCountriesData }} -->
          <!-- <base-select-input
            col="6"
            v-if="CountriesData"
            :optionsList="CountriesData"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model.trim="data.country_id"
            readonly
          /> -->

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
              readonly
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->
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
      EnRegex: /[\u0600-\u06FF]/,

      // Start:: Data Collection To Send
      data: {
        nameAr: null,
        nameEn: null,
        area_id: null,
        country_id: null,
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
    async getData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts/${this.$route.params.id}`,
        });
        // console.log("Cities =>", res.data.data);
        this.data.nameAr = res.data.data.District.name_ar;
        this.data.nameEn = res.data.data.District.name_en;
        this.data.area_id = res.data.data.District.city.region.name;
        this.data.country_id = res.data.data.District.city.name;
        this.data.active = res.data.data.District.is_active;
        console.log("first", this.data.country_id);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.nameAr = this.data.nameAr.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.nameEn = this.data.nameEn.replace(this.EnRegex, "");
    },
  },

  created() {
    this.getData();
    this.getAreas();
  },
};
</script>
