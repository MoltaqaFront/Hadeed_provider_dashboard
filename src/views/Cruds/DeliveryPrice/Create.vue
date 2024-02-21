<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.delivery.add") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
            <base-select-input 
             col="6" 
             :optionsList="regions" 
             :placeholder="$t('TABLES.Golden.area')"
              v-model ="data.region_id" 
              required 
              @input="getCites"
              />

            <base-select-input 
              col="6" 
              v-if="cites"
              :optionsList="cites" 
              :placeholder="$t('TABLES.Golden.city')"
              v-model ="data.cites_id" 
              required/>

              <base-select-input 
                  col="6" 
                  :optionsList="weights" 
                  :placeholder="$t('PLACEHOLDERS.measure_product')"
                  v-model="data.measure_product" 
                  required
                  />
              <!-- Start:: Name Input -->
              <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.fewer_product')" v-model.trim="data.price_before" required />
            <!-- End:: Name Input -->

             <!-- Start:: Name Input -->
                <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.deliveryPrice')" v-model.trim="data.price_after" required />
              <!-- End:: Name Input -->
          
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
        price_before: null,
        price_after: null,
        region_id: null,
        cites_id: null,
        measure_product: null,
      },
      regions: [],
      cites: [],
      weights: [],

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
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  methods: {
    disabledDate(current) {
      return current && current < moment().startOf("day");
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

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.submitForm();
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("min_weight", this.data.price_before);
      REQUEST_DATA.append("cost", this.data.price_after);
      REQUEST_DATA.append("region_id", this.data.region_id?.id);
      REQUEST_DATA.append("city_id", this.data.cites_id?.id);
      REQUEST_DATA.append("weight_id", this.data.measure_product?.id);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `delivery-costs`,
          data: REQUEST_DATA,
         params: {
            "status": 1
          } 
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/delivery-price/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
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
            "isActive": "1" ,
            region: `${this.data.region_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.cites = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
       async getMeaure() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `weights`,
          params: {
            "isActive": "1"
          }
        });
        // console.log("Cities =>", res.data.data);
        this.weights = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

  },

  created() {
    // Start:: Fire Methods
    this.getRegions();
    this.getCites();
    this.getMeaure();
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