<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.chat_display") }}</h4>
    </div>
    <!-- End:: Title -->

    <div class="single_step_form_content_wrapper">

      <form @submit.prevent="submitForm">
        <div class="row">

          <div class="chat" id="chat">
            <div v-for="message in messages" :key="message.id" class="all_messages" :class="{
              'my-message': message.from_id == qarbcom_provider_dashboard_user_id
            }">

              <div class="sender">

                <div class="message" v-if="message.message !== ''">
                  <p> {{ message.message_text }}</p>
                </div>

              </div>

            </div>

            <div class="message_tools">
              <div class="row align-items-center">
                <base-input class="col-11" type="text" :placeholder="$t('PLACEHOLDERS.writeHere')"
                  v-model.trim="newMessage" @keyup.enter="submitForm" />

                <div class="tools col-1" ref="bottomEl">

                  <button @click="submitForm()" type="button">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      qarbcom_provider_dashboard_user_id: localStorage.getItem('qarbcom_provider_dashboard_user_id'),

      data: {
        image: {
          path: '',
          file: ''
        },
        name_requester: '',
        receiver_id: '',
        receiver_type: '',
        provider_id: '',
        orderId: '',
        isSenderMe: ''
      },

      messages: [],
      newMessage: '',
      pusher: null,
      privateChannel: null,


    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      getAuthenticatedUserData: "AuthenticationModule/getAuthenticatedUserData",
    }),
    // End:: Vuex Getters
  },


  mounted() {

    // if private and dot before listen is required .new_chat
    // Echo.private(`chat.${this.getAuthenticatedUserData.id}`)
    //   .listen('.new_chat', (data) => {
    //     console.log("ell", data);
    //     this.messages.push(data.message);
    //   });
    Echo.channel(`chat.${this.$route.params.id}`)
      .listen('.new_chat', (data) => {
        console.log("ell", data);
        this.messages.push(data.message);
      });
  },

  async created() {

    this.GetDataToShow();


    this.$axios({
      method: "POST",
      url: `chat/chats/${this.$route.params.id}/update-in-chat`,
      data: {
        "in_chat": 1
      }
    });

  },

  beforeDestroy() {
    this.$axios({
      method: "POST",
      url: `chat/chats/${this.$route.params.id}/update-in-chat`,
      data: {
        "in_chat": 0
      }
    });
  },


  methods: {




    // Start:: Submit Form
    async submitForm() {

      const REQUEST_DATA = new FormData();

      // Start:: Append Request Data
      REQUEST_DATA.append("to_type", "user");
      REQUEST_DATA.append("to_id", this.data.receiver_id);
      // REQUEST_DATA.append("isSenderMe", true);

      if (this.newMessage) {
        REQUEST_DATA.append("message", this.newMessage);
      } else {
        REQUEST_DATA.append("message", "");
      }

      try {
        await this.$axios({
          method: "POST",
          url: `chat/chats/${this.$route.params.id}/send-message`,
          data: REQUEST_DATA,
        });


        // this.messages.push({
        //   from_id: this.getAuthenticatedUserData.id,
        //   from_type: "provider",
        //   id: this.$route.params.id,
        //   message_text: this.newMessage,
        //   readed_at: new Date(),
        //   to_id: this.data.receiver_id,
        //   to_type: "client"
        // })

        this.newMessage = '';
        // this.selectedFile = '';
        this.isWaitingRequest = false;

      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    // get data to edit

    async GetDataToShow() {
      try {
        let res = await this.$axios({
          method: "POST",
          url: `chat/chats/show-chat`,
          params: {
            chat_id: `${this.$route.params.id}`
          }
        });

        this.messages = res.data.data.messages;
        this.data.receiver_id = res.data.data.user_id;
        this.data.provider_id = res.data.data.provider_id;

        // console.log(res.data.data.messages);
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },

    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];

      this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
    },

    scrollToBottom() {
      this.$refs.bottomEl?.scrollIntoView({ behavior: 'smooth' });
    },


  },
};
</script>
  
<style lang="scss" scoped>
.chat {
  max-height: 500px;


  .all_messages {
    display: flex;
    justify-content: flex-end;

    &.my-message {
      display: flex;
      justify-content: flex-start;

      .sender {
        // background: #fff8cc;
        // color: #000;

        // p {
        //   color: #000;
        // }
      }
    }

    .sender {}
  }

  .sender,
  .receiver {
    background: #017ccb;
    color: #FFF;
    padding: 20px;
    min-width: 10%;
    width: auto;
    border-radius: 20px;
    margin-bottom: 30px;

    p {
      font-size: 17px;
      font-weight: 400;
      color: #FFF;
    }

    img {
      width: 300px;
      height: 200px;
      object-fit: contain;
      margin: 10px 0 0;
    }

    video {
      margin: 10px 0 0;
    }

    audio {
      margin: 10px 0 0;
    }

    a {
      i {
        font-size: 40px;
        color: bisque;
        margin-top: 15px;
        cursor: pointer;
      }
    }


  }


}




.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  font-size: 30px;

  .form-group {
    input {
      display: none
    }
  }

}

@media(max-width:575px) {

  .chat {

    .sender,
    .receiver {

      width: 100%;

      audio {
        width: 100%
      }

      img {
        width: 170px;
        height: auto;
        max-width: 200px;
      }
    }
  }

  .tools {
    gap: 5px
  }
}
</style>