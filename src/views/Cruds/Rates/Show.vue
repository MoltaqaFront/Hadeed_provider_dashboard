<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TABLES.Rates.comment") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.user_name')" v-model.trim="data.name" disabled />
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.phone')" v-model.trim="data.mobile" disabled />
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.status')" v-model.trim="data.status" disabled />
          <base-input col="6" type="text" :placeholder="$t('TABLES.Rates.sendDate')" v-model.trim="data.created_at"
            disabled />
          <base-input col="6" cols="5" rows="5" type="textarea" :placeholder="$t('PLACEHOLDERS.comment')"
            v-model.trim="data.comment" disabled />
          <!-- End:: Name Input -->

        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>

export default {
  name: "showCity",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name: null,
        mobile: null,
        comment: null,
        status: null,
        created_at: null,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
  },

  methods: {
    // start show data
    async showRate() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `rates/${this.$route.params.id}`,
        });
        this.data.name = res.data.data.Rate.name;
        this.data.mobile = res.data.data.Rate.mobile;
        this.data.comment = res.data.data.Rate.comment;
        this.data.status = res.data.data.Rate.status;
        this.data.created_at = res.data.data.Rate.created_at;

      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end show data


  },

  created() {
    // Start:: Fire Methods
    this.showRate();
    // End:: Fire Methods
  },
};
</script>
