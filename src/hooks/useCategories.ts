import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import type { Category } from "@/types/category";
import { initializeCategories, getFallbackCategories } from "@/services/categoryService";

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheData {
    categories: Category[];
    timestamp: number;
}

function getCachedCategories(): Category[] | null {
    if (typeof window === "undefined") return null;

    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CacheData = JSON.parse(cached);
        const now = Date.now();

        if (now - data.timestamp < CACHE_TTL) {
            return data.categories;
        }

        sessionStorage.removeItem(CACHE_KEY);
        return null;
    } catch {
        return null;
    }
}

function setCachedCategories(categories: Category[]): void {
    if (typeof window === "undefined") return;

    try {
        const data: CacheData = {
            categories,
            timestamp: Date.now()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error caching categories:", error);
    }
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError(null);

                const cached = getCachedCategories();
                if (cached) {
                    setCategories(cached);
                    setLoading(false);
                    return;
                }

                const categoriesRef = collection(db, "categories");
                const q = query(categoriesRef, orderBy("order", "asc"));
                const snapshot = await getDocs(q);

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
            } catch (err) {
                console.error("Error loading categories:", err);
                setError("Failed to load categories");
                const fallback = getFallbackCategories();
                setCategories(fallback);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    const refreshCategories = async () => {
        try {
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
        } catch (err) {
            console.error("Error refreshing categories:", err);
            setError("Failed to refresh categories");
        } finally {
            setLoading(false);
        }
    };

    return { categories, loading, error, refreshCategories };
}

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
            } catch (err) {
                console.error("Error loading category:", err);
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
