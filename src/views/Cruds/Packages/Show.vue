<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_package") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.nameAr" disabled />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.nameEn" disabled />
          <!-- End:: Name Input -->

          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.price')" v-model.trim="data.price" disabled />

          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.number_of_ads')"
            v-model.trim="data.number_of_ads" disabled />

          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.package_duration')"
            v-model.trim="data.package_duration" disabled />

          <base-select-input col="6" :optionsList="show_image"
            :placeholder="$t('PLACEHOLDERS.show_advertiser_image_logo')" v-model.trim="data.show_image" disabled />

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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateStore",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        nameAr: null,
        nameEn: null,
        price: null,
        discount_percentage: null,
        package_duration: null,
        number_people_allowed: null,
        show_image: null,
        number_of_ads: null,
        active: true,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allOrderTypes: "ApiGetsModule/allOrderTypesData",
    }),
    // End:: Vuex Getters

    show_image() {
      return [
        {
          id: 1,
          name: this.$t('PLACEHOLDERS.yes'),
          value: 1
        },
        {
          id: 0,
          name: this.$t('PLACEHOLDERS.no'),
          value: 0
        }
      ]
    }
  },

  methods: {


    // start all package data
    async getPackageData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `packages/${this.$route.params.id}`,
        });
        this.data.nameAr = res.data.data.Package.name_ar;
        this.data.nameEn = res.data.data.Package.name_en;
        this.data.price = res.data.data.Package.price;
        this.data.package_duration = res.data.data.Package.duration;
        this.data.number_of_ads = res.data.data.Package.number_of_advertisements;
        this.data.show_image = res.data.data.Package.can_show_image;

        if (this.data.show_image) {
          this.data.show_image = { name: this.$t('PLACEHOLDERS.yes'), value: res.data.data.Package.can_show_image };
        } else {
          this.data.show_image = { name: this.$t('PLACEHOLDERS.no'), value: res.data.data.Package.can_show_image };
        }

        this.data.active = res.data.data.Package.is_active;
        // console.log(res.data.body.package)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end all package data


  },

  created() {
    // Start:: Fire Methods
    this.getPackageData();
    // End:: Fire Methods
  },
};
</script>
