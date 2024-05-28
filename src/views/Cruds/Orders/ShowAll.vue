<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div
        class="filter_content_wrapper"
        :class="{ active: filterFormIsActive }"
      >
        <button
          class="filter_toggler"
          @click="filterFormIsActive = !filterFormIsActive"
        >
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>
        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start:: Order Number Input -->
              <base-input
                col="6"
                type="number"
                :placeholder="$t('PLACEHOLDERS.orderNumber')"
                v-model="filterOptions.orderNumber"
              />
              <!-- End:: Order Number Input -->

              <!-- Start:: Status Input -->
              <base-select-input
                col="6"
                :optionsList="activeStatuses"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status"
              />
              <!-- End:: Status Input -->
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button
                class="reset_btn"
                type="button"
                :disabled="isWaitingRequest"
                @click="resetFilter"
              >
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
          <h5>{{ $t("TITLES.orders") }}</h5>

          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table
        class="thumb"
        :loading="loading"
        :loading-text="$t('TABLES.loadingData')"
        :search="searchValue"
        :headers="tableHeaders"
        :items="tableRows"
        item-class="ltr"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
      >
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <template v-slot:[`item.serialNumber`]="{ item }">
          <p
            class="blue-grey--text text--darken-1 fs-3"
            v-if="!item.serialNumber"
          >
            -
          </p>
          <p v-else>{{ item.serialNumber }}</p>
        </template>

        <template v-slot:[`item.delivered_date`]="{ item }">
          <span
            class="blue-grey--text text--darken-1"
            v-if="!item.delivered_date"
          >
            <i class="far fa-horizontal-rule"></i>
          </span>
          <v-chip v-else color="blue-grey darken-3" text-color="white" small>
            {{ item.delivered_date }}
          </v-chip>
        </template>

        <template v-slot:[`item.delivered_time`]="{ item }">
          <span
            class="blue-grey--text text--darken-1"
            v-if="!item.delivered_time"
          >
            <i class="far fa-horizontal-rule"></i>
          </span>
          <v-chip v-else color="blue-grey darken-3" text-color="white" small>
            {{ item.delivered_time }}
          </v-chip>
        </template>

        <!-- End:: Driver -->

        <!-- Start:: Order Status -->
        <template v-slot:[`item.status`]="{ item }">
          <v-chip color="secondary" text-color="white" small>
            {{ item.status }}
          </v-chip>
        </template>
        <!-- Start:: Order Status -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>

              <button class="btn_edit" @click="selectUpdateItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.download_invoice") }}</span>
              </template>
              <!-- @click="DownloadInvoice(item)" -->
              <button class="btn_show" @click="downloadPdf(item)">
                <i class="fal fa-download"></i>
              </button>
            </a-tooltip>

            <a-tooltip
              placement="bottom"
              v-if="
                item.status !== 'finished' &&
                item.status !== 'canceled' &&
                item.status !== 'rejected'
              "
            >
              <template slot="title">
                <span>{{ $t("PLACEHOLDERS.chat_display") }}</span>
              </template>
              <button class="btn_show" @click="showChat(item.chat_id)">
                <i class="fab fa-rocketchat"></i>
              </button>
            </a-tooltip>

            <a-tooltip
              placement="bottom"
              v-if="$can('order_items show', 'order_items')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <template v-else>
              <i
                class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"
              ></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Update Modal -->
          <v-dialog v-model="dialogUpdate">
            <v-card>
              <v-card-title
                class="text-h5 justify-center w-100"
                v-if="itemToUpdate"
              >
                {{ $t("MESSAGES.changeItem", { name: itemToUpdate.id }) }}

                <div class="filter_form_wrapper w-100">
                  <form class="w-100">
                    <base-select-input
                      col="12"
                      :optionsList="orderTypes"
                      :placeholder="$t('PLACEHOLDERS.status')"
                      v-model="status_modal"
                    />

                    <div
                      class="form-group"
                      v-if="status_modal && status_modal.value === 'rejected'"
                    >
                      <base-input
                        col="12"
                        rows="3"
                        type="textarea"
                        :placeholder="$t('PLACEHOLDERS.reason')"
                        v-model="reason"
                        required
                      />
                    </div>
                    <div
                      class="form-group"
                      v-if="status_modal && status_modal.value === 'accepted'"
                    >
                      <base-input
                        col="12"
                        rows="3"
                        type="date"
                        :placeholder="$t('TABLES.Orders.delivered_date')"
                        v-model="date_time"
                        required
                      />
                      <input type="file" @change="handleFileUpload" />
                    </div>
                  </form>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmChangeStatus">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogUpdate = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Update Modal -->
        </template>
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination
          class="py-0"
          square
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="6"
          @input="updateRouterQueryParam($event)"
          :prev-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
          "
          :next-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
          "
        />
      </div>
    </template>
    <!-- End:: Pagination -->

    <!-- Start:: Generate PDF Template Content -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      filename="report"
      :pdf-quality="2"
      pdf-format="a4"
      :manual-pagination="false"
      :paginate-elements-by-height="1400"
      pdf-content-width="100%"
      @progress="bdfDownloadBtnIsLoading = true"
      @hasGenerated="$message.success($t('MESSAGES.generatedSuccessfully'))"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="pdf_file_content">
          <!-- <tr v-for="(value, key) in itemReport" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr> -->

          <table class="table table-striped">
            <tbody>
              <tr class="text-center">
                <td>{{ $t("TABLES.Roles.serialNumber") }}</td>
                <td>{{ serialNumber }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.invoice_issue_date") }}</td>
                <td>{{ invoice_issue_date }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.productName") }}</td>
                <td>{{ provider_name }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.main_category") }}</td>
                <td>{{ main_category }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.sub_category") }}</td>
                <td>{{ sub_category }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.price") }}</td>
                <td>{{ price }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.weight") }}</td>
                <td>{{ weight }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.measure") }}</td>
                <td>{{ measure_pro }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.num_count") }}</td>
                <td>{{ count }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.adress_name") }}</td>
                <td>{{ adress_name }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("TABLES.Cities.name") }}</td>
                <td>{{ country_name }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("TABLES.Areas.name") }}</td>
                <td>{{ area_name }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("TABLES.Districts.name") }}</td>
                <td>{{ distrits_name }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("PLACEHOLDERS.notes") }}</td>
                <td>{{ notes }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Products.Total") }}</td>
                <td>{{ product_total }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Products.tax") }}</td>
                <td>{{ product_tax }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Products.order_total") }}</td>
                <td>{{ order_total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </vue-html2pdf>
    <!-- End:: Generate PDF Template Content -->
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "AllOrders",

  components: {
    VueHtml2pdf,
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

    Types() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.individual"),
          value: "individual",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.company"),
          value: "company",
        },
      ];
    },

    orderTypes() {
      return [
        {
          id: 1,
          name: this.$t("ORDERS.accepted"),
          value: "accepted",
        },
        {
          id: 2,
          name: this.$t("ORDERS.rejected"),
          value: "rejected",
        },
        {
          id: 3,
          name: this.$t("ORDERS.on_the_way"),
          value: "on_the_way",
        },
        {
          id: 4,
          name: this.$t("ORDERS.delivered"),
          value: "delivered",
        },
      ];
    },

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("ORDERS.accepted"),
          value: "accepted",
        },
        {
          id: 2,
          name: this.$t("ORDERS.approved"),
          value: "approved",
        },
        {
          id: 3,
          name: this.$t("ORDERS.paid"),
          value: "paid",
        },
        {
          id: 4,
          name: this.$t("ORDERS.on_the_way"),
          value: "on_the_way",
        },
        {
          id: 7,
          name: this.$t("ORDERS.delivered"),
          value: "delivered",
        },
        {
          id: 8,
          name: this.$t("ORDERS.finsished"),
          value: "finsished",
        },
        {
          id: 9,
          name: this.$t("ORDERS.canceled"),
          value: "canceled",
        },
        {
          id: 10,
          name: this.$t("ORDERS.rejected"),
          value: "rejected",
        },
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
        orderNumber: null,
        clientName: null,
        clientPhone: null,
        status: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Roles.serialNumber"),
          value: "serialNumber",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.orderNumber"),
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Orders.delivered_date"),
          value: "delivered_date",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("TABLES.Orders.delivered_time"),
          value: "delivered_time",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Orders.totalPrice"),
          value: "provider_total",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.Orders.orderStatus"),
          value: "status",
          align: "center",
          sortable: false,
          width: "120",
        },
        {
          text: this.$t("TABLES.Orders.orderDate"),
          value: "created_at",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.Orders.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogUpdate: false,
      itemToUpdate: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      // Start:: Page Permissions
      permissions: null,
      // Start:: Page Permissions

      allStatus: [],
      providers: [],

      status_modal: null,
      reason: "",
      file: null,
      date_time: null,
      serialNumber: null,
      invoice_issue_date: null,
      provider_name: null,
      main_category: null,
      sub_category: null,
      price: null,
      weight: null,
      measure_pro: null,
      count: null,
      distrits_name: null,
      area_name: null,
      country_name: null,
      adress_name: null,
      notes: null,
      delivered_date: null,
      delivered_time: null,
      product_total: null,
      product_tax: null,
      order_total: null,
      canacel: null,
      reject: null,
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
      this.setTableRows();
    },

    async resetFilter() {
      this.filterOptions.orderNumber = null;
      this.filterOptions.clientName = null;
      this.filterOptions.clientPhone = null;
      this.filterOptions.status = null;

      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/orders/all", query: { page: 1 } });
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
          url: "orders",

          params: {
            page: this.paginations.current_page,

            orderNumber: this.filterOptions.orderNumber,
            userName: this.filterOptions.clientName,
            userMobile: this.filterOptions.clientPhone,
            orderStatus: this.filterOptions.status?.key,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        res.data.data.forEach((item, index) => {
          item.serialNumber =
            (this.paginations.current_page - 1) *
              this.paginations.items_per_page +
            index +
            1;
        });
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // ==================== Start:: Crud ====================
    // ===== Start:: Show
    showItem(item) {
      this.$router.push({ path: `/orders/show/${item.id}` });
    },
    // ===== End:: Show

    // Start:: Handling Download Files
    async downloadPdf(item) {
      // console.log(item);
      if (item) {
        this.serialNumber = item.id;
        this.invoice_issue_date = item.created_at;
        this.provider_name = item.item.name;
        this.main_category = item.item.category.name;
        this.sub_category = item.item.sub_category.name;
        this.price = item.item.offer.price;
        this.weight = item.item.weight.name;
        this.measure_pro = item.item.unit.name;
        this.count = item.quantity;
        this.adress_name = item.address.name;
        this.country_name = item.address.city.name;
        this.area_name = item.address.region.name;
        this.distrits_name = item.address.district.name;
        this.notes = item.notes;
        this.delivered_date = item.delivered_date;
        this.delivered_time = item.delivered_time;
        this.product_total = item.provider_price;
        this.product_tax = item.delivery_cost;
        this.order_total = item.provider_total;

        await this.$refs.html2Pdf.generatePdf();
        this.pdfDownloadBtnIsLoading = false;
      } else {
        console.error("Item is undefined or null.");
      }
    },

    // End:: Handling Download Files
    // ==================== End:: Crud ====================

    // ===== Start:: Update
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    selectUpdateItem(item) {
      this.dialogUpdate = true;
      this.itemToUpdate = item;
      // console.log(item);
    },

    async confirmChangeStatus() {
      try {
        const requestData = new FormData();

        const formattedDate = moment(this.date_time.trim()).format(
          "YYYY/MM/DD HH:mm:ss"
        );

        requestData.append("delivery_date", formattedDate);
        requestData.append("status", this.status_modal.value);
        requestData.append("invoice", this.file);

        if (this.reason) {
          requestData.append("rejection_reason", this.reason);
        }

        // const requestData = {
        //   status: this.status_modal.value
        // };

        // if (this.reason.trim() !== '') {
        //   requestData.rejection_reason = this.reason.trim();
        // };
        // if (this.date_time) {
        //
        // };
        // if (this.file) {
        //   requestData.invoice = this.file.trim();
        // };

        await this.$axios({
          method: "POST",
          url: `orders/change-order-status/${this.itemToUpdate.id}`,
          data: requestData,
        });

        this.dialogUpdate = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changedSuccessfully"));
        this.status_modal = null;
      } catch (error) {
        this.dialogUpdate = false;
        this.status_modal = null;
        this.$message.error(error.response.data.message);
      }
    },

    showChat(item) {
      this.$router.push({ path: `/chat/show/${item}` });
    },
    // ===== End:: Delete
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
    // this.getAllStatus();
    // End:: Fire Methods
  },
};
</script>

<style lang="scss">
.table-striped {
  margin-top: 50px;

  tbody {
    tr {
      &:nth-child(odd) {
        background-color: #eee !important;
      }
    }
  }
}

.qr_content {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  margin: auto;
  text-align: center;
}

td {
  vertical-align: middle;
}

.qr_code {
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100px !important;
    height: 100px !important;
    display: block;
  }
}
</style>
