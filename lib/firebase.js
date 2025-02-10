import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB_j6ASVCpTBEK6WP2QkR5VnDvjhdlhYGU",
    authDomain: "eventhosting-52a6c.firebaseapp.com",
    databaseURL: "https://eventhosting-52a6c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "eventhosting-52a6c",
    storageBucket: "eventhosting-52a6c.firebasestorage.app",
    messagingSenderId: "587828700577",
    appId: "1:587828700577:web:87c3dd8934760d77b557e0",
    measurementId: "G-TMV62BT69R"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, push, set };
