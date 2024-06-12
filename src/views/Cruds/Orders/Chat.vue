<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_chat") }}</h4>
    </div>
    <!-- End:: Title -->
    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- @submit.prevent="validateFormInputs" -->
      <form>
        <div class="row">
          <div class="chat" id="chat">
            <div
              v-for="message in messages"
              :key="message.id"
              class="all_messages"
              :class="{
                'my-message': message.from_type == 'provider',
              }"
            >
              <div class="sender">
                <div class="message" v-if="message.message !== ''">
                  <p>{{ message.message_text }}</p>
                </div>

                <img
                  v-if="message.type == 'image'"
                  :src="message.image"
                  alt=""
                />

                <div class="message" v-else-if="message.type == 'video'">
                  <video
                    width="100%"
                    height="240"
                    controls
                    v-if="message.video"
                  >
                    <source :src="message.video" type="video/mp4" />
                    <source :src="message.video" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <audio
                  width="100%"
                  controls
                  v-else-if="message.type == 'voice'"
                >
                  <source :src="message.voice" type="audio/ogg" />
                  <source :src="message.voice" type="audio/mp3" />
                  <source :src="message.voice" type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>

                <a :href="message.file" v-else-if="message.type == 'file'">
                  <i class="fas fa-file-invoice"></i>
                </a>
              </div>
            </div>
            <v-row class="align-center">
              <v-col lg="10">
                <v-text-field
                  class="col-12"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.writeHere')"
                  v-model.trim="newMessage"
                  @keypress.enter="submitForm"
                />
              </v-col>
              <v-col lg="2">
                <div class="message_tools">
                  <div class="row align-items-center">
                    <div class="tools col-2">
                      <!-- <div class="form-group">
                    <input
                      id="upload"
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                    />
                    <label for="upload"><i class="fas fa-images"></i></label>
                  </div> -->
                      <button @click="submitForm" type="button">
                        <i class="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import Pusher from "pusher-js";

export default {
  data() {
    return {
      hadeed_dashboard_user_role: localStorage.getItem(
        "Hadeed_dashboard_user_role"
      ),
      akry_dashboard_user_id: localStorage.getItem(
        "hadeed_dashboard_user_role"
      ),

      get_data: {
        image: {
          path: "",
          file: "",
        },
        name_requester: "",
        receiver_id: "",
        receiver_type: "",
        orderId: "",
        isSenderMe: "",
      },

      messages: [],
      newMessage: "",
      pusher: null,
      privateChannel: null,

      selectedFile: null,

      // record voice

      audioStream: null,
      mediaRecorder: null,
      audioChunks: [],
      recording: false,
      audioBlob: null,
    };
  },

  mounted() {
    Echo.channel(`chat.${this.$route.params.id}`).listen(
      ".new_chat",
      (data) => {
        console.log("ell", data);
        this.messages.push(data.message);
      }
    );
  },

  async created() {
    await this.GetDataToShow();

    // this.pusher = new Pusher("556f5cee277b4c7c22d7", {
    //   cluster: "eu",
    //   encrypted: true,
    //   authEndpoint: `/broadcasting/auth`,
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem(
    //         "Hadeed_dashboard_user_token"
    //       )}`, // Use getItem() to retrieve the value
    //     },
    //   },
    //   debug: true,
    // });

    // this.pusher.connection.bind("connected", () => {
    //   console.log("Connected to Pusher");
    // });

    // console.log(this.get_data.orderId);
    // this.privateChannel = this.pusher.subscribe(
    //   `private-my-channel.${this.get_data.orderId}`
    // );

    // this.privateChannel.bind("pusher:subscription_succeeded", () => {
    //   console.log("Subscription to private channel succeeded.");
    // });

    // this.privateChannel.bind("pusher:subscription_error", (status) => {
    //   console.error("Subscription error:", status);
    // });

    // this.privateChannel.bind("my-event", (data) => {
    //   this.messages.push(data.message);
    //   console.log(data);
    //   console.log("Channel subscribed successfully!");
    // });

    this.scrollToBottom();
  },

  methods: {
    handlePrevent(e) {
      console.log("first");
      e.preventDefault();
    },
    // Start:: Submit Form
    async submitForm(e) {
      if (e) e.preventDefault(); // Prevent default form submission behavior
      const REQUEST_DATA = new FormData();

      // Start:: Append Request Data
      // REQUEST_DATA.append("receivable_id", this.get_data.receiver_id);
      // REQUEST_DATA.append("receivable_type", this.get_data.receiver_type);
      // REQUEST_DATA.append("order_id", this.get_data.orderId);
      // REQUEST_DATA.append("isSenderMe", true);

      // const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
      // REQUEST_DATA.append("voice", audioBlob, "recorded_audio.wav");

      if (this.newMessage) {
        REQUEST_DATA.append("message", this.newMessage);
      } else {
        REQUEST_DATA.append("message", "");
      }

      // if (this.selectedFile) {
      //   const fileType = this.selectedFile.type;
      //   const fileName = this.selectedFile.name;

      //   if (fileType.includes("image")) {
      //     console.log(this.selectedFile);

      //     REQUEST_DATA.append("type", "image");
      //     REQUEST_DATA.append("image", this.selectedFile);
      //   } else if (fileType.includes("video")) {
      //     REQUEST_DATA.append("type", "video");
      //     REQUEST_DATA.append("video", this.selectedFile);
      //   } else if (
      //     fileType.includes("audio") ||
      //     fileName.endsWith(".mp3") ||
      //     fileName.endsWith(".wav") ||
      //     fileName.endsWith(".ogg")
      //   ) {
      //     // Handle audio file
      //     console.log(this.selectedFile);
      //     REQUEST_DATA.append("type", "voice");
      //     REQUEST_DATA.append("voice", this.selectedFile);
      //   } else if (fileName.endsWith(".pdf") || fileName.endsWith(".docx")) {
      //     REQUEST_DATA.append("type", "file");
      //     REQUEST_DATA.append("file", this.selectedFile);
      //   }
      // }

      try {
        await this.$axios({
          method: "POST",
          url: `chats/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });

        // this.privateChannel.trigger("client-new-message", REQUEST_DATA);

        console.log(REQUEST_DATA.get("isSenderMe"));

        // this.messages.push({
        //   type: REQUEST_DATA.get("type"),
        //   message: REQUEST_DATA.get("message"),
        //   video: REQUEST_DATA.get("video"),
        //   image: REQUEST_DATA.get("image"),
        //   file: REQUEST_DATA.get("file"),
        //   isSenderMe: true, // Set isSenderMe to true
        //   // Add other properties as needed
        // });
        this.newMessage = "";

        // this.selectedFile = "";
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
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
          method: "GET",
          url: `chats/${this.$route.params.id}`,
        });

        // this.get_data.image.path = res.data.data.receiver.image;
        // this.get_data.receiver_id = res.data.data.receiver.id;
        // this.get_data.receiver_type = res.data.data.receiver.role;
        // this.get_data.name_requester = res.data.data.receiver.name;
        // this.get_data.orderId = res.data.data.orderId;
        this.messages = res.data?.data?.messages;
        console.log("first", res.data.data.messages);

        console.log(res.data.data.orderId);
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
      // Get a reference to the chat container
      const chatContainer = document.getElementById("chat");

      // Scroll to the bottom by setting scrollTop to the container's scrollHeight
      chatContainer.scrollTop = chatContainer.scrollHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat {
  max-height: 500px;
  // overflow-y: scroll;
  // overflow-x: hidden;

  .all_messages {
    display: flex;
    justify-content: flex-end;

    &.my-message {
      display: flex;
      justify-content: flex-start;
    }

    .sender {
    }
  }

  .sender,
  .receiver {
    background: #acc29a;
    color: #fff;
    padding: 20px;
    min-width: 10%;
    width: auto;
    border-radius: 20px;
    margin-bottom: 30px;

    p {
      font-size: 17px;
      font-weight: 400;
      color: #fff;
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
      display: none;
    }
  }
}

@media (max-width: 575px) {
  .chat {
    .sender,
    .receiver {
      width: 100%;

      audio {
        width: 100%;
      }

      img {
        width: 170px;
        height: auto;
        max-width: 200px;
      }
    }
  }

  .tools {
    gap: 5px;
  }
}
</style>
