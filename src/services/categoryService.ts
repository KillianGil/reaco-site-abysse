import { db } from "@/firebase";
import { collection, getDocs, addDoc, query, where, orderBy, Timestamp, updateDoc, doc } from "firebase/firestore";
import type { Category, CategoryFormData } from "@/types/category";
import { validateCategoryKey } from "@/types/category";

const DEFAULT_CATEGORIES = [
    { key: "evenement", label: "Événement", color: "cyan", order: 1 },
    { key: "decouverte", label: "Découverte", color: "emerald", order: 2 },
    { key: "musee", label: "Vie du musée", color: "amber", order: 3 },
];

export async function initializeCategories(): Promise<void> {
    try {
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);

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
            console.log("Categories initialized successfully");
        }
    } catch (error) {
        console.error("Error initializing categories:", error);
        throw error;
    }
}

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
    } catch (error) {
        console.error("Error getting category by key:", error);
        return null;
    }
}

export async function validateCategoryKeyUnique(key: string, excludeId?: string): Promise<boolean> {
    if (!validateCategoryKey(key)) {
        return false;
    }

    try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("key", "==", key));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return true;
        }

        if (excludeId && snapshot.docs[0].id === excludeId) {
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error validating category key:", error);
        return false;
    }
}

export async function countArticlesInCategory(categoryKey: string): Promise<number> {
    try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("categorie", "==", categoryKey));
        const snapshot = await getDocs(q);

        return snapshot.size;
    } catch (error) {
        console.error("Error counting articles in category:", error);
        return 0;
    }
}

export async function reassignArticles(oldKey: string, newKey: string, newLabel: string): Promise<void> {
    try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("categorie", "==", oldKey));
        const snapshot = await getDocs(q);

        const promises = snapshot.docs.map(docSnap =>
            updateDoc(doc(db, "articles", docSnap.id), {
                categorie: newKey,
                label_categorie: newLabel
            })
        );

        await Promise.all(promises);
        console.log(`Reassigned ${snapshot.size} articles from ${oldKey} to ${newKey}`);
    } catch (error) {
        console.error("Error reassigning articles:", error);
        throw error;
    }
}

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
