<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("BUTTONS.show_offer") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- <base-image-upload-input col="12" identifier="image" :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.image')" @selectImage="selectImage" disabled /> -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="data.name" disabled />
          <!-- End:: Name Input -->

          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.package_name')" v-model.trim="data.package"
            disabled />
          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.discount_percentage_on_booking')"
            v-model.trim="data.discount" disabled />

          <base-input col="6" type="date" :placeholder="$t('PLACEHOLDERS.start_date')"
            v-model.trim="data.publish_start_date" disabled />

          <base-input col="6" type="date" :placeholder="$t('PLACEHOLDERS.end_date')" v-model.trim="data.publish_end_date"
            disabled />
          <!-- End:: Name Input -->

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

      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {

        image: {
          path: null,
          file: null,
        },
        name: null,
        package: null,
        active: true,
        discount: null,
        publish_start_date: null,
        publish_end_date: null,
      },

      allStores: [],
      allOrders: [],
      allProducts: [],
    };
  },

  computed: {
  },

  methods: {

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // start all ads data

    async getOffersData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `offers/${this.$route.params.id}`,
        });
        // this.data.image.path = res.data.body.offer.image;
        this.data.name = res.data.data.Offer.name;
        this.data.package = res.data.data.Offer.package.name;
        this.data.discount = res.data.data.Offer.offer_value;
        this.data.publish_start_date = res.data.data.Offer.offer_date_from;
        this.data.publish_end_date = res.data.data.Offer.offer_date_to;
        this.data.active = res.data.data.Offer.is_active;
        // console.log(res.data.data.offer)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end all ads data


  },

  created() {
    // Start:: Fire Methods
    this.getOffersData()
    // End:: Fire Methods
  },
};
</script>
