<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.view_cart_data") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.clientName')"
            v-model.trim="data.name"
            disabled
          />
          <!-- End:: Name Input -->
          <!-- Start:: Product Name Input -->

          <!-- End:: Product Name Input -->
          <h3 v-if="tableRows.length > 0">{{ $t("products_list") }}</h3>

          <v-data-table
            v-if="tableRows.length > 0"
            class="thumb mb-6"
            :loading="loading"
            :loading-text="$t('TABLES.loadingData')"
            :search="searchValue"
            :headers="tableHeaders"
            :items="tableRows"
            item-class="ltr"
            hide-default-footer
          >
            <template v-slot:item.id="{ index }">
              <td>
                {{ index + 1 }}
              </td>
            </template>
            <template v-slot:[`item.item.measure`]="{ item, index }">
              <div class="table_image_wrapper">
                <h6 class="text-danger" v-if="!item.item.measure">
                  {{ $t("TABLES.noData") }}
                </h6>
                <p v-else>{{ item.item.measure }} {{ item.item.unit.name }}</p>
              </div>
            </template>
          </v-data-table>
          <h3 v-if="tableGoldenRows.length > 0">
            {{ $t("goldenOffers_list") }}
          </h3>

          <v-data-table
            v-if="tableGoldenRows.length > 0"
            class="thumb"
            :loading="loading"
            :loading-text="$t('TABLES.loadingData')"
            :search="searchValue"
            :headers="tableGoldenHeaders"
            :items="tableGoldenRows"
            item-class="ltr"
            hide-default-footer
          >
            <template v-slot:item.id="{ index }">
              <td>
                {{ index + 1 }}
              </td>
            </template>
            <template v-slot:[`item.item.measure`]="{ item, index }">
              <div class="table_image_wrapper">
                <h6 class="text-danger" v-if="!item.item.measure">
                  {{ $t("TABLES.noData") }}
                </h6>
                <p v-else>{{ item.item.measure }} {{ item.item.unit.name }}</p>
              </div>
            </template>
          </v-data-table>
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "showRegion",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data
      // End:: Loader Control Data
      // table header
      tableRows: [],
      tableGoldenRows: [],
      tableHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Products.name"),
          value: "item.name",
          sortable: false,
          align: "center",
        },
        // {
        //   text: this.$t("SIDENAV.Countries.name"),
        //   value: "country.name",
        //   sortable: false,
        //   align: "center",
        // },

        {
          text: this.$t("TABLES.Products.price"),
          value: "item.price",
          sortable: false,
          align: "center",
        },

        {
          text: this.$t("TABLES.Products.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
          width: "120",
        },

        {
          measure: "measure",
          text: this.$t("TABLES.measure"),
          value: `item.measure`,
          sortable: false,
          align: "center",
        },
      ],
      tableGoldenHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Products.OfferName"),
          value: "item.name",
          sortable: false,
          align: "center",
        },
        // {
        //   text: this.$t("SIDENAV.Countries.name"),
        //   value: "country.name",
        //   sortable: false,
        //   align: "center",
        // },

        {
          text: this.$t("TABLES.Products.price"),
          value: "item.price",
          sortable: false,
          align: "center",
        },

        {
          text: this.$t("TABLES.Products.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
          width: "120",
        },
      ],

      // Start:: Data Collection To Send
      data: {
        name: null,
        country_id: null,
        active: null,
        products: {
          productName: "",
          productPrice: null,
          productDate: "",
          productSize: null,
        },
      },
      // End:: Data Collection To Send
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

  computed: {},

  methods: {
    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `carts/${this.$route.params.id}`,
        });
        const { data } = res.data;
        this.data.name = data.cart.client.name;
        this.tableRows = data.cart.items.products;
        this.tableGoldenRows = data.cart.items.offers;
        console.log("first", this.data.name);
        console.log("this.tableRows", this.tableRows);
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
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
    // end show data
  },

  created() {
    // Start:: Fire Methods
    this.showData();
    // End:: Fire Methods
    console.log("this.tableRows", this.tableRows);
    console.log("first", this.data.name);
  },
};
</script>
