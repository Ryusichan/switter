import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDRALtod6i8w4l1gG0q70alf_Q9HNzwuYE",
    authDomain: "switter-e5357.firebaseapp.com",
    projectId: "switter-e5357",
    storageBucket: "switter-e5357.appspot.com",
    messagingSenderId: "1039618690948",
    appId: "1:1039618690948:web:c7d834a7d28c7a66b8d7d1"
  };

  firebase.initializeApp(firebaseConfig);

  export const firebaseInstance = firebase;

  export const authService = firebase.auth();
  export const dbService = firebase.firestore();
  export const storageService = firebase.storage();