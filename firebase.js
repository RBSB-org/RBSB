// EVENTWALE - Firebase Configuration
import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDp9W5T_wx6e8gbMbC0qw6u_zNpaGGRtoE",
    authDomain: "eventwale-9c70f.firebaseapp.com",
    projectId: "eventwale-9c70f",
    storageBucket: "eventwale-9c70f.firebasestorage.app",
    messagingSenderId: "429719297904",
    appId: "1:429719297904:web:66570ca02d3b8f7594b9b5",
    measurementId: "G-W9GGFWGY9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const db = getDatabase(
    app,
    "https://eventwale-9c70f-default-rtdb.asia-southeast1.firebasedatabase.app"
);

// Google sign-in provider
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

console.log("EVENTWALE Firebase initialized successfully!");