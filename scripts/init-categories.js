// Script d'initialisation des catégories par défaut
// Exécuter une seule fois avec : node scripts/init-categories.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const DEFAULT_CATEGORIES = [
    { key: "evenement", label: "Événement", color: "cyan", order: 1 },
    { key: "decouverte", label: "Découverte", color: "emerald", order: 2 },
    { key: "musee", label: "Vie du musée", color: "amber", order: 3 },
];

async function initCategories() {
    console.log("🚀 Initialisation des catégories...");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        // Vérifier si des catégories existent déjà
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);

        if (!snapshot.empty) {
            console.log("✅ Des catégories existent déjà :", snapshot.size);
            return;
        }

        console.log("📝 Création des catégories par défaut...");

        // Créer les catégories par défaut
        for (const cat of DEFAULT_CATEGORIES) {
            await addDoc(categoriesRef, {
                key: cat.key,
                label: cat.label,
                color: cat.color,
                order: cat.order,
                isDefault: true,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            console.log(`  ✅ Créé: ${cat.label} (${cat.key})`);
        }

        console.log("🎉 Initialisation terminée avec succès !");
    } catch (error) {
        console.error("❌ Erreur:", error.message);
        console.log("\n⚠️ SOLUTION : Modifiez temporairement les règles Firebase pour autoriser l'écriture:");
        console.log(`
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true;  // ⚠️ TEMPORAIRE
    }
        `);
    }
}

initCategories();
