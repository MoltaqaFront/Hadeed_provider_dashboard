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
          <v-chip color="amber darken-2" text-color="white" v-model="data.numberOfVisits">
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
          <base-image-upload-input
            col="12"
            identifier="client_image"
            :placeholder="$t('PLACEHOLDERS.personalImage')"
            :preSelectedImage="data.image_2"
            disabled
            class="disabled_input"
          />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Ar Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            disabled
            class="disabled_input"
          />
          <!-- End:: Ar Name Input -->

          <!-- Start:: Phone Input -->
          <base-input
            col="6"
            type="tel"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.phone"
            readonly
            class="disabled_input"
          />
          <!-- End:: Phone Input -->

          <!-- <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.registration_otp_status')"
            v-model.trim="data.registration_otp_status" disabled class="disabled_input" /> -->

          <!-- Start:: Email Input -->
          <base-input
            col="6"
            type="email"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            readonly
            class="disabled_input"
          />
          <!-- End:: Email Input -->

          <!-- Start:: Joining Date Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.joiningDate')"
            v-model.trim="data.joiningDate"
            readonly
            class="disabled_input"
          />
          <!-- End:: Joining Date Input -->
          <!-- Start:: type Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model.trim="data.type"
            readonly
            class="disabled_input"
          />
          <!-- End:: type Input -->
          <!-- Start:: registery number Input -->
          <base-input
            v-if="data.type == 'company'"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.registeryNumber')"
            v-model.trim="data.registeryNumber"
            readonly
            class="disabled_input"
          />
          <!-- End:: registery number Input -->
          <!-- Start:: registery image Input -->
          <v-row justify="center">
            <base-image-upload-input
              v-if="data.type == 'company'"
              col="6"
              identifier="registery_image"
              :preSelectedImage="data.image.path"
              :placeholder="$t('PLACEHOLDERS.commercialregisterImage')"
              disabled
              @selectImage="selectImage"
            />
          </v-row>
          <!-- End:: registery image Input -->
        </div>
      </form>
      <!-- ==== End:: Client Main Data ==== -->

      <!-- ==== Start:: Client Addresses ==== -->
      <!-- <div class="table_content">
        <h6 class="table_title mt-5 mb-4"> {{ $t("TITLES.clientAddresses") }} </h6>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" v-for="item in addressesTableHeaders" :key="item">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center text-danger" v-if="data.addresses.length === 0">
                <td colspan="7">
                  {{ $t("TABLES.noData") }}
                </td>
              </tr>
              <template v-else>
                <tr class="text-center" v-for="item in data.addresses" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.full_address }}</td>
                  <td>{{ item.latitude }}</td>
                  <td>{{ item.longitude }}</td>
                  <td>
                    <v-chip color="light-blue darken-3" text-color="white">
                      {{ item.address_type }}
                    </v-chip>
                  </td>
                  <td>
                    <i class="fal fa-check fa-lg text-success" v-if="item.is_default"></i>
                    <i class="fal fa-times fa-lg text-danger" v-else></i>
                  </td>
                </tr>
              </template>
            </tbody>
          </template>
        </v-simple-table>
      </div> -->
      <!-- ==== End:: Client Addresses ==== -->
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
        image: {
          path: null,
          file: null,
        },
        image_2: null,
        name: null,
        phone: null,
        type: "",
        registeryNumber: null,
        registration_otp_status: null,
        secondPhone: null,
        email: null,
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
          url: `clients/${this.id}`,
        });
        // console.log("DATA =>", res.data.data);
        this.data.image_2 = res.data.data.Client.image;

        this.data.name = res.data.data.Client.name;
        this.data.phone = res.data.data.Client.mobile;
        this.data.registration_otp_status = res.data.data.Client.is_verified;
        this.data.email = res.data.data.Client.email;
        this.data.joiningDate = res.data.data.Client.created_at;
        this.data.type = res.data.data.Client.type;
        this.data.registeryNumber = res.data.data.Client.tax_number;
        this.data.numberOfVisits = res.data.data.Client.login_count;
        this.data.lastVisit = res.data.data.Client.last_login;
        this.data.active = res.data.data.Client.is_active;
        this.data.image.path = res.data.data.Client.commercial_registry;
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
