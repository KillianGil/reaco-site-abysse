import * as admin from 'firebase-admin';

/**
 * Initialise Firebase Admin SDK de manière lazy (à la demande)
 * Utilisé uniquement côté serveur (API routes) avec privilèges élevés
 * L'initialisation lazy évite les erreurs lors du build Next.js
 * @returns Instance Firebase Admin
 * @throws {Error} Si les credentials sont invalides
 */
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
        } catch (error) {
            throw error;
        }
    }
    return admin;
}

/**
 * Récupère l'instance Firestore côté serveur avec privilèges admin
 * Initialise Firebase Admin si nécessaire
 * @returns Instance Firestore Admin
 */
export function getAdminDb() {
    initializeFirebaseAdmin();
    return admin.firestore();
}

/**
 * Récupère l'instance Auth côté serveur avec privilèges admin
 * Initialise Firebase Admin si nécessaire
 * @returns Instance Auth Admin
 */
export function getAdminAuth() {
    initializeFirebaseAdmin();
    return admin.auth();
}
