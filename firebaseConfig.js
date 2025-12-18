// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQNotf4mx9i3-RPecm4NJ9QSoFC6529MY",
  authDomain: "dashboard-c20b7.firebaseapp.com",
  projectId: "dashboard-c20b7",
  storageBucket: "dashboard-c20b7.firebasestorage.app",
  messagingSenderId: "752382526730",
  appId: "1:752382526730:web:a3df5080fbeafd709626f3",
  measurementId: "G-DJ2W542VCB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);