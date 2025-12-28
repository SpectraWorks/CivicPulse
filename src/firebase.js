import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // <--- NEW IMPORT

const firebaseConfig = {
  apiKey: "AIzaSyAAMOavIcmNOsIHkJPftfBfi7RQK1T89bw",
  authDomain: "civic-pulse-a9b67.firebaseapp.com",
  projectId: "civic-pulse-a9b67",
  storageBucket: "civic-pulse-a9b67.firebasestorage.app",
  messagingSenderId: "1004873099534",
  appId: "1:1004873099534:web:3ede8b4291677891c34f5f",
  measurementId: "G-M6P7B4QEQJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // <--- EXPORT AUTH