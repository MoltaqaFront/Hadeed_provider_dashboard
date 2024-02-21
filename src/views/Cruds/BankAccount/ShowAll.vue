<template>
  <div class="crud_form_wrapper">
    <div class="table_title_wrapper">
      <div class="title_text_wrapper">
        <h5 style="color: #FFA000;">{{ $t("PLACEHOLDERS.bank_accounts_settings") }}</h5>
      </div>
    </div>
    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <div class="row justify-content-center">

            <div class="col-l2">
              <div class="add_another" @click="addBank()"> <!-- Add Bank div -->
                <i class="fas fa-plus-circle"></i>
                <!-- add bank -->
              </div>
            </div>

            <div class="col-12" v-for="(item, index) in banks_account" :key="'l' + index">

              <div class="item d-flex align-items-center">
                <div class="row w-100">
                  <div class="col-lg-6 col-12">

                    <base-select-input class="w-100" :optionsList="banks" :placeholder="$t('PLACEHOLDERS.bank_name')"
                      v-model.trim="item.bank_name" />
                  </div>

                  <div class="col-lg-6" v-for="(iban, ibanIndex) in item.ibans" :key="ibanIndex">
                    <div class="iban_col d-flex">
                      <base-input class="w-100" type="text" :placeholder="$t('PLACEHOLDERS.iban')"
                        v-model.trim="iban.iban_num" />

                      <div class="add_another">
                        <div @click="removeIban(index, ibanIndex)">
                          <i class="fas fa-minus-circle"></i>
                          <!-- remove iban -->
                        </div>
                      </div>
                    </div>

                  </div>
                </div>


                <div class="add_another">
                  <div @click="addIban(index)"> <!-- Add IBAN div -->
                    <i class="fas fa-plus-circle"></i>
                    <!-- add iban -->
                  </div>
                </div>
              </div>

              <div class="add_another" v-if="banks_account.length > 2">
                <div @click="removeBank(index, item)"> <!-- Remove Bank div -->
                  <i class="fas fa-minus-circle"></i>
                  <!-- Remove Bank -->
                </div>
              </div>

            </div>

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
export default {
  name: "GeneralSettings",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        bank_id: null

      },
      banks: [],
      // End:: Data Collection To Send

      banks_account: [
        {
          bank_name: '',
          ibans: [
            {
              iban_num: ''
            }
          ]
        }
      ]
    };
  },

  methods: {

    addBank() {
      this.banks_account.push({
        bank_name: '',
        ibans: [{ iban_num: '' }]
      });
    },
    async removeBank(index , item) {
      this.banks_account.splice(index, 1);

      console.log(item);

       try {
        await this.$axios({
          method: "DELETE",
          url: `admin-banks/${item.id}`,
        });
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    addIban(bankIndex) {
      this.banks_account[bankIndex].ibans.push({ iban_num: '' });
    },
    removeIban(bankIndex, ibanIndex) {
      this.banks_account[bankIndex].ibans.splice(ibanIndex, 1);
    },

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin-banks`,
        });
        this.banks_account = res.data.data.map(item => ({
          id:item.id,
          bank_name: item.bank,
          ibans: [
            {
              iban_num: item.iban
            }
          ]
        }));
        // End:: Set Data
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

      this.banks_account.forEach((element, index) => {
        REQUEST_DATA.append(`bank_id`, element.bank_name?.id);

        element.ibans.forEach((iban, inner_index) => {
          REQUEST_DATA.append(`iban`, iban.iban_num);
        });

      });

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `admin-banks`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
        this.getDataToEdit();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    async getBanks() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `banks`
        });
        // console.log("Cities =>", res.data.data);
        this.banks = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.submitForm();
    },
    // End:: validate Form Inputs
  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    this.getBanks();
    // End:: Fire Methods
  },
};
</script>


<style lang="scss" scoped>
.item {
  gap: 10px
}

.iban_col {
  gap: 10px;
}

.all_action {
  display: flex;
  gap: 15px
}

.add_another {
  border: none;
  padding: 8px;
  width: 40px;
  // min-width: 110px;
  // max-width: 190px;
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