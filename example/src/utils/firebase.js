// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "your firebase api key",
  authDomain: "ext-annotation.firebaseapp.com",
  projectId: "ext-annotation",
  storageBucket: "ext-annotation.appspot.com",
  messagingSenderId: "209730743934",
  appId: "1:209730743934:web:80c655c299e630c3c3722f",
  measurementId: "G-GB45VV9CEP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
