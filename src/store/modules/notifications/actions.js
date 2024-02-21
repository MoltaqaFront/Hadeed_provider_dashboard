import i18n from "@/plugins/i18n.js";
import axios from "axios";
import Antd from "ant-design-vue";

export default {
  // START:: GET NOTIFICATIONS
  getNotifications(context) {
    // START:: SEND GET REQUEST
    axios({
      method: "GET",
      url: `notification/index`,
    })
      .then((res) => {
        context.commit("setNotifications", {
          notifications: res.data.data.notifications,
          unreadNotificationsCount: res.data.data.filter(
            (item) => item.is_read == 0
          ).length,
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    // END:: SEND GET REQUEST
  },
  // END:: GET NOTIFICATIONS

  // START:: READ SINGLE NOTIFICATION
  readSingleNotification(context, payload) {
    // START:: SEND GET REQUEST
    axios({
      method: "GET",
      url: `notifications/${payload}`,
    })
      .then(() => {
        context.dispatch("getNotifications");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    // END:: SEND GET REQUEST
  },
  // END:: READ SINGLE NOTIFICATION

  // START:: READ ALL NOTIFICATIONS
  readAllNotifications(context) {
    // START:: SEND GET REQUEST
    axios({
      method: "GET",
      url: `notification/index`,
    })
      .then((res) => {
        context.commit("setAllReadiedNotifications", {
          notifications: res.data.data.notifications,
          unreadNotificationsCount: res.data.data.filter(
            (item) => item.is_read == 0
          ).length,
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    // END:: SEND GET REQUEST
  },
  // END:: READ ALL NOTIFICATIONS

  // START:: DELETE NOTIFICATION
  deleteNotification(context, payload) {
    // START:: SEND GET REQUEST
    axios({
      method: "DELETE",
      url: `notifications/${payload.id}`,
    }).then(() => {
      if (payload.notificationType == "readied_notification") {
        context.dispatch("readAllNotifications");
      } else {
        context.dispatch("getNotifications");
      }
      Antd.message.success(i18n.t("MESSAGES.deletedSuccessfully"));
    });
    // END:: SEND GET REQUEST
  },
  // END:: DELETE NOTIFICATION

  // START:: DELETE ALL NOTIFICATION
  deleteAllNotifications(context) {
    // START:: SEND GET REQUEST
    axios({
      method: "DELETE",
      url: `delete/all/notifications`,
    }).then(() => {
      context.dispatch("getNotifications");
      Antd.message.success(i18n.t("MESSAGES.deletedSuccessfully"));
    });
    // END:: SEND GET REQUEST
  },
  // END:: DELETE ALL NOTIFICATION
};
