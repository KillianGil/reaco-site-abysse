"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminProvider, useAdmin, AdminLogin, AdminLayout } from "@/components/admin/AdminComponents";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Loader2, Trash2, ExternalLink, Search, Filter, Plus, Pencil } from "lucide-react";

interface Article {
    id: string;
    titre: string;
    resume: string;
    date_texte: string;
    categorie: string;
    label_categorie: string;
    image_url: string;
    mis_en_avant: boolean;
}

const categoryLabels: Record<string, string> = {
    evenement: "Événement",
    decouverte: "Découverte",
    musee: "Vie du musée"
};

const categoryColors: Record<string, string> = {
    evenement: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30",
    decouverte: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    musee: "bg-amber-500/20 text-amber-400 border-amber-500/30"
};

function ArticlesListContent() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    useEffect(() => {
        loadArticles();
    }, []);

    async function loadArticles() {
        setLoading(true);
        try {
            const articlesRef = collection(db, "articles");
            const q = query(articlesRef, orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const loaded: Article[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                loaded.push({
                    id: docSnap.id,
                    titre: data.titre,
                    resume: data.resume,
                    date_texte: data.date_texte,
                    categorie: data.categorie,
                    label_categorie: data.label_categorie || categoryLabels[data.categorie],
                    image_url: data.image_url,
                    mis_en_avant: data.mis_en_avant || false
                });
            });
            setArticles(loaded);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(article: Article) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${article.titre}" ?`)) return;

        setDeletingId(article.id);
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, "articles", article.id));
            setArticles(prev => prev.filter(a => a.id !== article.id));
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.resume.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || article.categorie === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white focus:border-[#4CBBD5] focus:outline-none transition-colors cursor-pointer"
                        >
                            <option value="all" className="bg-[#041C30]">Toutes catégories</option>
                            <option value="evenement" className="bg-[#041C30]">Événements</option>
                            <option value="decouverte" className="bg-[#041C30]">Découvertes</option>
                            <option value="musee" className="bg-[#041C30]">Vie du musée</option>
                        </select>
                    </div>
                </div>

                <Link
                    href="/admin/nouveau"
                    className="bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19] font-semibold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouvel article
                </Link>
            </div>

            {/* Articles Count */}
            <p className="text-white/40 text-sm">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
                {filterCategory !== "all" && ` dans "${categoryLabels[filterCategory]}"`}
                {searchTerm && ` pour "${searchTerm}"`}
            </p>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
                    <p className="text-white/40 mb-4">Aucun article trouvé</p>
                    <Link
                        href="/admin/nouveau"
                        className="text-[#4CBBD5] hover:underline"
                    >
                        Créer un premier article
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="md:w-48 h-32 md:h-auto relative bg-white/10 flex-shrink-0">
                                    {article.image_url && (
                                        <Image src={article.image_url} alt="" fill className="object-cover" />
                                    )}
                                    {article.mis_en_avant && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-[#4CBBD5] text-[#020A19] text-[10px] font-bold uppercase rounded">
                                            À la une
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 md:p-5 flex flex-col">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${categoryColors[article.categorie] || 'bg-white/10 text-white/70 border-white/20'}`}>
                                                {article.label_categorie}
                                            </span>
                                        </div>
                                        <span className="text-white/40 text-xs">{article.date_texte}</span>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-1">{article.titre}</h3>
                                    <p className="text-white/50 text-sm line-clamp-2 mb-4 flex-1">{article.resume}</p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/actualites/${article.id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-[#4CBBD5] text-sm hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Voir
                                        </Link>
                                        <Link
                                            href={`/admin/articles/${article.id}`}
                                            className="inline-flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(article)}
                                            disabled={deletingId === article.id}
                                            className="inline-flex items-center gap-2 text-red-400 text-sm hover:text-red-300 disabled:opacity-50 transition-colors"
                                        >
                                            {deletingId === article.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ArticlesListPage() {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout title="Gérer les articles">
            <ArticlesListContent />
        </AdminLayout>
    );
}

export default function ArticlesPage() {
    return (
        <AdminProvider>
            <ArticlesListPage />
        </AdminProvider>
    );
}
