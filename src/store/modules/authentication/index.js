import AuthenticationActions from "./actions.js";
import AuthenticationGetters from "./getters.js";
import AuthenticationMutations from "./mutations.js";

export default {
  namespaced: true,

  state: {
    // START:: AUTHENTICATED USER DATA
    userId: localStorage.getItem("Provider_admin_dashboard_user_id"),
    userToken: localStorage.getItem("Provider_admin_dashboard_user_token"),
    userType: localStorage.getItem("Provider_admin_dashboard_user_type"),
    userName: localStorage.getItem("Provider_admin_dashboard_userName"),
    email: localStorage.getItem("Provider_admin_dashboard_email"),
    userAvatar: localStorage.getItem("Provider_admin_dashboard_user_avatar"),
    ability: localStorage.getItem("Provider_admin_dashboard_user_ability"),
    // END:: AUTHENTICATED USER DATA
  },

  mutations: AuthenticationMutations,
  actions: AuthenticationActions,
  getters: AuthenticationGetters,
};
