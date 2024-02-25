import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyB--uO0e1JL5GjkTvSedn3xq-AtI11liw0",
    libraries: "places",
  },
});
