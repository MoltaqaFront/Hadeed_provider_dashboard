// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyA1Qhu0dnmDepSs_-nUKSpGBIX42H00DKI",
  authDomain: "akry-2653b.firebaseapp.com",
  projectId: "akry-2653b",
  storageBucket: "akry-2653b.appspot.com",
  messagingSenderId: "35605685091",
  appId: "1:35605685091:web:ca117d8fa3feff6fef2956",
  measurementId: "G-YM05RMWG2B",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log("Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(payload);
    });
  });
});
// =================================== new ==========================
