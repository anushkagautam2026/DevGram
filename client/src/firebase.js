// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "devgram-73c4d.firebaseapp.com",
  projectId: "devgram-73c4d",
  storageBucket: "devgram-73c4d.firebasestorage.app",
  messagingSenderId: "819193715409",
  appId: "1:819193715409:web:461cd48ff705f42e0083f0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
