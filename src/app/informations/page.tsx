"use client";

import { Navbar, Footer } from "@/components/UI";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footprints, Bus, Car, Clock, Ticket, GraduationCap, Baby, Globe, Accessibility, ShoppingBag, Coffee, Wifi, Lock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Animated Number Component - Ultra smooth
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.5,
                        ease: "power3.out",
                        onUpdate: function () {
                            // Update more frequently for smoother animation
                            setCount(Math.floor(obj.val));
                        }
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function InformationsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero - Simple fade-in animations

            gsap.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: "power4.out"
            });

            // Staggered card reveals with rotation
            gsap.utils.toArray<HTMLElement>(".info-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 100,
                    opacity: 0,
                    rotateX: -15,
                    duration: 0.8,
                    delay: (i % 3) * 0.1, // Use modulo to prevent huge delays on lower elements
                    ease: "back.out(1.5)"
                });
            });

            // Icon pop animations
            gsap.utils.toArray<HTMLElement>(".icon-wrapper").forEach((icon) => {
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: icon,
                        start: "top 85%"
                    },
                    scale: 0,
                    rotation: 180,
                    duration: 0.6,
                    ease: "back.out(3)"
                });
            });

            // Section headers slide in
            gsap.utils.toArray<HTMLElement>(".section-header").forEach((header) => {
                gsap.from(header, {
                    scrollTrigger: {
                        trigger: header,
                        start: "top 85%"
                    },
                    x: -100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // Price cards with shimmer effect
            gsap.utils.toArray<HTMLElement>(".price-card").forEach((card, i) => {
                const shimmer = card.querySelector(".shimmer") as HTMLElement;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%"
                    },
                    y: 50,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: "power2.out"
                });

                if (shimmer) {
                    gsap.to(shimmer, {
                        x: "200%",
                        duration: 2,
                        delay: 1 + i * 0.2,
                        ease: "power2.inOut"
                    });
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#041C30] text-white selection:bg-[#4CBBD5] selection:text-[#020A19]">
            <Navbar />

            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/12 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-[#4CBBD5]/8 rounded-full blur-[80px]" />
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#006994]/10 rounded-full blur-[60px]" />
            </div>

            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/30 to-[#041C30]" />

                <div className="relative z-10 space-y-4 md:space-y-6 max-w-4xl">

                    <h1 className="hero-title text-4xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
                        Préparez Votre<br />
                        <span className="font-serif italic text-white/80">Plongée</span>
                    </h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-32 space-y-20 md:space-y-32 relative z-10">

                {/* 1. Comment Venir */}
                <section>
                    <div className="section-header mb-10 md:mb-16">
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">01. ACCÈS</span>
                        <h3 className="text-3xl md:text-5xl font-light">Comment Venir ?</h3>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="info-card group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Footprints className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">À Pied</h4>
                                <ul className="space-y-2 md:space-y-3 text-white/80 text-xs md:text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4CBBD5] mt-0.5 font-bold flex-shrink-0">→</span>
                                        <span className="leading-relaxed">5 min depuis le Terminal Croisières</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4CBBD5] mt-0.5 font-bold flex-shrink-0">→</span>
                                        <span className="leading-relaxed">Port Marchand, entrée Nord Arsenal</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="info-card group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Bus className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">En Bus</h4>
                                <ul className="space-y-2 md:space-y-3 text-white/80 text-xs md:text-sm mb-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4CBBD5] mt-0.5 font-bold flex-shrink-0">→</span>
                                        <span className="leading-relaxed">Arrêt &quot;Port Marchand&quot; ou &quot;Mourillon&quot;</span>
                                    </li>
                                </ul>
                                <div className="text-center">
                                    <p className="text-[10px] md:text-xs text-white/60 mb-2 uppercase tracking-wider">Lignes à prendre</p>
                                    <div className="flex justify-center gap-2">
                                        {['3', '23', '40'].map(line => (
                                            <span key={line} className="px-2 py-1 md:px-3 md:py-1.5 bg-[#4CBBD5]/20 border border-[#4CBBD5]/40 rounded-lg text-xs md:text-sm font-bold text-[#4CBBD5] hover:bg-[#4CBBD5]/30 transition-colors">
                                                {line}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://www.google.com/maps/place/C.C.I+-+Parking+Port+Marchand/@43.1181254,5.9303856,16z/data=!3m1!4b1!4m6!3m5!1s0x12c91b0d03b2235d:0x9f5b43774bc8f2ca!8m2!3d43.1181255!4d5.9352565!16s%2Fg%2F1tjjfpkf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-card group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 cursor-pointer overflow-hidden block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Car className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">En Voiture</h4>
                                <ul className="space-y-2 md:space-y-3 text-white/80 text-xs md:text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4CBBD5] mt-0.5 font-bold flex-shrink-0">→</span>
                                        <span className="leading-relaxed">Parking Port Marchand</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4CBBD5] mt-0.5 font-bold flex-shrink-0">→</span>
                                        <div className="flex-1">
                                            <span className="font-mono text-[10px] md:text-xs text-[#4CBBD5] leading-relaxed">43.1181° N, 5.9353° E</span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="mt-4 text-center">
                                    <span className="text-[10px] md:text-xs text-white/40 group-hover:text-[#4CBBD5] transition-colors">📍 Cliquez pour ouvrir dans Maps</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>

                {/* 2. Horaires */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                        <div className="section-header mb-6 md:mb-8">
                            <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">02. PLANNING</span>
                            <h3 className="text-3xl md:text-5xl font-light">Horaires</h3>
                            <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="info-card p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#4CBBD5]/10 to-transparent border-l-4 border-[#4CBBD5]">
                                <div className="flex items-center gap-3 md:gap-4 mb-2">
                                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#4CBBD5]" />
                                    <span className="text-lg md:text-xl font-medium">Ouvert 7j/7</span>
                                </div>
                                <p className="text-3xl md:text-4xl font-light text-white mb-2">10h00 – 19h00</p>
                                <p className="text-white/40 text-xs md:text-sm">Dernière admission à 17h30</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="info-card p-4 md:p-6 rounded-2xl bg-[#4CBBD5]/5 border border-[#4CBBD5]/20 text-center group hover:bg-[#4CBBD5]/10 transition-all">
                                    <div className="text-2xl md:text-4xl font-light text-[#4CBBD5] mb-2 group-hover:scale-110 transition-transform">
                                        <AnimatedNumber target={90} />mn
                                    </div>
                                    <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider">Parcours Découverte</p>
                                </div>
                                <div className="info-card p-4 md:p-6 rounded-2xl bg-[#4CBBD5]/5 border border-[#4CBBD5]/20 text-center group hover:bg-[#4CBBD5]/10 transition-all">
                                    <div className="text-2xl md:text-4xl font-light text-[#4CBBD5] mb-2 group-hover:scale-110 transition-transform">
                                        <AnimatedNumber target={150} />mn
                                    </div>
                                    <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider">Expérience Totale</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card relative rounded-3xl overflow-hidden border border-white/10 aspect-square group">
                        {/* IMAGE PLACEHOLDER - Remplacer le src par le path de votre image */}
                        <Image
                            src="/assets/port-toulon-final.jpg"
                            alt="Musée Abysse"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020A19]/80 via-transparent to-transparent" />
                    </div>
                </section>

                {/* 3. Tarifs */}
                <section>
                    <div className="section-header mb-10 md:mb-16">
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">03. BILLETTERIE</span>
                        <h3 className="text-3xl md:text-5xl font-light mb-4">Tarifs & Offres</h3>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                        <div className="price-card relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 overflow-hidden group">
                            <div className="shimmer absolute top-0 left-[-100%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CBBD5]/10 rounded-full blur-3xl group-hover:bg-[#4CBBD5]/20 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center">
                                    <Ticket className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-2">Adulte</h4>
                                <div className="text-4xl md:text-5xl font-bold text-[#4CBBD5] mb-3 md:mb-4">
                                    <AnimatedNumber target={16} suffix="€" />
                                </div>
                                <p className="text-xs md:text-sm text-white/70">Accès complet musée + sous-marin</p>
                            </div>
                        </div>

                        <div className="price-card relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 overflow-hidden group">
                            <div className="shimmer absolute top-0 left-[-100%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CBBD5]/10 rounded-full blur-3xl group-hover:bg-[#4CBBD5]/20 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-1">Jeune</h4>
                                <p className="text-[10px] md:text-xs text-white/50 mb-3">-26 ans / Étudiant</p>
                                <div className="text-4xl md:text-5xl font-bold text-[#4CBBD5] mb-3 md:mb-4">
                                    <AnimatedNumber target={10} suffix="€" />
                                </div>
                                <p className="text-xs md:text-sm text-white/70">Sur justificatif</p>
                            </div>
                        </div>

                        <div className="price-card relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 transition-all duration-500 overflow-hidden group">
                            <div className="shimmer absolute top-0 left-[-100%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CBBD5]/10 rounded-full blur-3xl group-hover:bg-[#4CBBD5]/20 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 bg-[#4CBBD5]/10 rounded-2xl flex items-center justify-center">
                                    <Baby className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold mb-1">Enfant</h4>
                                <p className="text-[10px] md:text-xs text-white/50 mb-3">5-12 ans</p>
                                <div className="text-4xl md:text-5xl font-bold text-[#4CBBD5] mb-3 md:mb-4">
                                    <AnimatedNumber target={8} suffix="€" />
                                </div>
                                <p className="text-xs md:text-sm text-[#4CBBD5] font-bold">Gratuit -5 ans</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                        <div className="price-card p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex justify-between items-center hover:border-[#4CBBD5]/50 transition-all cursor-pointer overflow-hidden">
                            <div className="shimmer absolute top-0 left-[-100%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <div className="relative z-10 flex-1">
                                <h4 className="text-lg md:text-xl font-bold text-white">Forfait Famille</h4>
                                <p className="text-xs md:text-sm text-white/60">2 Adultes + 2 Enfants</p>
                            </div>
                            <div className="relative z-10 text-3xl md:text-4xl font-bold text-[#4CBBD5]">
                                <AnimatedNumber target={42} suffix="€" />
                            </div>
                        </div>

                        <div className="price-card p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex justify-between items-center hover:border-[#4CBBD5]/50 transition-all cursor-pointer overflow-hidden">
                            <div className="shimmer absolute top-0 left-[-100%] h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <div className="relative z-10 flex-1">
                                <h4 className="text-lg md:text-xl font-bold text-white">Groupes & Scolaires</h4>
                                <p className="text-xs md:text-sm text-white/60">Visites guidées</p>
                            </div>
                            <div className="relative z-10 text-base md:text-lg font-medium text-[#4CBBD5] uppercase tracking-wider">Sur devis</div>
                        </div>
                    </div>

                    {/* Bouton Réserver - plus discret, centré */}
                    <div className="text-center">
                        <a href="/billetterie" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CBBD5]/10 hover:bg-[#4CBBD5]/20 border border-[#4CBBD5]/30 hover:border-[#4CBBD5]/50 rounded-full text-[#4CBBD5] text-sm font-medium uppercase tracking-wider transition-all duration-300">
                            <Ticket className="w-4 h-4" />
                            <span>Réserver en ligne</span>
                        </a>
                    </div>
                </section>

                {/* 4. Services */}
                <section>
                    <div className="section-header mb-10 md:mb-16">
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">04. CONFORT</span>
                        <h3 className="text-3xl md:text-5xl font-light">À Votre Service</h3>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                    </div>

                    {/* Services List - Editorial Style */}
                    <div className="space-y-0 border-t border-white/10">
                        {[
                            { icon: Accessibility, title: "Accessibilité", detail: "100% PMR · Ascenseurs · Rampes", tag: "Label Tourisme & Handicap" },
                            { icon: Globe, title: "Multilingue", detail: "Audioguides en 4 langues", tag: "FR · EN · DE · ES" },
                            { icon: Coffee, title: "Cafétéria", detail: "Vue panoramique sur la rade", tag: "Produits locaux" },
                            { icon: ShoppingBag, title: "Boutique", detail: "Livres, objets, souvenirs", tag: null },
                            { icon: Wifi, title: "Wi-Fi", detail: "Gratuit dans tout le musée", tag: null },
                            { icon: Lock, title: "Consignes", detail: "Casiers sécurisés à l'accueil", tag: null },
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="info-card group flex items-center justify-between py-5 md:py-6 border-b border-white/10 hover:border-[#4CBBD5]/30 transition-colors cursor-default"
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <service.icon className="w-5 h-5 md:w-6 md:h-6 text-[#4CBBD5] opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                                    <div>
                                        <h4 className="text-base md:text-lg font-medium text-white group-hover:text-[#4CBBD5] transition-colors">{service.title}</h4>
                                        <p className="text-xs md:text-sm text-white/50">{service.detail}</p>
                                    </div>
                                </div>
                                {service.tag && (
                                    <span className="hidden md:block text-[10px] font-medium tracking-wider text-white/30 uppercase">{service.tag}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    );
}
