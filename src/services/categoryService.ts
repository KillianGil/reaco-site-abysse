import { db } from "@/firebase";
import { collection, getDocs, addDoc, query, where, Timestamp, updateDoc, doc } from "firebase/firestore";
import type { Category } from "@/types/category";
import { validateCategoryKey } from "@/types/category";

/**
 * Catégories par défaut créées lors de l'initialisation du système
 * Ces catégories ne peuvent pas être supprimées (isDefault: true)
 */
const DEFAULT_CATEGORIES = [
    { key: "evenement", label: "Événement", color: "cyan", order: 1 },
    { key: "decouverte", label: "Découverte", color: "emerald", order: 2 },
    { key: "musee", label: "Vie du musée", color: "amber", order: 3 },
];

/**
 * Initialise les catégories par défaut dans Firestore
 * Appelée automatiquement lors du premier chargement si aucune catégorie n'existe
 * @throws {Error} Si l'initialisation échoue
 */
export async function initializeCategories(): Promise<void> {
    try {
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);

        // Créer les catégories par défaut uniquement si la collection est vide
        if (snapshot.empty) {
            const promises = DEFAULT_CATEGORIES.map(cat =>
                addDoc(categoriesRef, {
                    key: cat.key,
                    label: cat.label,
                    color: cat.color,
                    order: cat.order,
                    isDefault: true,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                })
            );

            await Promise.all(promises);
        }
    } catch {
        // Erreur silencieuse - l'initialisation échoue mais le système fonctionne avec les fallback
    }
}

/**
 * Récupère une catégorie par sa clé unique
 * @param key - Clé unique de la catégorie (ex: "evenement")
 * @returns La catégorie trouvée ou null si inexistante
 */
export async function getCategoryByKey(key: string): Promise<Category | null> {
    try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("key", "==", key));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as Category;
    } catch {
        return null;
    }
}

/**
 * Valide qu'une clé de catégorie est unique dans la base de données
 * @param key - Clé à valider (format: lowercase, hyphens only)
 * @param excludeId - ID de catégorie à exclure de la recherche (pour l'édition)
 * @returns true si la clé est unique et valide, false sinon
 */
export async function validateCategoryKeyUnique(key: string, excludeId?: string): Promise<boolean> {
    // Valider le format de la clé (lowercase, hyphens uniquement)
    if (!validateCategoryKey(key)) {
        return false;
    }

    try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("key", "==", key));
        const snapshot = await getDocs(q);

        // Aucune catégorie avec cette clé = clé disponible
        if (snapshot.empty) {
            return true;
        }

        // En mode édition, vérifier que la seule correspondance est la catégorie elle-même
        if (excludeId) {
            const otherDocs = snapshot.docs.filter(doc => doc.id !== excludeId);
            return otherDocs.length === 0;
        }

        // Clé déjà utilisée par une autre catégorie
        return false;
    } catch {
        return false;
    }
}

/**
 * Compte le nombre d'articles associés à une catégorie
 * Utilisé avant la suppression pour afficher le nombre d'articles concernés
 * @param categoryKey - Clé de la catégorie
 * @returns Nombre d'articles dans cette catégorie
 */
export async function countArticlesInCategory(categoryKey: string): Promise<number> {
    try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("categorie", "==", categoryKey));
        const snapshot = await getDocs(q);

        return snapshot.size;
    } catch {
        return 0;
    }
}

/**
 * Réassigne tous les articles d'une catégorie vers une autre
 * Utilisé lors de la suppression d'une catégorie pour éviter les articles orphelins
 * @param oldKey - Clé de l'ancienne catégorie
 * @param newKey - Clé de la nouvelle catégorie
 * @param newLabel - Label de la nouvelle catégorie
 * @throws {Error} Si la réassignation échoue
 */
export async function reassignArticles(oldKey: string, newKey: string, newLabel: string): Promise<void> {
    try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("categorie", "==", oldKey));
        const snapshot = await getDocs(q);

        // Mettre à jour tous les articles en parallèle
        const promises = snapshot.docs.map(docSnap =>
            updateDoc(doc(db, "articles", docSnap.id), {
                categorie: newKey,
                label_categorie: newLabel
            })
        );

        await Promise.all(promises);
    } catch {
        throw new Error("Échec de la réassignation des articles");
    }
}

/**
 * Retourne les catégories par défaut en tant que fallback
 * Utilisé si Firestore est indisponible pour maintenir le fonctionnement du site
 * @returns Tableau de catégories par défaut avec IDs temporaires
 */
export function getFallbackCategories() {
    return DEFAULT_CATEGORIES.map((cat, index) => ({
        id: `fallback-${index}`,
        key: cat.key,
        label: cat.label,
        color: cat.color,
        order: cat.order,
        isDefault: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    }));
}
