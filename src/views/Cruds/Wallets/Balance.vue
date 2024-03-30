<template>
  <div>
    <h3>{{ $t("current_balance") }}</h3>
    <!-- Start:: balance Input -->
    <div class="filter_form_wrapper">
      <form @submit.prevent="withdawRequest">
        <base-input
          col="6"
          type="text"
          :placeholder="$t('PLACEHOLDERS.balance')"
          v-model="data.balance"
          disabled
        />
        <!-- Start:: Submit Button Wrapper -->
        <div class="d-flex">
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('PLACEHOLDERS.account_settlement')"
              style="font-size: 16px"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <div class="btn_wrapper mx-5">
            <v-btn
              type="button"
              @click="$router.push('/wallets/history')"
              class="mt-2"
              styleType="primary_btn"
              style="font-size: 16px"
            >
              {{ $t("PLACEHOLDERS.wallet_history") }}
            </v-btn>
          </div>
        </div>
        <!-- End:: Submit Button Wrapper -->
      </form>
    </div>
    <!-- End:: balance Input -->
  </div>
</template>

<script>
export default {
  name: "Balance",
  data() {
    return {
      data: {
        balance: null,
      },
    };
  },
  methods: {
    async getData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `wallets/balance`,
        });
        // console.log("Cities =>", res.data.data);
        this.data.balance = res.data.data.balance;
        console.log("first", this.data.country_id);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async withdawRequest() {
      try {
        let res = await this.$axios({
          method: "POST",
          url: `wallets`,
        });
        // console.log("Cities =>", res.data.data);
        // this.data.balance = res.data.data.balance;
        // console.log("first", this.data.country_id);
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    test() {
      alert(1);
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped></style>
