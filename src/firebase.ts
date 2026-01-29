import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

/**
 * Configuration Firebase du client
 * Les clés proviennent des variables d'environnement pour la sécurité
 * Les clés NEXT_PUBLIC_* sont accessibles côté client (normal pour Firebase)
 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Analytics - Activé uniquement côté navigateur et si supporté
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

// Exports des services Firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

