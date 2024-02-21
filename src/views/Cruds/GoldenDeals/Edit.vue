<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.golden.edit") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input 
            col="12" 
            identifier="admin_image" 
             :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage" 
            required />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.nameAr"
            @input="validateInput" required />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.nameEn"
            @input="removeArabicCharacters" @copy="onCopy" @paste="onPaste" required />

          <!-- End:: Name Input -->

          <div class="table_title_wrapper">
            <div class="title_text_wrapper">
              <h5 style="color: #FFA000;">{{ $t("SIDENAV.Products.title") }}</h5>
            </div>
          </div>
          <div>
            <span class="add_another" @click="addRow(index)">
              <i class="fas fa-plus"></i>
            </span>

            <div class="row align-items-center" v-for="(item, index) in field_values" :key="'o' + index">

              <div class="col-lg-6 col-12">
                <base-select-input col="12" :optionsList="categories" :placeholder="$t('PLACEHOLDERS.main_category')"
                  v-model.trim="item.category" required @input="subcategoriesTypes(item.category)" />
              </div>
              <div class="col-lg-6 col-12">
                <base-select-input col="12" :optionsList="subcategories" :placeholder="$t('PLACEHOLDERS.sub_category')"
                  v-model.trim="item.subcategory" required @input="productsTypes(item.category, item.subcategory)" />
              </div>

              <div class="col-lg-6 col-12">
                <base-select-input col="12" :optionsList="products" :placeholder="$t('TABLES.Offers.product')"
                  v-model.trim="item.products_menu" required />
              </div>
              <!-- Start:: Name Input -->
              <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.Quantity')" v-model.trim="item.mount"
                required />
              <!-- End:: Name Input -->

              <div class="col-2">
                <div class="all_actions">
                  <span class="add_another" @click="removeRow(index)">
                    <i class="fas fa-minus"></i>
                  </span>

                </div>
              </div>

            </div>

          </div>


          <!-- Start:: Name Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.price_before')"
            v-model.trim="data.price_before" required />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.price_after')" v-model.trim="data.price_after"
            required />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.des_ar')" v-model.trim="data.des_ar"
            @input="validateInput" required />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.des_en')" v-model.trim="data.des_en"
            @input="removeArabicCharacters" @copy="onCopy" @paste="onPaste" required />

          <!-- End:: Name Input -->

          <base-select-input col="6" :optionsList="regions" :placeholder="$t('TABLES.Golden.area')"
            v-model="data.region_id" required @input="getCites" />

          <base-select-input col="6" v-if="cites" :optionsList="cites" :placeholder="$t('TABLES.Golden.city')"
            v-model="data.cites_id" required />

          <!-- Start:: Deactivate Switch Input -->

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
import moment from "moment";

export default {
  name: "CreateAdditionalFields",

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
        nameAr: null,
        nameEn: null,
        categories: null,
        subcategories: null,
        products: null,
        mount: null,
        price_before: null,
        price_after: null,
        des_ar: null,
        des_en: null,
        region_id: null,
        cites_id: null,
        is_active: null
      },
      categories: [],
      subcategories: [],
      products: [],
      regions: [],
      cites: [],

      field_values: [
        {
          category: "",
          subcategory: "",
          products_menu: "",
          mount: ""
        },
      ],
      // End:: Data Collection To Send

      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,
    };
  },

  computed: {

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: true,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: false,
        },
      ];
    },
  },

  methods: {
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },

    onCopy(event) {
      event.preventDefault();
    },
    onPaste(event) {
      event.preventDefault();
    },

    addRow() {
      this.field_values.push(
        {
          category: "",
          subcategory: "",
          products_menu: "",
          mount: ""
        }
      )
    },

    removeRow(index) {
      this.field_values.splice(index, 1)
    },

    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.nameAr = this.data.nameAr.replace(/[^\u0600-\u06FF\s]/g, "");
      this.data.des_ar = this.data.des_ar.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.nameEn = this.data.nameEn.replace(this.EnRegex, "");
      this.data.des_en = this.data.des_en.replace(this.EnRegex, "");
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `golden-offers/${this.$route.params.id}`,
        });

        // const data = res.data.data.GoldenOffer;
        this.data.image.path = res.data.data.GoldenOffer.image;
        this.data.nameAr = res.data.data.GoldenOffer.name_ar;
        this.data.nameEn = res.data.data.GoldenOffer.name_en;
        this.data.price_before = res.data.data.GoldenOffer.price;
        this.data.price_after = res.data.data.GoldenOffer.discounted_price;
        this.data.des_ar = res.data.data.GoldenOffer.description_ar;
        this.data.des_en = res.data.data.GoldenOffer.description_en;
        this.data.region_id = res.data.data.GoldenOffer.region;
        this.data.cites_id = res.data.data.GoldenOffer.city;
        // this.data.is_active = res.data.data.GoldenOffer.is_active;

        // Populate the field_values array
        this.field_values = res.data.data.GoldenOffer.items.map((item) => ({
          category: item.product.category,
          subcategory: item.product.sub_category,
          products_menu: item.product,
          mount: item.quantity.toString(),
        }));

        //  if (!this.data.is_active) {
        //   this.data.is_active =
        //   {
        //     id: 0,
        //     name: this.$t("STATUS.notActive"),
        //     value: 0,
        //   }
        // } else {
        //   this.data.is_active =
        //   {
        //     id: 1,
        //     name: this.$t("STATUS.active"),
        //     value: 1,
        //   }
        // }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
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
      }
      else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("image", this.data.image.file);
      REQUEST_DATA.append("name_ar", this.data.nameAr);
      REQUEST_DATA.append("name_en", this.data.nameEn);
      REQUEST_DATA.append("price", this.data.price_before);
      REQUEST_DATA.append("discounted_price", this.data.price_after);
      REQUEST_DATA.append("description_ar", this.data.des_ar);
      REQUEST_DATA.append("description_en", this.data.des_en);
      REQUEST_DATA.append("region_id", this.data.region_id?.id);
      REQUEST_DATA.append("city_id", this.data.cites_id?.id);
      // REQUEST_DATA.append("is_active", this.data.is_active?.value);
      if (this.field_values) {
        this.field_values.forEach((element, index) => {
          if (element.products_menu) {
            REQUEST_DATA.append(`items[${index}][id]`, element.products_menu?.id);
          }
          if (element.mount) {
            REQUEST_DATA.append(`items[${index}][quantity]`, element.mount);
          }
        });
      }
      REQUEST_DATA.append("_method", "PUT")
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `golden-offers/${this.$route.params.id}`,
          data: REQUEST_DATA,
          params: {
            "status": 1
          }
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/golden-deals/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    async showVehicleTypes() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `categories`,
          params: {
            "isActive": "1"
          }
        });
        this.categories = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async subcategoriesTypes(item) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `sub-categories`,
          params: {
            "isActive": "1",
            category: `${item.id}`,
          }
        });
        this.subcategories = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async productsTypes(main_cat, sub_cat) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `products`,
          params: {
            "isActive": "1",
            category: `${main_cat.id}`,
            subCategory: `${sub_cat.id}`,
            // status: "aproved"
          }
        });
        this.products = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getRegions() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `regions`,
          params: {
            "isActive": "1"
          }
        });
        // console.log("Cities =>", res.data.data);
        this.regions = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async getCites() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities`,
          params: {
            "isActive": "1",
            region: `${this.data.region_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.cites = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    this.showVehicleTypes();
    // this.subcategoriesTypes();
    // this.productsTypes();
    this.getRegions();
    this.getCites();
    // End:: Fire Methods
  },
};
</script>

<style lang="scss" scoped>
.all_action {
  display: flex;
  gap: 15px
}

.add_another {
  border: none;
  padding: 8px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--light_gray_clr);
  border-radius: 50%;
  font-size: 18px;
  color: var(--light_gray_clr);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .fa-trash {
    color: #ff2159;
    cursor: pointer
  }
}
</style>