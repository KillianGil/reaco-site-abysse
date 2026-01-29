"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminProvider, useAdmin, AdminLogin, AdminLayout, StatCard } from "@/components/admin/AdminComponents";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { FileText, TrendingUp, Calendar, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface RecentArticle {
    id: string;
    titre: string;
    date_texte: string;
    image_url: string;
    categorie: string;
}

function DashboardContent() {
    const [stats, setStats] = useState({ total: 0, featured: 0, events: 0 });
    const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const articlesRef = collection(db, "articles");
                const snapshot = await getDocs(articlesRef);

                let total = 0;
                let featured = 0;
                let events = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    total++;
                    if (data.mis_en_avant) featured++;
                    if (data.categorie === "evenement") events++;
                });

                setStats({ total, featured, events });

                // Load recent articles
                const recentQuery = query(articlesRef, orderBy("date", "desc"), limit(5));
                const recentSnapshot = await getDocs(recentQuery);
                const articles: RecentArticle[] = [];
                recentSnapshot.forEach((doc) => {
                    const data = doc.data();
                    articles.push({
                        id: doc.id,
                        titre: data.titre,
                        date_texte: data.date_texte,
                        image_url: data.image_url,
                        categorie: data.categorie
                    });
                });
                setRecentArticles(articles);
            } catch {
                // Erreur silencieuse - le dashboard affichera simplement 0 articles
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard icon={FileText} label="Total articles" value={stats.total} color="cyan" />
                <StatCard icon={TrendingUp} label="Mis en avant" value={stats.featured} color="emerald" />
                <StatCard icon={Calendar} label="Événements" value={stats.events} color="amber" />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/admin/nouveau" className="group bg-gradient-to-br from-[#4CBBD5]/20 to-[#006994]/20 rounded-2xl border border-[#4CBBD5]/30 p-6 hover:border-[#4CBBD5]/60 transition-all">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#4CBBD5] transition-colors">Créer un article</h3>
                    <p className="text-white/50 text-sm mb-4">Publiez une nouvelle actualité sur le site</p>
                    <span className="inline-flex items-center gap-2 text-[#4CBBD5] text-sm font-medium group-hover:gap-3 transition-all">
                        Commencer <ArrowRight className="w-4 h-4" />
                    </span>
                </Link>
                <Link href="/admin/articles" className="group bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#4CBBD5] transition-colors">Gérer les articles</h3>
                    <p className="text-white/50 text-sm mb-4">Modifier ou supprimer des articles existants</p>
                    <span className="inline-flex items-center gap-2 text-[#4CBBD5] text-sm font-medium group-hover:gap-3 transition-all">
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </span>
                </Link>
            </div>

            {/* Recent Articles */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-semibold">Articles récents</h2>
                    <Link href="/admin/articles" className="text-[#4CBBD5] text-sm hover:underline">
                        Voir tout
                    </Link>
                </div>
                <div className="divide-y divide-white/5">
                    {recentArticles.length === 0 ? (
                        <div className="p-8 text-center text-white/40">
                            Aucun article publié
                        </div>
                    ) : (
                        recentArticles.map((article) => (
                            <div key={article.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
                                    {article.image_url && (
                                        <Image src={article.image_url} alt="" fill className="object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">{article.titre}</p>
                                    <p className="text-xs text-white/40">{article.date_texte}</p>
                                </div>
                                <Link
                                    href={`/actualites/${article.id}`}
                                    target="_blank"
                                    className="text-[#4CBBD5] text-sm hover:underline"
                                >
                                    Voir
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout title="Dashboard">
            <DashboardContent />
        </AdminLayout>
    );
}

export default function AdminPage() {
    return (
        <AdminProvider>
            <AdminDashboard />
        </AdminProvider>
    );
}
