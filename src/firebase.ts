import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJEyxmgO5PIfbpYnSC2mHfdyoK8kHGjNo",
  authDomain: "abysse-63713.firebaseapp.com",
  projectId: "abysse-63713",
  storageBucket: "abysse-63713.firebasestorage.app",
  messagingSenderId: "290499762604",
  appId: "1:290499762604:web:5b9426750e7eca5058c209",
  measurementId: "G-MM77BT9W4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics only in browser
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export const db = getFirestore(app);
export default app;
