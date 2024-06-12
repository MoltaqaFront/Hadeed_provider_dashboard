import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// Start:: Importing Main Sass Styles File
import "./assets/sass/main.scss";
// End:: Importing Main Sass Styles File

// Start:: Importing Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
// End:: Importing Bootstrap

// Start:: Importing Plugins
import i18n from "./plugins/i18n";
import axios from "./plugins/axios";
import vuetify from "./plugins/vuetify";
import Antd from "./plugins/antDesign";
import "./plugins/googleMaps";
import "./plugins/formComponents";
import "./plugins/globalComponents";
import "./plugins/3rdPartyLibraries";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import firebase from "firebase/app";
import "firebase/firebase-messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCvzX2OCaR7YMhl7fFmWDCfVbTIdBdC5GE",
  authDomain: "alhdeed-8458e.firebaseapp.com",
  projectId: "alhdeed-8458e",
  storageBucket: "alhdeed-8458e.appspot.com",
  messagingSenderId: "897485221553",
  appId: "1:897485221553:web:63df4ada76e8201afa3c90",
};

firebase.initializeApp(firebaseConfig);
// End:: Importing Plugins

// casl vue permissions

import ability from "./plugins/ability";
import { abilitiesPlugin } from "@casl/vue";
Vue.use(abilitiesPlugin, ability);

// casl vue permissions
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "5d41076e446d34f710e2",
  cluster: "eu",
  forceTLS: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  // authEndpoint: "https://backend.alhdeed.com/dashboard-api/v1/auth/login", // Update with the correct auth endpoint
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "qarbcom_provider_dashboard_user_token"
      )}`, // Use getItem() to retrieve the value
    },
  },
});
// Start:: Set App Lang  & Theme
store.dispatch("AppLangModule/handelAppDefaultLanguage");
store.dispatch("AppThemeModule/handelAppDefaultTheme");
// End:: Set App Lang  & Theme

Vue.use(Antd);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
