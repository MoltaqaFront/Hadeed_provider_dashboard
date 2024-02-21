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
          <!-- personal image -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->

          <!-- start email -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            required
          />
          <!-- end email -->
          <!-- start phone -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.phone"
            required
          />
          <!-- start password -->
          <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.password')"
            v-model.trim="data.password"
            required
          />
          <!-- end password -->
          <!-- start password -->
          <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.confirmPassword')"
            v-model.trim="data.confirm_password"
            required
          />
          <!-- end password -->
          <!-- end phone -->
          <!-- Start:: Name Input -->
          <base-select-input
            col="6"
            :optionsList="typeStatuses"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.clientType"
            required
          />
          <!-- End:: Status Input -->
          <!-- start commercial case -->
          <base-input
            v-if="data.clientType?.value == 'company'"
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.tax_number')"
            v-model.trim="data.tax_number"
            required
          />
          <!-- end commercial case -->

          <!-- End:: Name Input -->

          <!-- {{ getCountriesData }} -->
          <base-select-input
            col="6"
            v-if="CountriesData"
            :optionsList="getAreasData"
            :placeholder="$t('SIDENAV.Regions.name')"
            v-model="data.country_id"
            @input="getCountries"
            required
          />

          <base-select-input
            col="6"
            v-if="CountriesData"
            :optionsList="CountriesData"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model="data.area_id"
            required
          />
          <v-row class="justify-center">
            <base-image-upload-input
              v-if="data.clientType?.value == 'individual'"
              col="6"
              identifier="admin_image"
              :preSelectedImage="data.image.path"
              :placeholder="$t('PLACEHOLDERS.personalImage')"
              @selectImage="selectImage"
            />
          </v-row>
          <v-row class="justify-center">
            <base-image-upload-input
              v-if="data.clientType?.value == 'company'"
              col="6"
              identifier="registery_image"
              :preSelectedImage="data.image_2.path"
              :placeholder="$t('PLACEHOLDERS.commercial_register')"
              @selectImage="selectImage_2"
            />
          </v-row>
          <!-- Start:: Deactivate Switch Input -->
          <!-- <div class="input_wrapper switch_wrapper my-5">
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
          </div> -->
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
        name: null,
        area_id: null,
        country_id: null,
        active: true,
        email: null,
        clientType: null,
        phone: null,
        password: null,
        confirm_password: null,
        commercial: false,
        tax_number: false,
        image: {
          path: null,

          file: null,
        },
        image_2: {
          path: null,
          file: null,
        },
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
    typeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("TABLES.Clients.indivdual"),
          value: "individual",
        },
        {
          id: 2,
          name: this.$t("TABLES.Clients.company"),
          value: "company",
        },
      ];
    },
  },

  methods: {
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
      } else if (!this.data.email) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.email"));
      } else if (!this.data.password) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.passowrd"));
      } else if (!this.data.confirm_password) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.passowrd"));
      } else if (!this.data.clientType) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.clientType"));
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    selectImage_2(selectedImage) {
      this.data.image_2 = selectedImage;
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.data.image.file) {
        REQUEST_DATA.append("avatar", this.data.image.file);
      }
      if (this.data.image_2.file) {
        REQUEST_DATA.append("commercial_registry", this.data.image_2.file);
      }

      REQUEST_DATA.append("name", this.data.name);
      REQUEST_DATA.append("email", this.data.email);

      REQUEST_DATA.append("mobile", this.data.phone);
      REQUEST_DATA.append("password", this.data.password);
      REQUEST_DATA.append("confirm_password", this.data.confirm_password);
      REQUEST_DATA.append("tax_number", this.data.tax_number);
      REQUEST_DATA.append("type", this.data.clientType.value);
      REQUEST_DATA.append("city_id", this.data.area_id?.id);
      REQUEST_DATA.append("region_id", this.data.country_id?.id);
      REQUEST_DATA.append("is_active", +this.data.active);

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `clients`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/clients/all" });
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
          params: {
            isActive: 1,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.getAreasData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async getCountries() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities`,
          params: {
            region: `${this.data.country_id?.id}`,
            isActive: 1,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.CountriesData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },

  created() {
    this.getAreas();
    this.getCountries();
  },
};
</script>
