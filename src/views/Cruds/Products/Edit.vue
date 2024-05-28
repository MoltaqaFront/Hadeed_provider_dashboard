<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.edit_products") }}</h4>
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
          />
          <!-- Start::product Name ar Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.productNameAr')"
            v-model.trim="data.productNameAr"
            @input="validateInput"
            required
          />
          <!-- End::product Name ar Input -->
          <!-- Start:: product Name en Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.productNameEn')"
            v-model.trim="data.productNameEn"
            @input="removeArabicCharacter"
            required
          />
          <!-- End:: product Name en Input -->
          <!-- Start::  desc ar Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.descAr')"
            v-model.trim="data.descAr"
            required
          />
          <!-- End:: desc ar Input -->
          <!-- Start:: desc en Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.descEn')"
            v-model.trim="data.descEn"
            required
          />
          <!-- End:: desc en Input -->
          <!-- Start::category Input -->
          <base-select-input
            col="6"
            :optionsList="mainCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            @input="getSubCategories"
          />
          <!-- End:: category Input -->

          <!-- Start:: subcategory Input -->
          <base-select-input
            col="6"
            :optionsList="subCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.subCategory"
            @input="getSubCategories"
          />
          <!-- End:: subcategory Input -->

          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.trim="data.price"
          />

          <!-- Start:: subcategory Input -->
          <base-select-input
            col="6"
            :optionsList="subCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.subCategory"
            @input="getSubCategories"
          />
          <!-- End:: subcategory Input -->
          <!-- Start:: weights Input -->
          <base-select-input
            col="6"
            :optionsList="weightList"
            :placeholder="$t('PLACEHOLDERS.weight')"
            v-model="data.weight"
          />
          <!-- End:: weights Input -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.measure')"
            v-model.trim="data.measure"
          />
          <!-- Start:: weights Input -->
          <base-select-input
            col="6"
            :optionsList="weightList"
            :placeholder="$t('PLACEHOLDERS.unit')"
            v-model="data.unit"
          />
          <!-- End:: weights Input -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Edit Product",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      EnRegex: /[\u0600-\u06FF]/,
      mainCategory: [],
      subCategory: [],
      weightList: [],
      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        productNameAr: null,
        productNameEn: null,
        descAr: null,
        descEn: null,
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

        this.data.productNameAr = res.data.data.Product.name_ar;
        this.data.productNameEn = res.data.data.Product.name_en;
        this.data.descEn = res.data.data.Product.description_en;
        this.data.descAr = res.data.data.Product.description_ar;
        this.data.mainCategory = res.data.data.Product.category;
        this.data.subCategory = res.data.data.Product.sub_category;
        this.data.price = res.data.data.Product.offer.price;
        this.data.measure = res.data.data.Product.measure;
        this.data.unit = res.data.data.Product.unit;
        this.data.weight = res.data.data.Product.weight;
        this.data.image.path = res.data.data.Product.image;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // start post form data
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.productNameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.productNameAr"));
        return;
      } else if (!this.data.productNameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.productNameEn"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("name_ar", this.data.productNameAr);
      REQUEST_DATA.append("name_en", this.data.productNameEn);
      REQUEST_DATA.append("category_id", this.data.mainCategory.id);
      REQUEST_DATA.append("sub_category_id", this.data.subCategory.id);
      REQUEST_DATA.append("weight_id", this.data?.weight?.id);
      REQUEST_DATA.append("measure", this.data.measure);
      REQUEST_DATA.append("unit_id", this.data.unit.id);
      REQUEST_DATA.append("description_en", this.data.descEn);
      REQUEST_DATA.append("description_ar", this.data.descAr);
      REQUEST_DATA.append("price", this.data.price);

      REQUEST_DATA.append("_method", "PUT");
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `products/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/products/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // end post form data
    // end all package data
    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.productNameAr = this.data.productNameAr.replace(
        /[^\u0600-\u06FF\s0-9]/g,
        ""
      );
    },
    removeArabicCharacters() {
      this.data.productNameEn = this.data.productNameEn.replace(
        this.EnRegex,
        ""
      );
    },
    // get selected data
    // start main category
    async getMainCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/categories?page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.mainCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end main category
    // start sub category
    async getSubCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/sub-categories?page=0&limit=0`,
          params: {
            category: `${
              this.data.mainCategory ? this.data.mainCategory.id : ""
            }`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.subCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end sub category
    // start weight
    async getWeights() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/weights?page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.weightList = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end weight
  },

  created() {
    // Start:: Fire Methods
    this.getPackageData();
    this.getMainCategories();
    this.getWeights();
    // End:: Fire Methods
  },
};
</script>
