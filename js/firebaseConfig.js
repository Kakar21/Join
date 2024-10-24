// Firebase-Konfiguration (Ersetze die Werte mit deinen eigenen aus Firebase)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"; // Firestore importieren


window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;

const firebaseConfig = {
    apiKey: "AIzaSyD1q8wlUfP9ZMgnRSY4fWJiA-YiucI04BQ",
    authDomain: "join-kakar.firebaseapp.com",
    projectId: "join-kakar",
    storageBucket: "join-kakar.appspot.com",
    messagingSenderId: "213024614055",
    appId: "1:213024614055:web:576f91369b5042b74add82"
  };

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore initialisieren

window.db = db;