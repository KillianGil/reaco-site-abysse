"use client";

import { Navbar, Footer } from "@/components/UI";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Anchor, Ship, Globe, Microscope, Radio, Database, ShieldAlert, Fish } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ExpositionsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animations

            gsap.from(".hero-title", { y: 100, opacity: 0, duration: 1.2, delay: 0.2, ease: "power4.out" });
            gsap.from(".hero-subtitle", { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });

            // Zone Headers
            gsap.utils.toArray<HTMLElement>(".zone-header").forEach((header) => {
                gsap.from(header, {
                    scrollTrigger: { trigger: header, start: "top 85%" },
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // Zone 1: Tech Cards
            gsap.from(".tech-card", {
                scrollTrigger: { trigger: ".tech-grid", start: "top 80%" },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

            // Zone 2: Bio Particles
            gsap.to(".bio-particle", {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

            // Zone 3: Radar Scan
            gsap.to(".radar-scan", {
                rotation: 360,
                duration: 4,
                repeat: -1,
                ease: "linear"
            });

            // Zone 4: Timeline
            gsap.from(".timeline-item", {
                scrollTrigger: { trigger: ".timeline-container", start: "top 75%" },
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.3,
                ease: "power2.out"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const techItems = [
        {
            name: "Casabianca",
            year: "1935",
            depth: "80m",
            desc: "Sous-marin légendaire de la Seconde Guerre mondiale. Symbole de la résistance française en Méditerranée.",
            icon: Ship
        },
        {
            name: "Bathyscaphe FNRS III",
            year: "1953",
            depth: "4050m",
            desc: "Le pionnier absolu. Détenteur du record historique, objet d'un projet de restauration majeur.",
            icon: Anchor
        },
        {
            name: "Drones & ROV",
            year: "2024",
            depth: "6000m+",
            desc: "Les robots autonomes d'ECA Group et Ifremer. Ils descendent là où l'homme ne peut aller., jusqu’à plus de 6 000 mètres de profondeur, pour cartographier les fonds et prélever des échantillons.",
            icon: Radio
        }
    ];

    return (
        <main ref={containerRef} className="min-h-screen bg-[#041C30] text-white selection:bg-[#4CBBD5] selection:text-[#020A19] overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/30 to-[#041C30] pointer-events-none" />

                {/* Ambient light effects */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#4CBBD5]/12 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-[#006994]/15 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-[#4CBBD5]/8 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10 space-y-6 md:space-y-10 max-w-5xl mx-auto">


                    <h1 className="hero-title text-5xl md:text-8xl lg:text-9xl font-light tracking-tighter text-white leading-[0.9]">
                        VOYAGE<br />
                        <span className="font-serif italic text-white/80">ABYSSAL</span>
                    </h1>

                    <div className="hero-subtitle flex flex-col items-center gap-6 md:gap-8">
                        <div className="h-12 md:h-16 w-px bg-gradient-to-b from-[#4CBBD5] to-transparent" />
                        <p className="text-lg md:text-2xl text-white/80 font-light max-w-2xl leading-relaxed px-4">
                            <span className="text-[#4CBBD5] font-bold">4 Espaces</span> • <span className="text-[#4CBBD5] font-bold">10 000 mètres</span> de profondeur
                        </p>
                    </div>
                </div>
            </section>



            <div className="space-y-16 md:space-y-24 pb-20 md:pb-24 relative z-10">

                {/* ZONE 1: LA GRANDE HALLE DES ENGINS */}
                <section className="px-4 md:px-12 max-w-[1400px] mx-auto w-full relative">
                    {/* Hangar Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none border-x border-white/5" />

                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start">
                        {/* Left: Header & Context */}
                        <div className="w-full lg:w-1/3 lg:sticky lg:top-32">
                            <div className="section-header mb-8 md:mb-10">
                                <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">01. GRANDE HALLE</span>
                                <h3 className="text-3xl md:text-5xl font-light uppercase">Génie Naval</h3>
                                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                                <p className="mt-4 md:mt-6 text-white/60 text-sm md:text-base leading-relaxed border-l-2 border-[#4CBBD5]/30 pl-4 md:pl-6">
                                    Bienvenue dans la cathédrale d&apos;acier. Ici reposent les titans qui ont défié la pression écrasante des abysses.
                                </p>
                            </div>


                        </div>

                        {/* Right: The Exhibits */}
                        <div className="w-full lg:w-2/3 space-y-3 md:space-y-4">
                            {techItems.map((item, i) => (
                                <div key={i} className="group relative bg-[#031525] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center rounded-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4CBBD5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Tech Visual */}
                                    <div className="w-16 h-16 md:w-24 md:h-24 aspect-square bg-[#4CBBD5]/5 rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shrink-0">
                                        <div className="absolute inset-0 border border-[#4CBBD5]/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                                        <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#4CBBD5]" strokeWidth={1.5} />
                                    </div>

                                    {/* Tech Specs */}
                                    <div className="flex-1 relative z-10 w-full">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-lg md:text-xl font-bold text-white/20 group-hover:text-[#4CBBD5]/40 transition-colors">0{i + 1}</span>
                                            <span className="font-mono text-[#4CBBD5] text-[9px] md:text-[10px] border border-[#4CBBD5]/30 px-1.5 py-0.5 rounded">{item.year}</span>
                                        </div>
                                        <h4 className="text-lg md:text-xl font-bold mb-1 group-hover:text-[#4CBBD5] transition-colors">{item.name}</h4>
                                        <p className="text-white/60 text-xs mb-3 leading-relaxed">{item.desc}</p>

                                        <div className="flex gap-6 border-t border-white/5 pt-2">
                                            <div>
                                                <span className="block text-[8px] text-white/40 uppercase tracking-wider mb-0.5">Profondeur</span>
                                                <span className="font-mono text-[#4CBBD5] text-xs">{item.depth}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[8px] text-white/40 uppercase tracking-wider mb-0.5">Statut</span>
                                                <span className="font-mono text-white/80 text-xs">Musée</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ZONE 2: BIODIVERSITÉ - Design immersif bioluminescent */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    {/* Background atmosphérique */}
                    <div className="absolute inset-0 bg-[#020A19]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#4CBBD5/8_0%,_transparent_70%)]" />

                    {/* Particules bioluminescentes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="bio-particle absolute top-[20%] left-[10%] w-2 h-2 bg-[#4CBBD5] rounded-full blur-[2px] opacity-60" />
                        <div className="bio-particle absolute top-[40%] left-[25%] w-1 h-1 bg-cyan-300 rounded-full blur-[1px] opacity-40" />
                        <div className="bio-particle absolute top-[60%] left-[15%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full blur-[2px] opacity-50" />
                        <div className="bio-particle absolute top-[30%] right-[20%] w-2 h-2 bg-emerald-400 rounded-full blur-[2px] opacity-40" />
                        <div className="bio-particle absolute top-[70%] right-[10%] w-1 h-1 bg-[#4CBBD5] rounded-full blur-[1px] opacity-60" />
                        <div className="bio-particle absolute top-[50%] right-[30%] w-1.5 h-1.5 bg-cyan-200 rounded-full blur-[2px] opacity-30" />
                    </div>

                    <div className="relative z-10 px-4 md:px-12 max-w-7xl mx-auto">
                        {/* Header centré */}
                        <div className="text-center mb-12 md:mb-20">
                            <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">02. BIODIVERSITÉ</span>
                            <h3 className="text-4xl md:text-6xl lg:text-7xl font-light mt-4 mb-6">
                                La Vie dans le <span className="text-[#4CBBD5]">Noir</span>
                            </h3>
                            <p className="text-white/50 max-w-lg mx-auto text-sm md:text-base">
                                À 10 000 mètres, là où règne l&apos;obscurité absolue, la vie invente ses propres règles.
                            </p>
                        </div>

                        {/* Bento Grid asymétrique */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                            {/* Grande carte - Bioluminescence */}
                            <div className="md:col-span-7 group relative bg-gradient-to-br from-[#4CBBD5]/10 to-transparent rounded-3xl p-8 md:p-10 border border-[#4CBBD5]/20 hover:border-[#4CBBD5]/40 transition-all duration-500 overflow-hidden min-h-[280px] flex flex-col justify-end">
                                <div className="absolute top-6 right-6 w-24 h-24 md:w-32 md:h-32 bg-[#4CBBD5]/20 rounded-full blur-[40px] group-hover:bg-[#4CBBD5]/30 transition-all duration-700" />
                                <div className="absolute top-10 right-10 w-12 h-12 md:w-16 md:h-16 bg-cyan-300/30 rounded-full blur-[20px] animate-pulse" />

                                <div className="relative z-10">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#4CBBD5]/70 uppercase">Phénomène</span>
                                    <h4 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">Bioluminescence</h4>
                                    <p className="text-white/60 text-sm max-w-md">90% des créatures abyssales produisent leur propre lumière pour chasser, communiquer ou se défendre.</p>
                                </div>
                            </div>

                            {/* Colonne droite - 2 cartes empilées */}
                            <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
                                {/* Stat card */}
                                <div className="group relative bg-white/[0.03] rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex-1">
                                    <Microscope className="w-8 h-8 text-emerald-400 mb-4 opacity-80" />
                                    <div className="text-4xl md:text-5xl font-mono font-bold text-emerald-400 mb-2">1951</div>
                                    <p className="text-white/50 text-sm">Expédition Galathéa : première preuve de vie au fond des fosses.</p>
                                </div>

                                {/* Fact card */}
                                <div className="group relative bg-white/[0.03] rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex-1">
                                    <Fish className="w-8 h-8 text-amber-400 mb-4 opacity-80" />
                                    <div className="text-4xl md:text-5xl font-mono font-bold text-amber-400 mb-2">90%</div>
                                    <p className="text-white/50 text-sm">Des océans restent inexplorés. Un monde à découvrir.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ZONE 3: GÉOPOLITIQUE & STRATÉGIE */}
                <section className="w-full relative overflow-hidden py-12 md:py-16">
                    {/* Simple gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4CBBD5]/5 to-transparent pointer-events-none" />

                    <div className="px-4 md:px-20 max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
                            <div className="section-header">
                                <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">03. ENJEUX</span>
                                <h3 className="text-3xl md:text-5xl font-light uppercase">Enjeux Maritimes</h3>
                                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-4xl md:text-5xl font-mono font-bold text-[#4CBBD5] mb-1">9.5 M</div>
                                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider">km² de ZEE Française</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Globe, title: "La ZEE Française", desc: "Avec 11 millions de km², la France possède le 2ème domaine maritime mondial. Un atout géopolitique majeur qui implique des responsabilités immenses." },
                                { icon: ShieldAlert, title: "Câbles Sous-marins", desc: "99% des communications mondiales passent sous la mer. La surveillance et la protection de ces artères vitales est un enjeu de souveraineté." },
                                { icon: Database, title: "Ressources Minérales", desc: "Terres rares, nodules polymétalliques... Les grands fonds attirent les convoitises. Faut-il les exploiter ou les sanctuariser ?" }
                            ].map((card, i) => (
                                <div key={i} className="border-l-2 border-white/10 pl-6 hover:border-[#4CBBD5] transition-colors duration-300 group">
                                    <card.icon className="w-8 h-8 mb-4 text-[#4CBBD5] opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <h4 className="font-bold text-xl mb-3 text-white group-hover:text-[#4CBBD5] transition-colors">{card.title}</h4>
                                    <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ZONE 4: L'HISTOIRE À TOULON */}
                <section className="px-4 md:px-20 max-w-7xl mx-auto w-full">
                    <div className="section-header mb-16 md:mb-24 flex flex-col items-start text-left">
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">04. ANCRAGE TERRITORIAL</span>
                        <h3 className="text-3xl md:text-5xl font-light uppercase">Toulon, Terre de Pionniers</h3>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                    </div>

                    <div className="relative">
                        {/* Central Line (Hidden on Mobile) */}
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 ml-2 md:ml-0 hidden md:block" />
                        {/* Mobile Left Line */}
                        <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10 md:hidden" />

                        <div className="space-y-12 md:space-y-24">
                            {[
                                { year: "1888", title: "Le Gymnote", desc: "Lancement au Mourillon du premier sous-marin électrique opérationnel de l'histoire." },
                                { year: "1943", title: "Les Mousquemers", desc: "Cousteau, Tailliez et Dumas inventent la plongée autonome moderne dans la rade." },
                                { year: "1953", title: "Records du FNRS III", desc: "Le bathyscaphe réalise des plongées historiques en Méditerranée, repoussant les limites." },
                                { year: "1985", title: "Ifremer Méditerranée", desc: "La Seyne devient un pôle mondial pour la robotique sous-marine et l'exploration." },
                                { year: "2024", title: "Drones Grands Fonds", desc: "Déploiement de la nouvelle flotte autonome (UlyX, AsterX) pour cartographier les abysses." }
                            ].map((item, i) => (
                                <div key={i} className="timeline-item relative flex flex-col md:grid md:grid-cols-2 md:gap-20 items-start md:items-center pl-8 md:pl-0">
                                    {/* Dot */}
                                    <div className="absolute left-0 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#020A19] border-2 border-[#4CBBD5] rounded-full md:-translate-x-1/2 ml-[0.15rem] md:ml-0 z-10 top-2 md:top-auto" />

                                    {/* Date */}
                                    <div className={`w-full ${i % 2 === 0 ? 'md:text-right md:pr-0' : 'md:order-2 md:text-left'}`}>
                                        <span className="text-4xl md:text-8xl font-serif font-bold text-white block leading-none mb-1 md:mb-0">{item.year}</span>
                                    </div>

                                    {/* Content */}
                                    <div className={`w-full ${i % 2 === 0 ? 'md:text-left' : 'md:order-1 md:text-right'}`}>
                                        <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-[#4CBBD5]">{item.title}</h3>
                                        <p className="text-white/60 text-sm md:text-lg leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    );
}
