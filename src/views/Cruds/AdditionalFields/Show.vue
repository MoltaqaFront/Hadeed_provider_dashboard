<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_additional_fields") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <base-image-upload-input col="12" identifier="admin_image" :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.image')" required disabled />
          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.nameAr"
            @input="validateInput" disabled />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.nameEn"
            @input="removeArabicCharacters" @copy="onCopy" @paste="onPaste" disabled />

          <!-- End:: Name Input -->

          <!-- Start:: estate_depart Input -->
          <base-select-input col="6" :optionsList="allVehicleTypes" :placeholder="$t('PLACEHOLDERS.type_vechile')"
            v-model="data.estate_depart" multiple disabled />
          <!-- End:: estate_depart Input -->

          <!-- Start:: Status Input -->
          <base-select-input col="6" :optionsList="Fields_type" :placeholder="$t('PLACEHOLDERS.additional_field_type')"
            v-model="data.field_type" disabled />
          <!-- End:: Status Input -->

          <div v-if="(data.field_type && data.field_type.value == 'checkbox')
            || (data.field_type && data.field_type.value == 'radio')
            || (data.field_type && data.field_type.value == 'dropdown')">

            <div class="row align-items-center" v-for="(item, index) in field_values" :key="'o' + index">

              <div class="col-lg-6 col-12">
                <base-input col="12" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="item.value_ar"
                  @input="validateInput" disabled />
              </div>
              <div class="col-lg-6 col-12">
                <base-input col="12" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="item.value_en"
                  @input="removeArabicCharacters" @copy="onCopy" @paste="onPaste" disabled />
              </div>

            </div>

          </div>


          <!-- Start:: Status Input -->
          <base-select-input col="6" :optionsList="activeStatuses" :placeholder="$t('PLACEHOLDERS.Adjective')"
            v-model="data.is_required" disabled />
          <!-- End:: Status Input -->

          <!-- Start:: Status Input -->
          <base-select-input col="6" :optionsList="is_show" :placeholder="$t('PLACEHOLDERS.show_on_map_home')"
            v-model="data.is_show" disabled />
          <!-- End:: Status Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details disabled></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

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
        active: true,
        is_required: null,
        is_show: null,
        field_type: null,
        estate_depart: null
      },
      allVehicleTypes: [],

      field_values: [
        {
          value_ar: "",
          value_en: ""
        }
      ],
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
          name: this.$t("PLACEHOLDERS.required_item"),
          value: 1,
        },
        {
          id: 0,
          name: this.$t("PLACEHOLDERS.optional"),
          value: 0,
        }
      ];
    },
    is_show() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.yes"),
          value: 1,
        },
        {
          id: 0,
          name: this.$t("PLACEHOLDERS.no"),
          value: 0,
        }
      ];
    },

    Fields_type() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.textbox"),
          value: "textbox",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.numberbox"),
          value: "number",
        },
        {
          id: 3,
          name: this.$t("PLACEHOLDERS.textarea"),
          value: "textarea",
        },
        {
          id: 4,
          name: this.$t("PLACEHOLDERS.checkbox"),
          value: "checkbox",
        },
        {
          id: 5,
          name: this.$t("PLACEHOLDERS.Radio_Button"),
          value: "radio",
        },
        {
          id: 6,
          name: this.$t("PLACEHOLDERS.drop_down"),
          value: "dropdown",
        }
      ];
    },

  },

  methods: {

    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `additionalFields/${this.$route.params.id}`,
        });
        this.data.image.path = res.data.data.additionalField.icon;
        this.data.nameAr = res.data.data.additionalField.name_ar;
        this.data.nameEn = res.data.data.additionalField.name_en;
        this.data.estate_depart = res.data.data.additionalField.realEstateDepartments;
        this.field_values = res.data.data.additionalField.values;
        this.data.is_required = res.data.data.additionalField.is_required;
        this.data.field_type = res.data.data.additionalField.type;
        this.data.is_show = res.data.data.additionalField.can_show_on_map;

        if (this.data.field_type) {
          this.data.field_type =
          {
            id: 0,
            name: this.data.field_type,
            value: this.data.field_type,
          }
        }

        if (!this.data.is_required) {
          this.data.is_required =
          {
            id: 0,
            name: this.$t("PLACEHOLDERS.optional"),
            value: 0,
          }
        } else {
          this.data.is_required =
          {
            id: 1,
            name: this.$t("PLACEHOLDERS.required_item"),
            value: 1,
          }
        }

        if (!this.data.is_show) {
          this.data.is_show =
          {
            id: 0,
            name: this.$t("PLACEHOLDERS.no"),
            value: 0,
          }
        } else {
          this.data.is_show =
          {
            id: 1,
            name: this.$t("PLACEHOLDERS.yes"),
            value: 1,
          }
        }

        this.data.active = res.data.data.additionalField.is_active;
        // console.log(res.data.body.add_space)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end all ads data

  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    this.showVehicleTypes()
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