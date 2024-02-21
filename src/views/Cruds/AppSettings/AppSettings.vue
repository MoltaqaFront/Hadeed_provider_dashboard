<template>
  <div class="crud_form_wrapper">
    <div class="table_title_wrapper">
          <div class="title_text_wrapper">
            <h5 style="color: #FFA000;">{{ $t("SIDENAV.settings.title") }}</h5>
          </div>
        </div>
    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
     <form @submit.prevent="validateFormInputs">
      <div class="row">
          <div
              class="align-items-center col-6"
               v-for="(key, index) in keysToUpdate"
                  :key="key"
          >
          <base-input
            col="12"
            type="number"
            :placeholder="key.name.ar"
            v-model.trim="key.value.value"
          />
          </div>
          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
              <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
                  :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
      </div>
      </form>

    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
export default {
  name: "GeneralSettings",

  data() {
    return {
      // Start:: Loader Control Data
      keysToUpdate: ["vat", "commission", "golden_offers_max_duration_in_cart", "interval_between_two_notifications"],
      isWaitingRequest: false,
      // End:: Loader Control Data
       placeholders: [
        this.$t('PLACEHOLDERS.VAT_percentage'),
        this.$t('PLACEHOLDERS.present'),
        this.$t('PLACEHOLDERS.package_golden_incart'),
        this.$t('PLACEHOLDERS.package_notifation')
      ],

      // Start:: Data
      data: {
        VAT_percentage: null,
        present: '',
        package_golden_incart: '',
        package_notifation: null
      }
      // End:: Data

    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      getAuthenticatedUserData: "AuthenticationModule/getAuthenticatedUserData"
    }),
    // End:: Vuex Getters
  },


  methods: {

    // Start:: Get Data To Edit
 async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `general-settings`,
        });
        
        this.keysToUpdate = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Submit Form
   async submitForm() {
      this.isWaitingRequest = !this.isWaitingRequest;

      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
     this.keysToUpdate.forEach((setting, index) => {
        REQUEST_DATA.append(`keys[${index}][key]`, setting.key);
        REQUEST_DATA.append(`keys[${index}][value]`, setting.value.value);
      });
      REQUEST_DATA.append("_method" , "PUT" )
      // End:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `general-settings`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
        this.getDataToEdit();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form

    // Start:: validate Form Inputs
    validateFormInputs() {
      // this.isWaitingRequest = true;
      this.submitForm();
    },
    // End:: validate Form Inputs
  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
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
  margin: auto;

  .fa-trash {
    color: #ff2159;
    cursor: pointer
  }
}
</style>