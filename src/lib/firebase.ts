// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPYLM-jEKyKZVDb9eifRLLloLn56k-A10",
  authDomain: "fancybyaifie-43f12.firebaseapp.com",
  projectId: "fancybyaifie-43f12",
  storageBucket: "fancybyaifie-43f12.firebasestorage.app",
  messagingSenderId: "820140493079",
  appId: "1:820140493079:web:e80296ab75bb41d3048f52",
  measurementId: "G-1CXQ7PLT2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);