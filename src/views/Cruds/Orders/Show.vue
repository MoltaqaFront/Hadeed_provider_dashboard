<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4> {{ $t('PLACEHOLDERS.order_data') }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <base-input col="6" type="text" :placeholder="$t('TABLES.Orders.orderNumber')" v-model.trim="data.id"
            disabled />
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.status')" v-model.trim="data.status" disabled />

          <base-input col="6" type="text" :placeholder="$t('TABLES.Products.created_at')" v-model.trim="data.orderDate"
            disabled />

          <div class="row">
              <div class="form_title_wrapper">
                <h4>{{ $t('SIDENAV.Products.title') }}</h4>
              </div>

            <!-- Start:: Name Input -->
            <base-input col="6" type="text" disabled             
              :placeholder="$t('PLACEHOLDERS.productName')"
              v-model.trim="data.provider_name" />
            <!-- End:: Name Input -->

            <!-- Start:: Name Input -->
            <base-input col="6" type="text" 
                :placeholder="$t('PLACEHOLDERS.main_category')"
              v-model.trim="data.main_category" disabled />
            <!-- End:: Name Input -->

            <!-- Start:: Name Input -->
              <base-input col="6" type="text" 
              :placeholder="$t('PLACEHOLDERS.sub_category')"
                v-model.trim="data.sub_category" disabled />
              <!-- End:: Name Input -->

               <base-input
              col="6"
              type="number"
              :placeholder="$t('PLACEHOLDERS.price')"
              v-model.trim="data.price"
              disabled
            />

            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.weight')"
              v-model.trim="data.weight"
              disabled
            />

            <base-input
              col="6"
              type="text"
              :placeholder="$t('PLACEHOLDERS.measure')"
              v-model.trim="data.measure_pro"
              disabled
            />

             <base-input
                col="6"
                type="number"
                :placeholder="$t('PLACEHOLDERS.num_count')"
                v-model.trim="data.count"
                disabled
              />
          </div>

          <div class="row">
            <div class="form_title_wrapper">
              <h4>{{ $t('PLACEHOLDERS.departure_to') }}</h4>
            </div>
            
              <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.adress_name')" v-model.trim="data.adress_name"
                disabled />
            <base-input col="6" type="text" :placeholder="$t('TABLES.Cities.name')" v-model.trim="data.country_name"
              disabled />
            <base-input col="6" type="text" :placeholder="$t('TABLES.Areas.name')"
              v-model.trim="data.area_name" disabled />
            <base-input col="6" type="text" :placeholder="$t('TABLES.Districts.name')" v-model.trim="data.distrits_name"
              disabled />


            <div class="form_title_wrapper">
              <h4>{{ $t('PLACEHOLDERS.location_icon') }}</h4>
              <div class="map_icon">
                <i class="fas fa-map"></i>
              </div>
            </div>
          </div>

          <div class="row">
          
            <base-input disabled col="6" type="text" :placeholder="$t('PLACEHOLDERS.notes')"
                  v-model.trim="data.notes" />
             
             <base-input
                disabled
                v-if="data.delivered_date !== null && data.delivered_date !== 'null'"
                col="6"
                type="text"
                :placeholder="$t('TABLES.Orders.delivered_date')"
                v-model.trim="data.delivered_date"
              />
              <base-input
                disabled
                v-else
                col="6"
                type="text"
                :placeholder="$t('TABLES.Orders.delivered_date')"
                :value="data.delivered_date ? data.delivered_date : 'No data'"
              />

           <base-input
              disabled
              v-if="data.delivered_time !== null && data.delivered_time !== 'null'"
              col="6"
              type="text"
              :placeholder="$t('TABLES.Orders.delivered_time')"
              v-model.trim="data.delivered_time"
            />
            <base-input
              disabled
              v-else
              col="6"
              type="text"
              :placeholder="$t('TABLES.Orders.delivered_time')"
              :value="data.delivered_time ? data.delivered_time : 'No data'"
            />
            <base-input disabled col="6" type="text" :placeholder="$t('SIDENAV.Products.Total')"
                  v-model.trim="data.product_total" />
            
          <base-input disabled col="6" type="text" :placeholder="$t('SIDENAV.Products.tax')"
                    v-model.trim="data.product_tax" /> 
          <base-input disabled col="6" type="text" :placeholder="$t('SIDENAV.Products.order_total')"
            v-model.trim="data.order_total" />

         <base-input
            disabled
            v-if="data.canacel !== null && data.canacel !== 'null'"
            col="6"
            type="text"
            :placeholder="$t('SIDENAV.Products.canacel')"
            v-model.trim="data.canacel"
          />
          <base-input
            disabled
            v-else
            col="6"
            type="text"
            :placeholder="$t('SIDENAV.Products.canacel')"
            :value="data.canacel ? data.canacel : 'No data'"
          />

           <base-input
              disabled
              v-if="data.reject !== null && data.reject !== 'null'"
              col="6"
              type="text"
              :placeholder="$t('SIDENAV.Products.reject')"
              v-model.trim="data.reject"
            />
            <base-input
              disabled
              v-else
              col="6"
              type="text"
              :placeholder="$t('SIDENAV.Products.reject')"
              :value="data.reject ? data.reject : 'No data'"
            />
        </div>
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import RatingPreview from "@/components/ui/RatingPreview.vue";
export default {
  name: "CreateProduct",

  components: {
    RatingPreview,
  },

  data() {
    return {

      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send

      data: {

       
        rates: [],
        status_reason: '',
        commission: '',
        total_price_after_commission: '',

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
        reject: null

      },



    };
  },

  methods: {

    async getDataToEdit() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `orders/${this.$route.params.id}`,
        });
        // order info

        this.data.id = res.data.data.Order.id;

        this.data.status = res.data.data.Order.status;
        this.data.status_key = res.data.data.Order.status_key;
        this.data.orderDate = res.data.data.Order.created_at;

        this.data.provider_name = res.data.data.Order.item.name;
        this.data.main_category = res.data.data.Order.item.category.name;
        this.data.sub_category = res.data.data.Order.item.sub_category.name;
        this.data.price = res.data.data.Order.item.offer.price;
        this.data.weight = res.data.data.Order.item.weight.name;
        this.data.measure_pro = res.data.data.Order.item.unit.name;
        this.data.count = res.data.data.Order.quantity;
        this.data.adress_name = res.data.data.Order.address.name;
        this.data.country_name = res.data.data.Order.address.city.name;
        this.data.area_name = res.data.data.Order.address.region.name;
        this.data.distrits_name = res.data.data.Order.address.district.name;
        this.data.notes = res.data.data.Order.notes;
        this.data.delivered_date = res.data.data.Order.delivered_date;
        this.data.delivered_time = res.data.data.Order.delivered_time;
        this.data.product_total = res.data.data.Order.provider_price;
        this.data.product_tax = res.data.data.Order.delivery_cost;
        this.data.order_total = res.data.data.Order.provider_total;
        this.data.canacel = res.data.data.Order.invoice;
        this.data.reject = res.data.data.Order.invoice;


      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },

  },

  async created() {
    this.getDataToEdit()
  },
};
</script>

<style lang="scss" scoped>
.add_parent {
  text-align: center;

  i {
    font-size: 25px;
    cursor: pointer;

    color: #4CAF50
  }
}

.remove_minus {
  text-align: center;

  i {
    font-size: 25px;
    color: red;
    cursor: pointer;
  }
}

.remove_minus_parent {
  i {
    font-size: 25px;
    color: red;
    cursor: pointer;
  }
}

.map_icon {
  i {
    font-size: 30px;
  }
}
</style>