<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Orders.add") }}</h4>
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
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->
          <!-- start mobile Input -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.mobile"
            required
          />
          <!-- end mobile Input -->
          <!-- Start:: region Input -->
          <base-select-input
            col="6"
            :placeholder="$t('TABLES.Areas.name')"
            :optionsList="getRegionsData"
            v-model.trim="data.region_id"
            @input="getCities"
          />
          <!-- End:: region Input -->

          <!-- {{ getCitiesData }} -->
          <base-select-input
            col="6"
            :optionsList="CitiesData"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model="data.city_id"
            @input="
              getDisticts();
              getGoldenOffers();
            "
          />
          <!-- start category -->
          <base-select-input
            col="6"
            :optionsList="mainCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            @input="getSubCategories"
          />
          <!-- end category -->
          <!-- start sub category -->
          <base-select-input
            col="6"
            :optionsList="subCategory"
            :placeholder="$t('PLACEHOLDERS.sub_category')"
            v-model="data.subCategory"
            @input="getProducts"
          />
          <!-- end sub category -->
          <!-- start products -->
          <base-select-input
            col="6"
            :optionsList="productsData"
            :multiple="true"
            :focus="false"
            :placeholder="$t('PLACEHOLDERS.products')"
            v-model="data.product"
          />
          <!-- end products -->
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
        name: null,
        mobile: null,
        city_id: null,
        region_id: null,
        subCategory: null,
        mainCategory: null,
        product: null,
      },

      CitiesData: [],
      getRegionsData: [],
      DistrictsData: [],
      mainCategory: [],
      subCategory: [],
      productsData: [],
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

      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs
    // start regions
    async getRegions() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `regions`,
        });
        // console.log("Cities =>", res.data.data);
        this.getRegionsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end regions
    // start city
    async getCities() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities`,
          params: {
            region: `${this.data.region_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.CitiesData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // start get districts
    async getDisticts() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts`,
          params: {
            region: `${this.data.region_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.DistrictsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
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
            category: `${this.data.mainCategory.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.subCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end sub category
    // start products
    async getProducts() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/products?page=0&limit=0`,
          params: {
            category: `${this.data.mainCategory.id}`,
            sub_category: `${
              this.data.subCategory ? this.data.subCategory.id : ""
            }`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.productsData = res.data.data.map((item) => ({
          id: item.id,
          name: `${this.$t("productName")} : ${item.name}  ${this.$t(
            "price"
          )}: ${item.price}`,
        }));
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end products
    // start Golden
    async getGoldenOffers() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/golden-offers?page=0&limit=0&isActive=1&status=active`,
          params: {
            category: `${this.data.mainCategory.id}`,
            city: `${this.data.city_id ? this.data.city_id.id : ""}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.productsData = res.data.data.map((item) => ({
          id: item.id,
          name: `${this.$t("productName")} : ${item.name}  ${this.$t(
            "price"
          )}: ${item.price}`,
        }));
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end Golden
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("name", this.data.name);

      try {
        await this.$axios({
          method: "POST",
          url: `weights`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/measure/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  created() {
    this.getRegions();
    this.getCities();
    this.getDisticts();
    this.getMainCategories();
    this.getSubCategories();
    this.getProducts();
    this.getGoldenOffers();
  },
};
</script>
