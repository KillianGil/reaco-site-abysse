import * as admin from 'firebase-admin';

// Fonction d'initialisation lazy
function initializeFirebaseAdmin() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
            console.log('✅ Firebase Admin initialisé');
        } catch (error) {
            console.error('❌ Erreur initialisation Firebase Admin:', error);
            throw error;
        }
    }
    return admin;
}

// Getters qui initialisent à la demande
export function getAdminDb() {
    initializeFirebaseAdmin();
    return admin.firestore();
}

export function getAdminAuth() {
    initializeFirebaseAdmin();
    return admin.auth();
}
