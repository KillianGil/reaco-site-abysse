"use client";

import { Footer } from "@/components/UI";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Loader2, Link2, Facebook, Linkedin, Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import { useArticle, useArticles, type ArticleCategory } from "@/hooks/useArticles";

const Navbar = dynamic(() => import("@/components/UI/Navbar").then(mod => mod.Navbar), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function ArticlePage() {
    const params = useParams();
    const id = params.id as string;
    const containerRef = useRef<HTMLDivElement>(null);

    const { article, loading, error } = useArticle(id);
    const { articles } = useArticles();

    // Suggestions : autres articles de la même catégorie ou récents
    const suggestions = articles
        .filter(a => a.id !== id)
        .sort((a, b) => {
            // Priorité aux articles de la même catégorie
            if (article && a.category === article.category && b.category !== article.category) return -1;
            if (article && b.category === article.category && a.category !== article.category) return 1;
            return 0;
        })
        .slice(0, 3);

    useEffect(() => {
        if (!article) return;

        const ctx = gsap.context(() => {
            gsap.from(".article-header", {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(".article-image", {
                scale: 1.1,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: "power3.out"
            });

            gsap.from(".article-content", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: "power2.out"
            });

            gsap.from(".suggestion-card", {
                scrollTrigger: {
                    trigger: ".suggestions-section",
                    start: "top 80%"
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, [article]);

    const getCategoryColor = (category: ArticleCategory) => {
        switch (category) {
            case "evenement": return "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30";
            case "decouverte": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "musee": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            default: return "bg-white/10 text-white/70 border-white/20";
        }
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = article?.title || "Article ABYSSE";

    const handleShare = (platform: string) => {
        const urls: Record<string, string> = {
            x: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            instagram: `https://www.instagram.com/`,
        };

        if (platform === "copy") {
            navigator.clipboard.writeText(shareUrl);
            return;
        }

        window.open(urls[platform], "_blank", "width=600,height=400");
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#041C30] text-white selection:bg-[#4CBBD5] selection:text-[#020A19]">
            <Navbar />

            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen relative z-20">
                    <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin mb-4" />
                    <p className="text-white/50 text-sm">Chargement de l&apos;article...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center min-h-screen relative z-20">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <Link
                        href="/actualites"
                        className="inline-flex items-center gap-2 text-[#4CBBD5] hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour aux actualités</span>
                    </Link>
                </div>
            )}

            {/* Article Content */}
            {!loading && !error && article && (
                <>
                    {/* Back Button */}
                    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-32 relative z-20">
                        <Link
                            href="/actualites"
                            className="inline-flex items-center gap-2 text-white/50 hover:text-[#4CBBD5] transition-colors text-sm mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour aux actualités</span>
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="article-header max-w-4xl mx-auto px-4 md:px-6 relative z-20">
                        {/* Category & Date */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                                {article.categoryLabel}
                            </span>
                            <div className="flex items-center gap-2 text-white/50 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{article.date}</span>
                            </div>
                            {article.eventDate && (
                                <div className="flex items-center gap-2 text-[#4CBBD5] text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{article.eventDate}</span>
                                    {article.eventTime && <span>à {article.eventTime}</span>}
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-8">
                            {article.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-8">
                            {article.excerpt}
                        </p>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-4 pb-8 border-b border-white/10">
                            <span className="text-white/40 text-sm flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Partager
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleShare("x")}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30 flex items-center justify-center transition-all"
                                    aria-label="Partager sur X"
                                >
                                    <XIcon className="w-4 h-4 text-white/70" />
                                </button>
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#4267B2]/20 border border-white/10 hover:border-[#4267B2]/50 flex items-center justify-center transition-all"
                                    aria-label="Partager sur Facebook"
                                >
                                    <Facebook className="w-4 h-4 text-white/70 hover:text-[#4267B2]" />
                                </button>
                                <button
                                    onClick={() => handleShare("linkedin")}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/50 flex items-center justify-center transition-all"
                                    aria-label="Partager sur LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4 text-white/70 hover:text-[#0A66C2]" />
                                </button>
                                <button
                                    onClick={() => handleShare("instagram")}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-[#833AB4]/30 hover:via-[#FD1D1D]/30 hover:to-[#FCAF45]/30 border border-white/10 hover:border-[#E1306C]/50 flex items-center justify-center transition-all"
                                    aria-label="Partager sur Instagram"
                                >
                                    <Instagram className="w-4 h-4 text-white/70" />
                                </button>
                                <button
                                    onClick={() => handleShare("copy")}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#4CBBD5]/20 border border-white/10 hover:border-[#4CBBD5]/50 flex items-center justify-center transition-all"
                                    aria-label="Copier le lien"
                                >
                                    <Link2 className="w-4 h-4 text-white/70 hover:text-[#4CBBD5]" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image - Reduced size */}
                    <div className="article-image max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">
                        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020A19]/50 to-transparent" />
                        </div>
                    </div>

                    {/* Article Body - Improved typography */}
                    <article className="article-content max-w-3xl mx-auto px-4 md:px-6 pb-16 md:pb-24 relative z-20">
                        <div
                            className="prose prose-lg prose-invert max-w-none
                                prose-p:text-white/70 prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-[17px]
                                prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
                                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
                                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:text-[#4CBBD5]
                                prose-strong:text-white prose-strong:font-semibold
                                prose-a:text-[#4CBBD5] prose-a:no-underline hover:prose-a:underline
                                prose-ul:text-white/70 prose-ol:text-white/70
                                prose-li:mb-3 prose-li:leading-relaxed
                                prose-blockquote:border-l-4 prose-blockquote:border-[#4CBBD5] prose-blockquote:bg-white/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-white/60 prose-blockquote:my-10"
                            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '</p><p class="mt-6">').replace(/\n/g, '<br />') }}
                        />
                    </article>

                    {/* Suggestions Section */}
                    {suggestions.length > 0 && (
                        <section className="suggestions-section max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24 relative z-20">
                            <div className="border-t border-white/10 pt-16 md:pt-24">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3">À découvrir</span>
                                        <h2 className="text-2xl md:text-4xl font-light">Articles similaires</h2>
                                        <div className="h-1 w-16 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                                    </div>
                                    <Link
                                        href="/actualites"
                                        className="hidden md:inline-flex items-center gap-2 text-[#4CBBD5] hover:text-white transition-colors text-sm"
                                    >
                                        <span>Voir tout</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {suggestions.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/actualites/${item.id}`}
                                            className="suggestion-card group cursor-pointer"
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
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2">
                                                <span className="text-xs text-white/40">{item.date}</span>
                                                <h3 className="text-lg font-semibold group-hover:text-[#4CBBD5] transition-colors leading-snug">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                                                    {item.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile link */}
                                <div className="md:hidden text-center mt-8">
                                    <Link
                                        href="/actualites"
                                        className="inline-flex items-center gap-2 text-[#4CBBD5] text-sm"
                                    >
                                        <span>Voir toutes les actualités</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            <Footer />
        </main>
    );
}
