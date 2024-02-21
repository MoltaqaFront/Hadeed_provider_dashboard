<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.add_new_product") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
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
          <!-- Start:: Products Input -->
          <base-select-input
            col="6"
            type="text"
            :optionsList="products"
            :placeholder="$t('PLACEHOLDERS.productName')"
            :tag-placeholder="$t('PLACEHOLDERS.tag_productName')"
            v-model.trim="data.productName"
            required
            @input="getOneProduct"
            @tag="addNewProduct"
            trackBy="name"
            :taggable="true"
          />
          <!-- End:: Products Input -->
          <!-- start add product button -->
          <!-- <v-col md="6" class="d-flex align-center">
            <v-btn color="#313131" style="color: #fff">
              {{ $t("PLACEHOLDERS.add_new_product") }}
            </v-btn>
          </v-col> -->
          <!-- end add product button -->
          <div class="title_route_wrapper"></div>
          <!-- <transition name="fade-transition" mode="out-in"> -->
          <template v-if="data.productName && data.productName.name">
            <!-- start product ar name  -->
            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.productNameAr')"
              v-model="data.productNameAr"
              @input="validateInput"
              :disabled="data?.productName?.id"
            />
            <!-- end product ar name  -->
            <!-- start product en name  -->
            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.productNameEn')"
              v-model="data.productNameEn"
              @input="removeArabicCharacters"
              :disabled="data?.productName?.id"
            />
            <!-- end product en name  -->

            <!-- start price  input -->
            <base-input
              col="6"
              type="number"
              :placeholder="$t('PLACEHOLDERS.price')"
              v-model="data.price"
            />
            <!-- end price input -->
            <!-- start desc arabic -->
            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.descAr')"
              v-model="data.descAr"
              @input="validateInput"
              :disabled="data?.productName?.id"
            />
            <!-- end  desc english -->
            <!-- start desc arabic -->
            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.descEn')"
              v-model="data.descEn"
              @input="removeArabicCharacters"
              :disabled="data?.productName?.id"
            />
            <!-- end  desc english -->
            <!-- start measure input -->
            <base-input
              col="6"
              type="number"
              :placeholder="$t('PLACEHOLDERS.measures')"
              v-model="data.measure"
              :disabled="data?.productName?.id"
            />
            <!-- end measure input -->
            <!-- start weight input -->
            <!-- Start:: weights Input -->
            <base-select-input
              col="6"
              :optionsList="weightList"
              :placeholder="$t('PLACEHOLDERS.weight')"
              v-model="data.weight"
              :disabled="data?.productName?.id"
            />
            <!-- End:: weights Input -->
            <!-- end weight input -->
            <!-- start unit input -->
            <!-- Start:: weights Input -->
            <base-select-input
              col="6"
              :optionsList="weightList"
              :placeholder="$t('PLACEHOLDERS.unit')"
              v-model="data.unit"
              :disabled="data?.productName?.id"
            />
            <!-- End:: weights Input -->
            <!-- Start:: Deactivate Switch Input -->
            <div
              class="input_wrapper switch_wrapper my-5"
              v-if="!data?.productName?.id"
            >
              <v-switch
                color="green"
                :label="
                  data.active
                    ? $t('PLACEHOLDERS.provider')
                    : $t('PLACEHOLDERS.Administration')
                "
                v-model="data.active"
                hide-details
              ></v-switch>
            </div>
            <!-- start category -->
            <base-select-input
              col="6"
              :optionsList="providerlist"
              :placeholder="$t('PLACEHOLDERS.providers')"
              v-if="data.active"
              v-model="data.provider"
            />
            <!-- end category -->

            <!-- End:: Deactivate Switch Input -->
          </template>
          <!-- </transition> -->

          <!-- end unit input -->

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
      EnRegex: /[\u0600-\u06FF]/,
      products: [],
      mainCategory: [],
      subCategory: [],
      weightList: [],
      providerlist: [],

      create: false,

      // Start:: Data Collection To Send
      data: {
        productName: null,
        subCategory: null,
        mainCategory: null,
        measure: null,
        weight: null,
        unit: null,
        desc: null,
        productNameAr: null,
        productNameEn: null,
        price: null,
        descEn: null,
        descAr: null,
        provider: null,

        // active: true,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
      getCountriesData: "ApiGetsModule/allCountriesData",
    }),
  },

  methods: {
    addNewProduct(name) {
      this.products = [...this.products, { name }];
      this.data.productName = { name };
      this.clearProuctInputs();
    },
    // Start:: validate Form Inputs()

    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.productNameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      } else if (!this.data.productNameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else if (!this.data.mainCategory) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    validateInput() {
      // Remove non-Arabic characters from the input
      if (this.data?.productNameAr) {
        this.data.productNameAr = this.data.productNameAr.replace(
          /[^\u0600-\u06FF\s]/g,
          ""
        );
      } else {
        this.data.descAr = this.data.descAr.replace(/[^\u0600-\u06FF\s]/g, "");
      }
    },
    removeArabicCharacters() {
      this.data.productNameEn = this.data.productNameEn.replace(
        this.EnRegex,
        ""
      );
      this.data.descEn = this.data.descEn.replace(this.EnRegex, "");
    },

    // End:: validate Form Inputs
    async getProducts() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "products?page=0&limit=0",
          params: {
            category: `${
              this.data.mainCategory ? this.data.mainCategory.id : ""
            }`,
            subCategory: `${
              this.data.subCategory ? this.data.subCategory.id : ""
            }`,
          },
        });
        this.loading = false;
        this.products = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
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
    // get one product
    fillProdcutInptus(product) {
      this.data.measure = product.measure;
      this.data.unit = product.unit;
      this.data.weight = product.weight;
      this.data.productNameEn = product.name_en;
      this.data.productNameAr = product.name_ar;
      this.data.price = product.price;
      this.data.descEn = product.description_en;
      this.data.descAr = product.description_ar;
    },
    clearProuctInputs() {
      this.data.measure = null;
      this.data.price = null;
      this.data.unit = null;
      this.data.weight = null;
      this.data.descEn = null;
      this.data.descAr = null;
      this.data.productNameEn = null;
      this.data.productNameAr = null;
    },
    async getOneProduct() {
      if (this.data?.productName?.id) {
        try {
          const res = await this.$axios({
            method: "GET",
            url: `/products/${this.data.productName.id}`,
          });
          const { data } = res.data;
          this.fillProdcutInptus(data.Product);
          // console.log("Cities =>", res.data.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        this.clearProuctInputs();
      }
    },
    // end get one product
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
      // REQUEST_DATA.append("is_active", +this.data.active);
      // End :: Append Request Data
      if (this.data?.productName?.id) {
        REQUEST_DATA.append("_method", "PUT");
      }

      try {
        if (this.data?.productName?.id) {
          await this.$axios({
            method: "POST",
            url: `products/${this.data?.productName?.id}`,
            data: REQUEST_DATA,
          });
        } else {
          await this.$axios({
            method: "POST",
            url: `products`,
            data: REQUEST_DATA,
          });
        }

        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/products/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
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
    // start providers list
    async getProviders() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/providers?page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.providerlist = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end providers list
  },

  created() {
    this.getMainCategories();
    this.getSubCategories();
    this.getProducts();
    this.getOneProduct();
    this.getWeights();
    this.getProviders();
  },
};
</script>
