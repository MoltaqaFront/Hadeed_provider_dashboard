//firebase.js
import Vue from "vue";
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

export default firebase.messaging();
