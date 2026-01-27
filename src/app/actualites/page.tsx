"use client";

import { Footer } from "@/components/UI";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Clock, ArrowRight, Users, Sparkles, Mail, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";
import { getColorClasses } from "@/types/category";

const Navbar = dynamic(() => import("@/components/UI/Navbar").then(mod => mod.Navbar), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function ActualitesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<string>("all");

    // Récupération des articles depuis Firebase
    const { articles, loading, error } = useArticles();
    const { categories } = useCategories();

    const filteredNews = filter === "all"
        ? articles
        : articles.filter(item => item.category === filter);

    const featuredNews = articles.filter(item => item.featured);
    const regularNews = filteredNews.filter(item => !item.featured);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: "power4.out"
            });

            gsap.from(".hero-quote", {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });

            gsap.fromTo(".featured-card",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.15,
                    delay: 0.1,
                    ease: "power2.out"
                }
            );

            // Filter buttons animation
            gsap.from(".filter-btn", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                delay: 0.3,
                ease: "power2.out"
            });

            // News cards with scroll trigger
            gsap.utils.toArray<HTMLElement>(".news-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    delay: (i % 3) * 0.08,
                    ease: "power2.out"
                });
            });

            // Newsletter section
            gsap.from(".newsletter-section", {
                scrollTrigger: {
                    trigger: ".newsletter-section",
                    start: "top 85%"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, [filter]);

    const getCategoryColor = (categoryKey: string) => {
        const category = categories.find(c => c.key === categoryKey);
        return category ? getColorClasses(category.color) : "bg-white/10 text-white/70 border-white/20";
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#041C30] text-white selection:bg-[#4CBBD5] selection:text-[#020A19]">
            <Navbar />

            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/30 to-[#041C30]" />

                <div className="relative z-10 space-y-6 max-w-4xl">
                    <h1 className="hero-title text-4xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
                        Les Dernières<br />
                        <span className="font-serif italic text-white/80">Nouvelles</span>
                    </h1>
                </div>
            </section>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-32 relative z-20">
                    <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin mb-4" />
                    <p className="text-white/50 text-sm">Chargement des actualités...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center py-32 relative z-20">
                    <p className="text-red-400 text-sm mb-2">{error}</p>
                    <p className="text-white/40 text-xs">Veuillez réessayer plus tard.</p>
                </div>
            )}

            {/* Featured News - À la Une */}
            {!loading && !error && featuredNews.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:mt-8 relative z-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="w-5 h-5 text-[#4CBBD5]" />
                        <span className="text-sm font-semibold text-[#4CBBD5] uppercase tracking-wider">À la Une</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredNews.map((item) => (
                            <Link key={item.id} href={`/actualites/${item.id}`}>
                                <article
                                    className="featured-card group relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#4CBBD5]/50 transition-colors duration-300 cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative h-64 md:h-80 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020A19] via-[#020A19]/60 to-transparent" />

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm ${getCategoryColor(item.category)}`}>
                                                {item.categoryLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center gap-3 mb-3 text-xs text-white/50">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{item.date}</span>
                                            {item.eventDate && (
                                                <>
                                                    <span className="text-[#4CBBD5]">•</span>
                                                    <span className="text-[#4CBBD5] font-semibold">{item.eventDate}</span>
                                                </>
                                            )}
                                        </div>

                                        <h2 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-[#4CBBD5] transition-colors leading-tight">
                                            {item.title}
                                        </h2>

                                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">
                                            {item.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-[#4CBBD5] text-xs font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                                            <span>Lire l&apos;article</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* All News Section */}
            {!loading && !error && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles className="w-5 h-5 text-[#4CBBD5]" />
                                <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Explorer</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-light">Toutes nos actualités</h2>
                            <div className="h-1 w-16 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                key="all"
                                onClick={() => setFilter("all")}
                                className={`filter-btn px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-all duration-300 ${filter === "all"
                                    ? "bg-[#4CBBD5] text-[#020A19] border-[#4CBBD5] font-semibold"
                                    : "bg-transparent text-white/60 border-white/20 hover:border-[#4CBBD5]/50 hover:text-white"
                                    }`}
                            >
                                Tout voir
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setFilter(category.key)}
                                    className={`filter-btn px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-all duration-300 ${filter === category.key
                                        ? "bg-[#4CBBD5] text-[#020A19] border-[#4CBBD5] font-semibold"
                                        : "bg-transparent text-white/60 border-white/20 hover:border-[#4CBBD5]/50 hover:text-white"
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* News Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularNews.map((item) => (
                            <Link key={item.id} href={`/actualites/${item.id}`}>
                                <article
                                    className="news-card group cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020A19]/80 to-transparent opacity-60" />

                                        {/* Category */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm ${getCategoryColor(item.category)}`}>
                                                {item.categoryLabel}
                                            </span>
                                        </div>

                                        {/* Event badge */}
                                        {item.eventDate && (
                                            <div className="absolute bottom-3 left-3">
                                                <div className="inline-flex items-center gap-2 text-[10px] px-3 py-1.5 bg-[#020A19]/80 backdrop-blur-sm rounded-lg border border-[#4CBBD5]/20">
                                                    <Calendar className="w-3 h-3 text-[#4CBBD5]" />
                                                    <span className="text-[#4CBBD5] font-semibold">{item.eventDate}</span>
                                                    {item.eventTime && (
                                                        <>
                                                            <Clock className="w-3 h-3 text-white/40 ml-1" />
                                                            <span className="text-white/60">{item.eventTime}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <span>{item.date}</span>
                                        </div>

                                        <h3 className="text-lg font-semibold group-hover:text-[#4CBBD5] transition-colors leading-snug">
                                            {item.title}
                                        </h3>

                                        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                                            {item.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-[#4CBBD5] text-xs font-semibold uppercase tracking-wider pt-2 group-hover:gap-3 transition-all">
                                            <span>Lire la suite</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {regularNews.length === 0 && (
                        <div className="text-center py-16">
                            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/50">Aucune actualité dans cette catégorie pour le moment.</p>
                        </div>
                    )}
                </section>
            )}

            {/* Newsletter CTA - Plus simple */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16 md:pb-24 relative z-10">
                <div className="relative border-t border-b border-white/10 py-12 md:py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Mail className="w-5 h-5 text-[#4CBBD5]" strokeWidth={1.5} />
                            <span className="text-[#4CBBD5] text-xs font-medium uppercase tracking-[0.2em]">Newsletter</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-light mb-3">Restez informé</h2>
                        <p className="text-white/50 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                            Actualités du musée, événements à venir et découvertes scientifiques. Une fois par mois, directement dans votre boîte mail.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 bg-transparent border border-white/20 focus:border-[#4CBBD5] rounded-lg px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19] font-semibold text-sm rounded-lg transition-colors whitespace-nowrap"
                            >
                                S&apos;inscrire
                            </button>
                        </form>

                        <p className="text-[10px] text-white/30 mt-4">
                            Désinscription possible à tout moment.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
