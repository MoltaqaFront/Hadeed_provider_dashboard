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

              <base-select-input col="6" :optionsList="allproviders" :placeholder="$t('TABLES.FinancialReports.name')"
                v-model="filterOptions.provider_name" />

              <base-input col="6" type="text" :placeholder="$t('TABLES.FinancialReports.providerPhone')"
                v-model="filterOptions.driverPhone" />

              <!-- Start:: Start Date Input -->
              <base-picker-input col="6" type="date" :placeholder="$t('PLACEHOLDERS.startDate')"
                v-model.trim="filterOptions.from_date" />
              <!-- End:: Start Date Input -->

              <!-- Start:: End Date Input -->
              <base-picker-input col="6" type="date" :placeholder="$t('PLACEHOLDERS.endDate')"
                v-model.trim="filterOptions.to_date" />
              <!-- End:: End Date Input -->

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
          <h5>{{ $t("PLACEHOLDERS.order_notfinsh_report") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>

        <div class="title_route_wrapper">


          <button class="btn_delete" @click="selectPdfItem()">
            {{ $t("PLACEHOLDERS.export_pdf") }}
          </button>

          <button class="btn_delete" @click="selectExcelItem()">
            {{ $t("PLACEHOLDERS.export_excel") }}
          </button>


          <!-- <base-button class="mt-0 pdf_btn" styleType="solid_btn" :btnText="$t('BUTTONS.downloadPdf')"
            @fireClick="downloadPdf" :disabled="pdfDownloadBtnIsLoading">
            <template v-slot:btn_icon>
              <i class="fal fa-file-pdf"></i>
            </template>
          </base-button> -->

          <!-- <base-button
            class="mt-0 excel_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadExcel')"
          >
            <template v-slot:btn_icon>
              <i class="fal fa-file-excel"></i>
            </template>
          </base-button> -->
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
            <p v-else>{{ (paginations.current_page - 1) * paginations.items_per_page + index + 1 }}</p>
          </div>
        </template>

        <template v-slot:[`item.total_orders`]="{ item }">
           <router-link :to="`/orders/all?page=1&provider=${item.id}&type=not_finished`">
            {{ item.total_orders }}
          </router-link>
        </template>

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: pdf Modal -->
          <v-dialog v-model="dialogPdf">
            <v-card>
              <button class="ex-btn-s" @click="clickedDownload"> {{ $t("PLACEHOLDERS.export_pdf") }}</button>

              <v-card-actions>
                <v-btn class="modal_cancel_btn" @click="dialogPdf = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: pdf Modal -->

          <!-- Start:: excel Modal -->
          <v-dialog v-model="dialogExcel">
            <v-card>
              <a class="ex-btn-s" :href="excel" download>
                {{ $t("PLACEHOLDERS.export_excel") }}
              </a>
              <v-card-actions>
                <v-btn class="modal_cancel_btn" @click="dialogExcel = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: excel Modal -->


        </template>
        <!-- ======================== End:: Dialogs ======================== -->

      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
      <!-- ==== Start:: Client Addresses ==== -->
      <div class="table_content">
        <div class="table_title_wrapper">
          <div class="title_text_wrapper">
            <h5>{{ $t("PLACEHOLDERS.Overall_statistics") }}</h5>
          </div>
        </div>
        <v-simple-table class="stat-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">
                  {{ $t("TABLES.FinancialReports.totalProductsInProcessing") }}
                </th>
                <th class="text-center">
                  {{ $t("TABLES.FinancialReports.profit_provider") }}
                </th>
                <th class="text-center">
                  {{ $t("TABLES.FinancialReports.totalapp") }}
                </th>
                <th class="text-center">
                  {{ $t("TABLES.FinancialReports.total_salaey") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template>
                <tr class="text-center all-stat">
                  <td>{{ statistic.total_orders }}</td>
                  <td>{{ statistic.provider_earning }}</td>
                  <td>{{ statistic.system_earning }}</td>
                  <td>{{ statistic.total_vat }}</td>
                </tr>
              </template>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <!-- ==== End:: Client Addresses ==== -->
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
  </div>
</template>

<script>
// import VueHtml2pdf from 'vue-html2pdf';
import { mapGetters } from "vuex";

export default {
  name: "AllFinancialReports",

  components: {
    // VueHtml2pdf
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  data() {
    return {
      statistic: {
        total_orders: null,
        provider_earning: null,
        system_earning: null,
        total_vat: null,
      },

      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      pdfDownloadBtnIsLoading: false,
      excelDownloadBtnIsLoading: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        provider_name: null,
        driverPhone: null,
        from_date: null,
        to_date: null
      },
      allproviders: [],
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.FinancialReports.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.FinancialReports.name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.providerPhone"),
          value: "mobile",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.totalProductsInProcessing"),
          value: "total_orders",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.profit_provider"),
          value: "provider_earning",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.totalapp"),
          value: "system_earning",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.total_salaey"),
          value: "total_vat",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data
      // Start:: Dialogs Control Data
      dialogImage: false,
      selectedItemImage: null,
      dialogDescription: false,
      selectedDescriptionTextToShow: "",
      dialogPdf: false,
      itemToPdf: null,
      dialogExcel: false,
      itemToExcel: null,
      // End:: Dialogs Control Data

      // Start:: Page Permissions
      permissions: null,
      // Start:: Page Permissions
      pdf: null,
      excel: null,
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
        await this.$router.push({ path: '/financial-not-finshed-reports/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.provider_name = null;
      this.filterOptions.driverPhone = null;
      this.filterOptions.from_date = null;
      this.filterOptions.to_date = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/financial-not-finshed-reports/all', query: { page: 1 } });
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
          url: "financials?type=finished",
          params: {
            page: this.paginations.current_page,
            type: "not_finished",
            provider: this.filterOptions.provider_name?.id,
            mobile: this.filterOptions.driverPhone,
            from_date: this.filterOptions.from_date,
            to_date: this.filterOptions.to_date,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.loading = false;
        this.tableRows = res.data.data.Financials;
        this.statistic = res.data.data.totals;
        this.paginations.last_page = res.data.pagination.lastPageNumber;
        this.paginations.items_per_page = res.data.pagination.pageCount;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Handling Download Files
    async downloadPdf() {
      await this.$refs.html2Pdf.generatePdf();
      this.pdfDownloadBtnIsLoading = false;
    },
    // End:: Handling Download Files

    // ==================== Start:: Crud ====================
    // ===== Start:: Show
    showItem(item) {
      this.$router.push({ path: `/financial-not-finshed-reports/show/${item.id}` });
    },
    // ===== End:: Show

    async getAllStores() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "providers",
        });
        this.allproviders = res.data.data;
        console.log(res.data.body.stores)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },

    // ===== Start:: Delete
    selectPdfItem() {
      this.dialogPdf = true;
      this.confirmPdf();
    },
    async confirmPdf() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `financials/export-pdf?type=finished`,
        });
        this.pdf = res.data.data.pdf;
        // this.dialogPdf = false;
      } catch (error) {
        this.dialogPdf = false;
        this.$message.error(error.response.data.message);
      }
    },
    selectExcelItem() {
      this.dialogExcel = true;
      this.confirmExcel();
    },
    async confirmExcel() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `financials/export-excel?type=finished`,
        });
        this.excel = res.data.data.excel;
        // this.dialogPdf = false;
      } catch (error) {
        this.dialogExcel = false;
        this.$message.error(error.response.data.message);
      }
    },
    clickedDownload() {
      const link = document.createElement('a');
      link.href = this.pdf;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    // ===== End:: Delete
    // ==================== End:: Crud ====================
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
    this.getAllStores()
    // End:: Fire Methods
  },
};
</script>

<style scoped>
.ex-btn-s {
  color: black !important;
  font-size: 20px;
  font-weight: bold;
  text-decoration: underline !important;
}

.all-stat {
  background: var(--main_theme_clr);
}

.all-stat td {
  color: white;
  font-size: 21px !important;
  font-weight: 800;
}

.show_all_content_wrapper .v-data-table .v-data-table__wrapper table tbody tr:hover {
  background: var(--main_theme_clr) !important;
}
</style>