<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->

    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addRole") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <div class="col-md-6 col-12">
            <!-- Start:: Name Input -->
            <base-input cols="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.name_ar" required
              @input="validateInput" @copy="onCopy" @paste="onPaste" />
            <!-- End:: Name Input -->
          </div>

          <div class="col-md-6 col-12">
            <!-- Start:: Name Input -->
            <base-input cols="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.name_en"
              @input="removeArabicCharacters" @copy="onCopy" @paste="onPaste" />
            <!-- End:: Name Input -->
          </div>

          <!-- Start:: Permissions -->
          <div class="col-12">
            <div class="row" v-if="allSystemPermissions">

              <div class="btn_wrapper">
                <button class="primary_btn" type="button" @click="checkAllSwitches">{{ $t('PLACEHOLDERS.choose_all')
                }}</button>
              </div>

              <div v-for="permission in allSystemPermissions" :key="permission.id" class="col-md-6">
                <div class="permission_card_wrapper">
                  <p class="card_title"> {{ permission.name }} </p>
                  <div class="card_body">
                    <div class="row">
                      <div v-for="item in permission.controls" :key="item.id" class="col-6">
                        <div class="input_wrapper switch_wrapper my-5">
                          <v-switch color="green" :label="item.name" :value="item.id" v-model="data.permissions"
                            hide-details></v-switch>
                          <!-- @click="handleSwitchChange(permission)" -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End:: Permissions -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "CreateRole",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name_ar: null,
        name_en: null,
        permissions: [],
      },

      EnRegex: /[\u0600-\u06FF]/,
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allSystemPermissions: "PermissionsModule/allSystemPermissions",
    }),
    // End:: Vuex Getters
  },

  methods: {

    onCopy(event) {
      event.preventDefault();
    },
    onPaste(event) {
      event.preventDefault();
    },

    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.name_ar = this.data.name_ar.replace(/[^\u0600-\u06FF\s]/g, "");
    },

    removeArabicCharacters() {
      this.data.name_en = this.data.name_en.replace(this.EnRegex, "");
    },
    // Start:: Vuex Actions
    ...mapActions({
      getAllSystemPermissions: "PermissionsModule/getAllSystemPermissions",
    }),
    // End:: Vuex Actions

    // Function to check all switches when the button is clicked
    checkAllSwitches() {
      // Check if any switch in the group is unchecked
      const allChecked = this.allSystemPermissions.every(permission => {
        return permission.controls.every(item => {
          return this.data.permissions.includes(item.id);
        });
      });

      // If all are checked, uncheck them; otherwise, check them
      this.allSystemPermissions.forEach(permission => {
        permission.controls.forEach(item => {
          const index = this.data.permissions.indexOf(item.id);
          if (allChecked) {
            if (index !== -1) {
              this.data.permissions.splice(index, 1);
            }
          } else {
            if (index === -1) {
              this.data.permissions.push(item.id);
            }
          }
        });
      });
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name_ar) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      }
      else if (!this.data.name_en) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else if (this.data.permissions.length === 0) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.permissions"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("name[ar]", this.data.name_ar);
      REQUEST_DATA.append("name[en]", this.data.name_en);
      this.data.permissions.forEach(element => {
        REQUEST_DATA.append("role_permissions[]", element);
      });
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `roles`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/roles/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form

    handleSwitchChange(permission) {
      console.log(this.data.permissions);

      // Find the indexPermission and showPermission in the current permission
      const indexPermission = permission.controls.find((p) => p.key === "index");
      const showPermission = permission.controls.find((p) => p.key === "show");

      if (permission.key === "index" || permission.key === "show") {
        // For "index" or "show" switches
        if (this.data.permissions.includes(permission.id)) {
          // Toggle the "index" or "show" switch
          const permissionIndex = this.data.permissions.indexOf(permission.id);
          if (permissionIndex !== -1) {
            this.data.permissions.splice(permissionIndex, 1);
          }
        } else {
          // If the "index" or "show" switch is activated, add it to this.data.permissions
          if (!this.data.permissions.includes(permission.id)) {
            this.data.permissions.push(permission.id);
          }
        }
      } else {
        // For other switches
        if (!this.data.permissions.includes(permission.id)) {
          // If a switch other than "index" is activated, make the "index" and "show" switches active
          if (!this.data.permissions.includes(indexPermission.id)) {
            this.data.permissions.push(indexPermission.id);
          }
          if (!this.data.permissions.includes(showPermission.id)) {
            this.data.permissions.push(showPermission.id);
          }
          // Add the current switch to this.data.permissions
          this.data.permissions.push(permission.id);
        } else {
          // If a switch other than "index" is deactivated, remove it from this.data.permissions
          const permissionIndex = this.data.permissions.indexOf(permission.id);
          if (permissionIndex !== -1) {
            this.data.permissions.splice(permissionIndex, 1);
          }
          // Check if there are no other switches active except "index" and "show"
          const otherSwitches = this.data.permissions.filter(
            (p) => p !== "index" && p !== showPermission.id && p !== permission.id
          );
          if (otherSwitches.length === 0) {
            // If no other switches are active, remove "index" and "show" from this.data.permissions
            const indexPermissionIndex = this.data.permissions.indexOf(indexPermission.id);
            const showPermissionIndex = this.data.permissions.indexOf(showPermission.id);
            if (indexPermissionIndex !== -1) {
              this.data.permissions.splice(indexPermissionIndex, 1);
            }
            if (showPermissionIndex !== -1) {
              this.data.permissions.splice(showPermissionIndex, 1);
            }
          }
        }
      }
    },


  },

  async created() {
    // Start:: Fire Methods
    this.getAllSystemPermissions();
    // End:: Fire Methods
  },
};
</script>
