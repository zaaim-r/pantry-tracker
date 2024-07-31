// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3MLagILnTdvxzYyJEp4QJU0r2jUMVnt4",
  authDomain: "pantry-tracker-f1cdc.firebaseapp.com",
  projectId: "pantry-tracker-f1cdc",
  storageBucket: "pantry-tracker-f1cdc.appspot.com",
  messagingSenderId: "311958381713",
  appId: "1:311958381713:web:e36ccfc026dd536b26cb30",
  measurementId: "G-ZZ4MZ2F1N7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
