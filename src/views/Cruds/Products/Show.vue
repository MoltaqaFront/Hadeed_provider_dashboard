<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_products") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            identifier="admin_image"
            :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.productImage')"
            @selectImage="selectImage"
            disabled
          />
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.productName')"
            v-model.trim="data.productName"
            disabled
            required
          />
          <!-- End:: Name Input -->
          <!-- Start::category Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            disabled
            required
          />
          <!-- End:: category Input -->

          <!-- Start:: subcategory Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.sub_category')"
            v-model="data.subCategory"
            disabled
            required
          />
          <!-- End:: subcategory Input -->

          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.trim="data.price"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.weight')"
            v-model.trim="data.weight"
            disabled
          />

          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.measure')"
            v-model.trim="data.measure"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.unit')"
            v-model.trim="data.unit"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.desc')"
            v-model.trim="data.desc"
            disabled
          />
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
        image: {
          path: null,
          file: null,
        },
        productName: null,
        nameEn: null,
        mainCategory: null,
        subCategory: null,
        price: null,
        weight: null,
        measure: null,
        unit: null,
        desc: null,
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
          name: this.$t("PLACEHOLDERS.yes"),
          value: 1,
        },
        {
          id: 0,
          name: this.$t("PLACEHOLDERS.no"),
          value: 0,
        },
      ];
    },
  },

  methods: {
    // start all package data
    async getPackageData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `products/${this.$route.params.id}`,
        });
        console.log(res.data.data);

        this.data.productName = res.data.data.Product.name;
        this.data.mainCategory = res.data.data.Product.category.name;
        this.data.subCategory = res.data.data.Product.sub_category.name;
        this.data.price = res.data.data.Product.price;
        this.data.measure = res.data.data.Product.measure;
        this.data.unit = res.data.data.Product.unit.name;
        this.data.desc = res.data.data.Product.description;
        this.data.weight = res.data.data.Product.weight.name;
        this.data.image.path = res.data.data.Product.image;
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
