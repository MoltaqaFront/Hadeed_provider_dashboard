import axios from "axios";
import router from "../../../router/index.js";

export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(context, payload) {
    context.commit("setAuthenticatedUserData", payload);
  },
  // End:: Set Authenticated User Data

  // Start:: Logout
  async logout() {
    try {
      await axios({
        method: "POST",
        url: `auth/logout`,
      });
      localStorage.removeItem("Provider_admin_dashboard_user_id");
      localStorage.removeItem("Provider_admin_dashboard_user_token");
      localStorage.removeItem("Provider_admin_dashboard_userName");
      localStorage.removeItem("Provider_admin_roles");
      router.replace("/");
      location.reload();
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
  // END:: Logout
};
