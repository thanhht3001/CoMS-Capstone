// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8ANgTas81fkGETFx-51dMA5egkEBmeJo",
  authDomain: "coms-64e4a.firebaseapp.com",
  projectId: "coms-64e4a",
  storageBucket: "coms-64e4a.appspot.com",
  messagingSenderId: "187329333510",
  appId: "1:187329333510:web:05eb2ce4030eddc8497687",
  measurementId: "G-F0C2NCKVEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const filesDb = getStorage(app);