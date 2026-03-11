// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "pdigs-a51ee.firebaseapp.com",
  projectId: "pdigs-a51ee",
  storageBucket: "pdigs-a51ee.firebasestorage.app",
  messagingSenderId: "1089961209391",
  appId: "1:1089961209391:web:b914a538a3dfdf966ce0da",
  measurementId: "G-GR6SFP936J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);