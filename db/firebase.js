// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkPo92OhjyxDGZCrWZApxpF9dNxvB3heM",
  authDomain: "pdigs-a51ee.firebaseapp.com",
  projectId: "pdigs-a51ee",
  storageBucket: "pdigs-a51ee.firebasestorage.app",
  messagingSenderId: "1089961209391",
  appId: "1:1089961209391:web:b914a538a3dfdf966ce0da",
  measurementId: "G-GR6SFP936J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);