<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div class="filter_content_wrapper" :class="{ active: filterFormIsActive }">
        <button class="filter_toggler" @click="filterFormIsActive = !filterFormIsActive">
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>
        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start:: Name Input -->
              <base-input col="4" type="text" :placeholder="$t('TABLES.ContactMessages.clientName')"
                v-model.trim="filterOptions.name" />
              <!-- End:: Name Input -->

              <!-- Start:: Phone Input -->
              <base-input col="4" type="tel" :placeholder="$t('PLACEHOLDERS.phone')" v-model.trim="filterOptions.phone" />
              <!-- End:: Phone Input -->

              <!-- Start:: Email Input -->
              <base-input col="4" type="email" :placeholder="$t('PLACEHOLDERS.email')"
                v-model.trim="filterOptions.email" />
              <!-- End:: Email Input -->

              <!-- Start:: Date Input -->
              <!-- <base-picker-input col="4" type="date" :placeholder="$t('PLACEHOLDERS.date')"
                v-model.trim="filterOptions.date" /> -->
              <!-- End:: Date Input -->

              <!-- Start:: Message Type Input -->
              <base-select-input col="4" :optionsList="messageTypes" :placeholder="$t('PLACEHOLDERS.messageType')"
                v-model="filterOptions.messageType" />
              <!-- End:: Message Type Input -->

              <!-- Start:: Message Status Input -->
              <base-select-input col="4" :optionsList="messageStatuses" :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status" />
              <!-- End:: Message Status Input -->
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button class="reset_btn" type="button" :disabled="isWaitingRequest" @click="resetFilter">
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("TITLES.contactMessages") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table class="thumb" :loading="loading" :loading-text="$t('TABLES.loadingData')" :search="searchValue"
        :headers="tableHeaders" :items="tableRows" item-class="ltr" :items-per-page="paginations.items_per_page"
        hide-default-footer>
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.id"> {{ $t("TABLES.noData") }} </h6>
            <h6 v-else>{{ index + 1 }}</h6> <!-- Display the index for each row -->
          </div>
        </template>

        <!-- Start:: Phone -->
        <template v-slot:[`item.phone`]="{ item }">
          <span dir="ltr"> {{ item.phone }} </span>
        </template>
        <!-- Start:: Phone -->

        <template v-slot:[`item.message`]="{ item }">
          <template>
            <h6 class="text-danger" v-if="item.message.length === 0"> {{ $t("TABLES.noData") }} </h6>
            <div class="actions" v-else>
              <button class="btn_show" @click="showReplayModal(item.message)">
                <i class="fal fa-file-alt"></i>
              </button>
            </div>
          </template>
        </template>

        <!-- Start:: Message Reply -->
        <template v-slot:[`item.reply`]="{ item }">

          <template v-if="$can('contact_us_messages edit', 'contact_us_messages')">
            <h6 class="text-danger" v-if="!item.reply"> {{ $t("TABLES.noData") }} </h6>
            <div class="actions" v-else>
              <button class="btn_show" @click="showReplayModal(item.reply)">
                <i class="fal fa-file-alt"></i>
              </button>
            </div>
          </template>

          <template v-else>
            <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
          </template>
        </template>
        <!-- End:: Message Reply -->

        <!-- Start:: Message Type -->
        <template v-slot:[`item.type`]="{ item }">
          <h6 class="text-danger" v-if="!item.type"> {{ $t("TABLES.noData") }} </h6>
          <v-chip v-else color="blue-grey darken-3" text-color="white" small>
            {{ item.type }}
          </v-chip>
        </template>
        <!-- End:: Message Type -->

        <!-- Start:: Message Status -->
        <template v-slot:[`item.status`]="{ item }">
          <v-chip :color="item.status ? 'green' : 'red'" text-color="white" small>
            <template v-if="item.status">
              {{ $t("STATUS.replied") }}
            </template>
            <template v-else>
               {{ $t("STATUS.waiting") }}
            </template>
          </v-chip>
        </template>
        <!-- End:: Message Status -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <!-- v-if="permissions.reply" -->
            <template v-if="$can('contact_us_messages edit', 'contact_us_messages')">
              <span class="blue-grey--text text--darken-1" v-if="item.status">
                <i class="far fa-horizontal-rule"></i>
              </span>
              <a-tooltip placement="bottom" v-else>
                <template slot="title">
                  <span>{{ $t("BUTTONS.replay") }}</span>
                </template>
                <button class="btn_show" @click="selectItemToSendReplay(item)">
                  <i class="fal fa-reply"></i>
                </button>
              </a-tooltip>
            </template>

            <template v-else>
              <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Replay Modal -->
          <description-modal v-if="dialogReplay" :modalIsOpen="dialogReplay" :modalDesc="selectedReplayTextToShow"
            @toggleModal="dialogReplay = !dialogReplay" />
          <!-- End:: Replay Modal -->

          <!-- Start:: Replay Modal -->
          <v-dialog v-model="dialogSendReplay">
            <v-card>
              <v-card-title class="text-h5 justify-center">
                {{ $t("TITLES.sendReplay") }}
              </v-card-title>

              <form class="w-100">
                <base-input col="12" rows="3" type="textarea" :placeholder="$t('PLACEHOLDERS.messageReplay')"
                  v-model.trim="messageReplay" required />
              </form>

              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="sendReplay" :disabled="!(!!messageReplay)">
                  {{ $t("BUTTONS.replay") }}
                </v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogSendReplay = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Replay Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination class="py-0" square v-model="paginations.current_page" :length="paginations.last_page"
          :total-visible="6" @input="updateRouterQueryParam($event)" :prev-icon="getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
            " :next-icon="getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
    " />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AllContactMessages",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

    messageTypes() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.request"),
          value: "Request",
        },
        {
          id: 2,
          name: this.$t("STATUS.suggestion"),
          value: "Suggestion",
        },
        {
          id: 3,
          name: this.$t("STATUS.inquiry"),
          value: "Inquiry",
        },
        {
          id: 4,
          name: this.$t("STATUS.complaint"),
          value: "Complaint",
        },
        {
          id: 5,
          name: this.$t("STATUS.other"),
          value: "Other",
        },
        {
          id: 6,
          name: this.$t("STATUS.all"),
          value: null,
        },
      ];
    },

    messageStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.replied"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.waiting"),
          value: 0,
        }
      ];
    },
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        name: null,
        phone: null,
        email: null,
        date: null,
        messageType: null,
        status: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.ContactMessages.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.clientName"),
          value: "name",
          align: "center",
          width: "150",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.phone"),
          value: "mobile",
          align: "center",
          width: "140",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.email"),
          value: "email",
          align: "center",
          width: "150",
        },
        {
          text: this.$t("TABLES.ContactMessages.date"),
          value: "created_at",
          align: "center",
          width: "120",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.message"),
          value: "message",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.replay"),
          value: "reply",
          align: "center",
          width: "1l20",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.type"),
          value: "type",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.status"),
          value: "status",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.actions"),
          value: "actions",
          sortable: false,
          align: "center",
          width: "80",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogReplay: false,
      selectedReplayTextToShow: "",
      dialogSendReplay: false,
      itemToSendReplay: null,
      messageReplay: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/contact-messages/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.name = null;
      this.filterOptions.phone = null;
      this.filterOptions.email = null;
      // this.filterOptions.date = null;
      this.filterOptions.status = null;
      this.filterOptions.messageType = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/contact-messages/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "contact-us-messages",
          params: {
            page: this.paginations.current_page,
            name: this.filterOptions.name,
            phone: this.filterOptions.phone,
            email: this.filterOptions.email,
            // date: this.filterOptions.date,
            type: this.filterOptions.messageType?.value,
            status: this.filterOptions.status?.value,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Control Modals
    showReplayModal(replay) {
      this.dialogReplay = true;
      this.selectedReplayTextToShow = replay;
    },
    // End:: Control Modals

    // Start:: Handling Send Replay
    selectItemToSendReplay(item) {
      this.dialogSendReplay = true;
      this.itemToSendReplay = item;
    },
    async sendReplay() {
      this.dialogSendReplay = false;
      const REQUEST_DATA = {
        reply: this.messageReplay,
        "_method" : "PUT"
      };
      // REQUEST_DATA.append("_method", "PUT")
      try {
        await this.$axios({
          method: "POST",
          url: `contact-us-messages/${this.itemToSendReplay.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.sentSuccessfully"));

        this.setTableRows()
        let filteredElemet = this.tableRows.find(element => element.id === this.itemToSendReplay.id);
        filteredElemet.replied = !filteredElemet.replied;
        filteredElemet.reply = this.messageReplay;

        this.itemToSendReplay = null;
        this.messageReplay = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Handling Send Replay
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
