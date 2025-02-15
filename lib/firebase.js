import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_j6ASVCpTBEK6WP2QkR5VnDvjhdlhYGU",
  authDomain: "eventhosting-52a6c.firebaseapp.com",
  databaseURL:
    "https://eventhosting-52a6c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eventhosting-52a6c",
  storageBucket: "eventhosting-52a6c.appspot.com",
  messagingSenderId: "587828700577",
  appId: "1:587828700577:web:87c3dd8934760d77b557e0",
  measurementId: "G-TMV62BT69R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const database = getDatabase(app); // Firebase Realtime Database

// Export modules in a single statement
export {
  app,
  auth,
  database,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  get,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  update,
};
