<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Provider.data") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!--satrt:: personal image -->
          <v-row class="justify-center">
            <base-image-upload-input
              col="6"
              class="justify-center"
              identifier="admin_image"
              :preSelectedImage="data.image_3.path"
              :placeholder="$t('PLACEHOLDERS.Company_logo')"
              @selectImage="selectImage_3"
            />
          </v-row>
          <!-- end::personal image -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.providerName')"
            v-model.trim="data.providerName"
            required
          />
          <!-- End:: Name Input -->

          <!-- start email -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.companyName')"
            v-model.trim="data.companyName"
            required
          />
          <!-- end email -->
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
            @input="getDisticts"
          />
          <!-- Start:: district Input -->
          <base-select-input
            col="6"
            :placeholder="$t('TABLES.Areas.name')"
            :optionsList="DistrictsData"
            v-model.trim="data.district_id"
          />
          <!-- End:: district Input -->
          <v-row class="justify-between">
            <base-image-upload-input
              col="6"
              identifier="tax_register"
              :preSelectedImage="data.image.path"
              :placeholder="$t('PLACEHOLDERS.Tax_registration')"
              @selectImage="selectImage"
            />

            <base-image-upload-input
              col="6"
              identifier="registery_image"
              :preSelectedImage="data.image_2.path"
              :placeholder="$t('PLACEHOLDERS.commercial_register')"
              @selectImage="selectImage_2"
            />
          </v-row>
          <div class="row">
            <div class="col-12">
              <GmapMap
                :center="center"
                :zoom="7"
                map-type-id="terrain"
                style="width: 100%; height: 300px"
                @click="handleMapClick"
              >
                <GmapMarker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @click="markerClicked"
                  @dragend="markerDragged($event)"
                />
              </GmapMap>
            </div>
          </div>

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
        companyName: null,
        area_id: null,
        providerName: null,
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
        image_3: {
          path: null,
          file: null,
        },
      },
      DistrictsData: [],
      getAreasData: [],
      CountriesData: [],
      center: { lat: 24.7136, lng: 46.6753 },
      zoom: 10,
      currentPlace: null,
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },
      polylineOptions: {
        strokeColor: "#FF0000", // Red color
        strokeOpacity: 1.0,
        strokeWeight: 2,
        geodesic: true,
      },

      Latitude: "",
      Longitude: "",
      Radius: "",
      place: "",

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
      if (!this.data.companyName) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
      } else if (!this.data.email) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.email"));
      } else if (!this.data.password) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.password"));
      } else if (!this.data.confirm_password) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.password"));
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
    selectImage_3(selectedImage) {
      this.data.image_3 = selectedImage;
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

      REQUEST_DATA.append("company_name", this.data.companyName);
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
          url: `/profile-update-request`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        // this.$router.push({ path: "/clients/all" });
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
    // start get districts
    async getDisticts() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts`,
          params: {
            region: `${this.data.country_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.DistrictsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end get districts
    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );

      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          this.Latitude = lat;
          this.Longitude = lng;
          this.Radius = radius;
          this.place = results[0].formatted_address;

          console.log("Latitude:", lat);
          console.log("Longitude:", lng);
          console.log("Radius:", radius);
          console.log("Place:", results[0].formatted_address);

          this.marker.position = { lat, lng }; // Update the marker's position
        }
      });
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // Radius of the earth in kilometers
      const dLat = this.deg2rad(lat2 - lat1);
      const dLng = this.deg2rad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Convert to meters
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    handleMarkerClick(index) {
      console.log("Marker clicked:", index);
    },

    setPlace(place) {
      this.currentPlace = place;
    },

    markerClicked() {
      // Handle marker click event
      const lat = this.marker.position.lat;
      const lng = this.marker.position.lng;
      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );
      console.log("Marker clicked:", lat, lng);
      console.log(radius);
    },

    markerDragged(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker.position = { lat, lng };
      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );

      this.Latitude = lat;
      this.Longitude = lng;
      this.Radius = radius;

      console.log("Latitude dragged:", lat);
      console.log("Longitude dragged:", lng);
      console.log("Radius dragged:", radius);
    },
  },

  created() {
    this.getAreas();
    this.getCountries();
  },
};
</script>
