// Firebase Configuration
// TODO: استبدل هذه القيم بقيم Firebase الخاصة بك
const firebaseConfig = {
    apiKey: "AIzaSyCgcZXWWd7H7IZwEZalhkw5-Q6DNL2RpJs",
    authDomain: "web-app-6e8cc.firebaseapp.com",
    projectId: "web-app-6e8cc",
    storageBucket: "web-app-6e8cc.firebasestorage.app",
    messagingSenderId: "169092029070",
    appId: "1:169092029070:web:d60e872913e8689b1747df",
    measurementId: "G-55DHW1ECD2"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;

