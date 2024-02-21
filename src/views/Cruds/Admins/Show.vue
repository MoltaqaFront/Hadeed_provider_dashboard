<template>
  <div class="crud_form_wrapper single_show_content_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showClient", { name: data.name }) }}</h4>
    </div>
    <!-- End:: Title -->


    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- ==== Start:: Status Badges ==== -->
      <div class="badges_wrapper justify-content-between">
        <div class="wrapper">
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.numberOfVisits", { number: data.numberOfVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
        </div>

        <v-chip :color="data.active ? 'green' : 'red'" text-color="white">
          {{ data.active ? $t("STATUS.active") : $t("STATUS.notActive") }}
        </v-chip>
      </div>
      <!-- ==== End:: Status Badges ==== -->

      <!-- ==== Start:: Client Main Data ==== -->
      <form>
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input col="12" identifier="client_image" :placeholder="$t('PLACEHOLDERS.personalImage')"
            :preSelectedImage="data.image" disabled class="disabled_input" />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Ar Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="data.name" disabled
            class="disabled_input" />
          <!-- End:: Ar Name Input -->

          <!-- Start:: Phone Input -->
          <base-input col="6" type="tel" :placeholder="$t('PLACEHOLDERS.phone')" v-model.trim="data.phone" readonly
            class="disabled_input" />
          <!-- End:: Phone Input -->

          <!-- <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.registration_otp_status')"
            v-model.trim="data.registration_otp_status" disabled class="disabled_input" /> -->

          <!-- Start:: Email Input -->
          <base-input col="6" type="email" :placeholder="$t('PLACEHOLDERS.email')" v-model.trim="data.email" readonly
            class="disabled_input" />
          <!-- End:: Email Input -->

          <!-- Start:: Joining Date Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.joiningDate')" v-model.trim="data.joiningDate"
            readonly class="disabled_input" />
          <!-- End:: Joining Date Input -->

           <!-- Start:: Roles Input -->
            <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.role')" v-model.trim="data.role" disabled />
            <!-- End:: Roles Input -->

        </div>
      </form>
      <!-- ==== End:: Client Main Data ==== -->

    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "SingleClient",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Start:: Loading Data
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Table Data
      addressesTableHeaders: [
        { text: this.$t("TABLES.Addresses.serialNumber") },
        { text: this.$t("TABLES.Addresses.address") },
        { text: this.$t("TABLES.Addresses.longitude") },
        { text: this.$t("TABLES.Addresses.latitude") },
        { text: this.$t("TABLES.Addresses.type") },
        { text: this.$t("TABLES.Addresses.isDefault") },
      ],
      // End:: Table Data

      // Start:: Data
      data: {
        image: null,
        name: null,
        phone: null,
        registration_otp_status: null,
        secondPhone: null,
        email: null,
        role: null,
        joiningDate: null,
        currentPackage: null,
        addresses: [],
        active: false,
      },
      // End:: Data
    };
  },

  methods: {
    // Start:: Get Data To Show
    async getDataToShow() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admins/${this.id}`,
        });
        // console.log("DATA =>", res.data.data);
        this.data.image = res.data.data.Admin.image;
        this.data.name = res.data.data.Admin.name;
        this.data.phone = res.data.data.Admin.mobile;
        this.data.registration_otp_status = res.data.data.Admin.is_verified;
        this.data.email = res.data.data.Admin.email;
        this.data.joiningDate = res.data.data.Admin.created_at;
        this.data.numberOfVisits = res.data.data.Admin.login_counter;
        this.data.role = res.data.data.Admin.roles[0].name;
        this.data.lastVisit = res.data.data.Admin.last_login_at;
        this.data.active = res.data.data.Admin.is_active;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Show
  },

  created() {
    // Start:: Fire Methods
    this.getDataToShow();
    // End:: Fire Methods
  },
};
</script>
