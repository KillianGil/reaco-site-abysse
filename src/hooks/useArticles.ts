import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc } from "firebase/firestore";

/**
 * Interface représentant un article dans Firestore
 * Structure de données côté base de données (snake_case)
 */
export interface Article {
    id: string;
    categorie: string;
    label_categorie: string;
    date_texte: string;
    titre: string;
    resume: string;
    contenu: string;
    image_url: string;
    mis_en_avant?: boolean;
    date_evenement?: string;
    heure_evenement?: string;
    date: Timestamp;
}

/**
 * Interface représentant un article pour les composants React
 * Structure de données côté frontend (camelCase)
 * Permet de maintenir la compatibilité avec les anciens composants
 */
export interface NewsItem {
    id: string;
    category: string;
    categoryLabel: string;
    date: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    featured?: boolean;
    eventDate?: string;
    eventTime?: string;
}

/**
 * Transforme un article Firestore (snake_case) en NewsItem pour les composants (camelCase)
 * @param article - Article brut depuis Firestore
 * @returns NewsItem formaté pour les composants
 */
function transformArticle(article: Article): NewsItem {
    return {
        id: article.id,
        category: article.categorie,
        categoryLabel: article.label_categorie,
        date: article.date_texte,
        title: article.titre,
        excerpt: article.resume,
        content: article.contenu,
        image: article.image_url,
        featured: article.mis_en_avant || false,
        eventDate: article.date_evenement,
        eventTime: article.heure_evenement,
    };
}

/**
 * Hook pour récupérer tous les articles depuis Firestore
 * Les articles sont triés par date décroissante (plus récents en premier)
 * @returns {Object} articles, loading, error
 */
export function useArticles() {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticles() {
            try {
                setLoading(true);
                setError(null);

                const articlesRef = collection(db, "articles");
                const q = query(articlesRef, orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);

                const fetchedArticles: NewsItem[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Omit<Article, "id">;
                    fetchedArticles.push(transformArticle({ id: doc.id, ...data }));
                });

                setArticles(fetchedArticles);
            } catch {
                setError("Impossible de charger les articles");
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    return { articles, loading, error };
}

/**
 * Hook pour récupérer un article spécifique par son ID
 * @param id - ID de l'article à récupérer
 * @returns {Object} article, loading, error
 */
export function useArticle(id: string) {
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticle() {
            if (!id) {
                setError("ID d'article manquant");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const articleRef = doc(db, "articles", id);
                const articleSnap = await getDoc(articleRef);

                if (articleSnap.exists()) {
                    const data = articleSnap.data() as Omit<Article, "id">;
                    setArticle(transformArticle({ id: articleSnap.id, ...data }));
                } else {
                    setError("Article non trouvé");
                }
            } catch {
                setError("Impossible de charger l'article");
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [id]);

    return { article, loading, error };
}
