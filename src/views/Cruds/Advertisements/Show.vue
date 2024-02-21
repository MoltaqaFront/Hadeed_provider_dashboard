<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.advertisement.show") }}</h4>
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
            disabled />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input  
            col="6" 
            type="text" 
            :placeholder="$t('PLACEHOLDERS.nameAr')" 
            v-model.trim="data.nameAr"
            @input="validateInput" 
            disabled />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input 
            col="6" 
            type="text" 
            :placeholder="$t('PLACEHOLDERS.nameEn')" 
            v-model.trim="data.nameEn"
            @input="removeArabicCharacters"
            @copy="onCopy" 
            @paste="onPaste" 
            disabled />
          <!-- End:: Name Input -->
          <base-input 
            col="6" 
            type="date" 
            :placeholder="$t('SIDENAV.advertisement.Start_publich')"
            v-model.trim="data.startDate"
            disabled/>

             <base-input 
              col="6" 
              type="date" 
              :placeholder="$t('SIDENAV.advertisement.End_publich')"
              v-model.trim="data.endtDate"
              disabled/>
            <!-- Start:: Status Input -->
            <base-select-input 
              col="6" 
              :optionsList="activeStatuses" 
              :placeholder="$t('PLACEHOLDERS.status')"
              v-model="data.is_active" 
              disabled />
            <!-- End:: Status Input -->
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
        startDate: null,
        endtDate: null,
        is_active: null
      },
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
    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.nameAr = this.data.nameAr.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.nameEn = this.data.nameEn.replace(this.EnRegex, "");
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `ad-spaces/${this.$route.params.id}`,
        });

        // const data = res.data.data.GoldenOffer;
        this.data.nameAr = res.data.data.AdSpace.name_ar;
        this.data.nameEn = res.data.data.AdSpace.name_en;
        this.data.image.path = res.data.data.AdSpace.image;
        this.data.startDate = res.data.data.AdSpace.start_date.split(" ")[0];
        this.data.endtDate = res.data.data.AdSpace.end_date.split(" ")[0];
        this.data.is_active = res.data.data.AdSpace.is_active;
        if (!this.data.is_active) {
          this.data.is_active =
          {
            id: 0,
            name: this.$t("STATUS.notActive"),
            value: true,
          }
        } else {
          this.data.is_active =
          {
            id: 1,
            name: this.$t("STATUS.active"),
            value: false,
          }
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // Start:: validate Form Inputs
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

  .fa-trash {
    color: #ff2159;
    cursor: pointer
  }
}
</style>