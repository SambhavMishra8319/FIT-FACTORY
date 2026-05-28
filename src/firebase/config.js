// =============================================
// FIREBASE CONFIGURATION
// Replace these values with your own Firebase project config.
// Steps:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project called "f2-fit-factory"
// 3. Add a Web App, copy the config values below
// 4. Enable Firestore Database (test mode to start)
// 5. Enable Authentication → Email/Password
// =============================================

// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsNaUTZzUHdWu_mreDQ13V-5U2UuVxCHw",
  authDomain: "f2-fit-factory.firebaseapp.com",
  projectId: "f2-fit-factory",
  storageBucket: "f2-fit-factory.firebasestorage.app",
  messagingSenderId: "624443620165",
  appId: "1:624443620165:web:7453b77674b24b4d555c2c",
  measurementId: "G-TR158WXG87"
};

const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
// export const auth = getAuth(app);
export default app;
