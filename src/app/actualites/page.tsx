"use client";

import { Footer } from "@/components/UI";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Clock, ArrowRight, Users, Sparkles, Mail } from "lucide-react";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/UI/Navbar").then(mod => mod.Navbar), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

type NewsCategory = "all" | "evenement" | "decouverte" | "musee";

interface NewsItem {
    id: number;
    category: NewsCategory;
    categoryLabel: string;
    date: string;
    title: string;
    excerpt: string;
    image: string;
    featured?: boolean;
    eventDate?: string;
    eventTime?: string;
}

const newsData: NewsItem[] = [
    {
        id: 1,
        category: "evenement",
        categoryLabel: "Événement",
        date: "15 Jan 2026",
        title: "Nuit Européenne des Musées 2026",
        excerpt: "Une soirée magique vous attend ! Plongez dans les abysses en nocturne avec nos guides passionnés. Au programme : visites guidées exclusives, projections immersives et rencontres avec des océanographes.",
        image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
        featured: true,
        eventDate: "17 Mai 2026",
        eventTime: "19h - Minuit"
    },
    {
        id: 2,
        category: "decouverte",
        categoryLabel: "Découverte",
        date: "10 Jan 2026",
        title: "Record battu : vie découverte à 8 336 mètres",
        excerpt: "Une équipe internationale vient d'identifier un poisson vivant dans la fosse des Mariannes, pulvérisant le précédent record. Cette découverte bouleverse notre compréhension de la vie dans les conditions extrêmes.",
        image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=800&q=80",
        featured: true
    },
    {
        id: 3,
        category: "musee",
        categoryLabel: "Vie du Musée",
        date: "5 Jan 2026",
        title: "Le FNRS III renaît de ses cendres",
        excerpt: "Après deux ans de restauration minutieuse, le légendaire bathyscaphe retrouve peu à peu sa splendeur d'origine. Nos équipes vous dévoilent les coulisses de ce travail d'orfèvre.",
        image: "https://images.unsplash.com/photo-1580019542155-247062e19ce4?w=800&q=80"
    },
    {
        id: 4,
        category: "evenement",
        categoryLabel: "Événement",
        date: "28 Déc 2025",
        title: "Vacances de février : ateliers pour les petits explorateurs",
        excerpt: "Vos enfants rêvent de devenir océanographes ? Pendant les vacances d'hiver, le musée propose des ateliers créatifs pour les 6-12 ans : construction de mini sous-marins, découverte des créatures bioluminescentes...",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80",
        eventDate: "10-21 Fév 2026",
        eventTime: "14h - 16h30"
    },
    {
        id: 5,
        category: "decouverte",
        categoryLabel: "Découverte",
        date: "20 Déc 2025",
        title: "Un monde caché sous l'Atlantique",
        excerpt: "Les chercheurs de l'IFREMER ont cartographié un nouveau champ de sources hydrothermales abritant un écosystème unique. Des images à couper le souffle qui nous rappellent combien l'océan recèle encore de mystères.",
        image: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80"
    },
    {
        id: 6,
        category: "musee",
        categoryLabel: "Vie du Musée",
        date: "15 Déc 2025",
        title: "Un mois déjà ! 25 000 visiteurs depuis l'ouverture",
        excerpt: "Grâce à vous, le musée ABYSSE a accueilli plus de 25 000 curieux depuis son ouverture en novembre. Chaque visite nous rappelle pourquoi nous faisons ce métier : transmettre la passion de l'océan.",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80"
    },
    {
        id: 7,
        category: "evenement",
        categoryLabel: "Événement",
        date: "1 Déc 2025",
        title: "Conférence : Les pionnières des profondeurs",
        excerpt: "Rencontre exceptionnelle avec trois océanographes qui ont marqué l'histoire de l'exploration sous-marine. Un hommage émouvant aux femmes qui ont bravé les préjugés pour explorer l'inconnu.",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
        eventDate: "8 Mars 2026",
        eventTime: "18h"
    },
    {
        id: 8,
        category: "musee",
        categoryLabel: "Vie du Musée",
        date: "15 Nov 2025",
        title: "Ouverture du musée ABYSSE !",
        excerpt: "C'est le grand jour ! Le musée ABYSSE ouvre enfin ses portes au public. Venez découvrir les mystères des profondeurs dans un parcours immersif unique en France.",
        image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80"
    }
];

export default function ActualitesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<NewsCategory>("all");

    const filteredNews = filter === "all"
        ? newsData
        : newsData.filter(item => item.category === filter);

    const featuredNews = newsData.filter(item => item.featured);
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

            gsap.utils.toArray<HTMLElement>(".news-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    delay: (i % 3) * 0.1,
                    ease: "power2.out"
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [filter]);

    const getCategoryColor = (category: NewsCategory) => {
        switch (category) {
            case "evenement": return "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30";
            case "decouverte": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "musee": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            default: return "bg-white/10 text-white/70 border-white/20";
        }
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
            <section className="relative h-[55vh] md:h-[65vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-32 md:pt-40">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/30 to-[#041C30]" />

                <div className="relative z-10 space-y-6 max-w-4xl">
                    <h1 className="hero-title text-4xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
                        Les Dernières<br />
                        <span className="font-serif italic text-white/80">Nouvelles</span>
                    </h1>

                    <p className="hero-quote text-base md:text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
                        « L&apos;océan est le dernier espace sauvage sur Terre. Chaque jour apporte son lot de découvertes. »
                    </p>
                </div>
            </section>

            {/* Featured News - À la Une */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:mt-8 relative z-20">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-5 h-5 text-[#4CBBD5]" />
                    <span className="text-sm font-semibold text-[#4CBBD5] uppercase tracking-wider">À la Une</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {featuredNews.map((item) => (
                        <article
                            key={item.id}
                            className="featured-card group relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#4CBBD5]/50 transition-all duration-500 cursor-pointer"
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
                    ))}
                </div>
            </section>

            {/* All News Section */}
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
                        {[
                            { value: "all" as NewsCategory, label: "Tout voir" },
                            { value: "evenement" as NewsCategory, label: "Événements" },
                            { value: "decouverte" as NewsCategory, label: "Découvertes" },
                            { value: "musee" as NewsCategory, label: "Vie du musée" }
                        ].map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setFilter(cat.value)}
                                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-all duration-300 ${filter === cat.value
                                    ? "bg-[#4CBBD5] text-[#020A19] border-[#4CBBD5] font-semibold"
                                    : "bg-transparent text-white/60 border-white/20 hover:border-[#4CBBD5]/50 hover:text-white"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularNews.map((item) => (
                        <article
                            key={item.id}
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

            {/* Newsletter CTA - Plus humain */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16 md:pb-24 relative z-10">
                <div className="relative bg-gradient-to-br from-[#031525] to-[#020A19] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
                    {/* Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CBBD5]/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-[#4CBBD5]/10 rounded-full flex items-center justify-center">
                            <Mail className="w-7 h-7 text-[#4CBBD5]" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-light mb-3">Restez connecté aux profondeurs</h2>
                        <p className="text-white/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                            Recevez nos actualités, invitations aux événements et découvertes fascinantes directement dans votre boîte mail. Promis, pas de spam !
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 bg-[#041C30] border border-white/10 focus:border-[#4CBBD5] rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3.5 bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19] font-semibold text-sm uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap"
                            >
                                Je m&apos;inscris
                            </button>
                        </form>

                        <p className="text-[10px] text-white/30 mt-4">
                            Désinscription en un clic, à tout moment.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
