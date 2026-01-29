import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import type { Category } from "@/types/category";
import { initializeCategories, getFallbackCategories } from "@/services/categoryService";

// Configuration du cache sessionStorage
const CACHE_KEY = "categories_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheData {
    categories: Category[];
    timestamp: number;
}

/**
 * Récupère les catégories depuis le cache sessionStorage
 * @returns Catégories en cache ou null si expirées/inexistantes
 */
function getCachedCategories(): Category[] | null {
    if (typeof window === "undefined") return null;

    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CacheData = JSON.parse(cached);
        const now = Date.now();

        // Vérifier si le cache est encore valide (< 5 minutes)
        if (now - data.timestamp < CACHE_TTL) {
            return data.categories;
        }

        // Cache expiré, le supprimer
        sessionStorage.removeItem(CACHE_KEY);
        return null;
    } catch {
        return null;
    }
}

/**
 * Met en cache les catégories dans sessionStorage avec timestamp
 * @param categories - Catégories à mettre en cache
 */
function setCachedCategories(categories: Category[]): void {
    if (typeof window === "undefined") return;

    try {
        const data: CacheData = {
            categories,
            timestamp: Date.now()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // Erreur silencieuse - le cache n'est qu'une optimisation
    }
}

/**
 * Hook pour récupérer toutes les catégories depuis Firestore
 * Inclut un système de cache sessionStorage (5 min) et fallback si Firestore est indisponible
 * Initialise automatiquement les catégories par défaut si la collection est vide
 * @returns {Object} categories, loading, error, refreshCategories
 */
export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError(null);

                // Tenter de charger depuis le cache d'abord
                const cached = getCachedCategories();
                if (cached) {
                    setCategories(cached);
                    setLoading(false);
                    return;
                }

                // Charger depuis Firestore
                const categoriesRef = collection(db, "categories");
                const q = query(categoriesRef, orderBy("order", "asc"));
                const snapshot = await getDocs(q);

                // Si aucune catégorie n'existe, initialiser les catégories par défaut
                if (snapshot.empty) {
                    await initializeCategories();
                    const newSnapshot = await getDocs(q);
                    const fetchedCategories: Category[] = [];

                    newSnapshot.forEach((doc) => {
                        fetchedCategories.push({
                            id: doc.id,
                            ...doc.data()
                        } as Category);
                    });

                    setCategories(fetchedCategories);
                    setCachedCategories(fetchedCategories);
                } else {
                    const fetchedCategories: Category[] = [];

                    snapshot.forEach((doc) => {
                        fetchedCategories.push({
                            id: doc.id,
                            ...doc.data()
                        } as Category);
                    });

                    setCategories(fetchedCategories);
                    setCachedCategories(fetchedCategories);
                }
            } catch {
                setError("Failed to load categories");
                // Fallback vers les catégories par défaut si Firestore échoue
                const fallback = getFallbackCategories();
                setCategories(fallback);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    /**
     * Rafraîchit les catégories depuis Firestore
     * Invalide le cache et recharge les données
     */
    const refreshCategories = async () => {
        try {
            // Invalider le cache
            sessionStorage.removeItem(CACHE_KEY);
            setLoading(true);

            const categoriesRef = collection(db, "categories");
            const q = query(categoriesRef, orderBy("order", "asc"));
            const snapshot = await getDocs(q);

            const fetchedCategories: Category[] = [];
            snapshot.forEach((doc) => {
                fetchedCategories.push({
                    id: doc.id,
                    ...doc.data()
                } as Category);
            });

            setCategories(fetchedCategories);
            setCachedCategories(fetchedCategories);
        } catch {
            setError("Failed to refresh categories");
        } finally {
            setLoading(false);
        }
    };

    return { categories, loading, error, refreshCategories };
}

/**
 * Hook pour récupérer une catégorie spécifique par son ID
 * @param categoryId - ID de la catégorie à récupérer
 * @returns {Object} category, loading, error
 */
export function useCategory(categoryId: string) {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategory() {
            try {
                setLoading(true);
                setError(null);

                const categoryRef = doc(db, "categories", categoryId);
                const snapshot = await getDoc(categoryRef);

                if (snapshot.exists()) {
                    setCategory({
                        id: snapshot.id,
                        ...snapshot.data()
                    } as Category);
                } else {
                    setError("Category not found");
                }
            } catch {
                setError("Failed to load category");
            } finally {
                setLoading(false);
            }
        }

        if (categoryId) {
            loadCategory();
        }
    }, [categoryId]);

    return { category, loading, error };
}
