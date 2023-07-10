// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz-mGuIUsrCHh5VV34C95-KVFTJ0ewito",
  authDomain: "twitter-app-d270c.firebaseapp.com",
  projectId: "twitter-app-d270c",
  storageBucket: "twitter-app-d270c.appspot.com",
  messagingSenderId: "548948760855",
  appId: "1:548948760855:web:3b449b373c755703b5bf52",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
