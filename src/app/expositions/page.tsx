"use client";

import { Navbar } from "@/components/UI";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Anchor, Ship, Globe, Microscope, Radio, Navigation, Database, ShieldAlert, Fish, Droplets } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ExpositionsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animations
            gsap.from(".hero-badge", { y: 20, opacity: 0, duration: 1, ease: "power3.out" });
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
            name: "Bathyscaphe FNRS III",
            year: "1953",
            depth: "4050m",
            desc: "Le pionnier absolu. Détenteur du record historique, objet d'un projet de restauration majeur.",
            icon: Anchor
        },
        {
            name: "Archimède",
            year: "1961",
            depth: "11000m",
            desc: "Le successeur légendaire. Conçu pour atteindre les points les plus profonds du globe.",
            icon: Ship
        },
        {
            name: "Drones & ROV",
            year: "2024",
            depth: "6000m+",
            desc: "Les robots autonomes d'ECA Group et Ifremer. Ils descendent là où l'homme ne peut aller.",
            icon: Radio
        }
    ];

    return (
        <main ref={containerRef} className="min-h-screen bg-[#020A19] text-white selection:bg-[#4CBBD5] selection:text-[#020A19] overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/20 to-[#020A19] pointer-events-none" />

                <div className="relative z-10 space-y-6 md:space-y-10 max-w-5xl mx-auto">
                    <div className="hero-badge inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#4CBBD5]/10 border border-[#4CBBD5]/30 rounded-full backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CBBD5] animate-pulse" />
                        <span className="text-[#4CBBD5] text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase">
                            Parcours & Collections
                        </span>
                    </div>

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

            {/* Global Museum Path Line */}
            <div className="fixed left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4CBBD5]/20 to-transparent pointer-events-none z-0 hidden md:block" />

            <div className="space-y-20 md:space-y-32 pb-20 md:pb-32 relative z-10">

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

                            {/* Interactive Simulation CTA */}
                            <div className="group cursor-pointer border border-[#4CBBD5]/30 bg-[#4CBBD5]/5 p-4 md:p-5 hover:bg-[#4CBBD5]/10 transition-all duration-300 rounded-lg">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-[#4CBBD5] text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Simulation</span>
                                    <Navigation className="w-4 h-4 text-[#4CBBD5]" />
                                </div>
                                <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2">PILOTE D&apos;ÉLITE</h4>
                                <div className="flex items-center gap-2 text-xs text-white/60 group-hover:text-white transition-colors">
                                    <span>Prendre les commandes</span>
                                    <div className="w-6 h-px bg-[#4CBBD5] group-hover:w-10 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Right: The Exhibits */}
                        <div className="w-full lg:w-2/3 space-y-3 md:space-y-4">
                            {techItems.map((item, i) => (
                                <div key={i} className="group relative bg-[#020A19] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center rounded-xl overflow-hidden">
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

                {/* ZONE 2: BIODIVERSITÉ & ABYSSES */}
                <section className="px-4 md:px-20 max-w-7xl mx-auto w-full relative">
                    <div className="section-header mb-10 md:mb-16 relative z-10 text-left md:text-right">
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">02. BIODIVERSITÉ</span>
                        <h3 className="text-3xl md:text-5xl font-light uppercase">La Vie dans le Noir</h3>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r md:bg-gradient-to-l from-[#4CBBD5] to-transparent mt-3 md:mt-4 md:ml-auto" />
                        <p className="mt-4 md:mt-6 text-white/60 max-w-xl md:ml-auto leading-relaxed text-sm md:text-base">
                            &quot;Un monde froid, obscur, bizarre... mais vivant.&quot; Plongez dans l&apos;écosystème le plus hostile de la planète.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            { icon: Microscope, title: "La Preuve par 10 000", desc: "L'histoire du navire Galathéa et la découverte d'anémones vivantes à 10 000m de fond." },
                            { icon: Droplets, title: "Ressources du Futur", desc: "Découverte des ressources biologiques abyssales et leur potentiel pour la pharmacie." },
                            { icon: Fish, title: "Comprendre pour Protéger", desc: "Sensibilisation à la fragilité de ces écosystèmes extrêmes face aux enjeux environnementaux." }
                        ].map((card, i) => (
                            <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 h-full shadow-2xl">
                                {/* Enhanced Backgrounds */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#4CBBD5]/5 to-[#020A19] opacity-50" />
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4CBBD5]/20 rounded-full blur-3xl group-hover:bg-[#4CBBD5]/30 transition-colors duration-700" />

                                <div className="p-6 md:p-8 relative z-10 h-full flex flex-col">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:border-[#4CBBD5]/50 group-hover:shadow-[0_0_15px_rgba(76,187,213,0.3)] transition-all duration-500">
                                        <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[#4CBBD5] transition-colors" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 leading-tight group-hover:text-[#4CBBD5] transition-colors">{card.title}</h3>
                                    <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 flex-1 border-t border-white/5 pt-4">
                                        {card.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-[#4CBBD5] text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <span>Explorer</span>
                                        <div className="w-4 h-px bg-[#4CBBD5]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ZONE 3: GÉOPOLITIQUE & STRATÉGIE */}
                <section className="w-full bg-[#020A19] relative overflow-hidden py-16 md:py-24 border-y border-[#4CBBD5]/10">
                    {/* Radar Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
                        <div className="w-[300px] md:w-[800px] h-[300px] md:h-[800px] border border-[#4CBBD5] rounded-full absolute radar-scan" />
                        <div className="w-[200px] md:w-[600px] h-[200px] md:h-[600px] border border-[#4CBBD5] rounded-full absolute" />
                        <div className="w-[100px] md:w-[400px] h-[100px] md:h-[400px] border border-[#4CBBD5] rounded-full absolute" />
                        <div className="w-full h-px bg-[#4CBBD5]/50 absolute top-1/2 left-0" />
                        <div className="h-full w-px bg-[#4CBBD5]/50 absolute top-0 left-1/2" />
                    </div>

                    <div className="px-4 md:px-20 max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
                            <div className="section-header">
                                <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">03. SOUVERAINETÉ</span>
                                <h3 className="text-3xl md:text-5xl font-light uppercase">Espions des Océans</h3>
                                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-4xl md:text-5xl font-mono font-bold text-[#4CBBD5] mb-1">9.5 M</div>
                                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider">km² de ZEE Française</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {[
                                { icon: Globe, title: "Géant Maritime", desc: "Comprendre les enjeux de la 2ème Zone Économique Exclusive mondiale.", status: "STRATÉGIQUE" },
                                { icon: ShieldAlert, title: "Guerre des Câbles", desc: "Protection des infrastructures vitales et prévention des exploitations illégales.", status: "MENACE ACTIVE", alert: true },
                                { icon: Database, title: "Ressources Minérales", desc: "Convoitises autour des grands fonds et choix stratégiques pour leur exploitation.", status: "EN ANALYSE" }
                            ].map((card, i) => (
                                <div key={i} className={`bg-[#020A19]/90 backdrop-blur border p-5 md:p-6 transition-all duration-300 group relative overflow-hidden rounded-lg ${card.alert ? 'border-red-500/30 hover:border-red-500' : 'border-white/10 hover:border-[#4CBBD5]'}`}>
                                    <div className={`absolute top-0 right-0 px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase rounded-bl-lg ${card.alert ? 'bg-red-500/20 text-red-500' : 'bg-[#4CBBD5]/10 text-[#4CBBD5]'}`}>
                                        {card.status}
                                    </div>
                                    <card.icon className={`w-6 h-6 md:w-8 md:h-8 mb-4 md:mb-6 ${card.alert ? 'text-red-500' : 'text-[#4CBBD5]'}`} />
                                    <h4 className="font-bold text-lg md:text-xl mb-2 md:mb-3">{card.title}</h4>
                                    <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4">{card.desc}</p>

                                    <div className={`h-px w-full ${card.alert ? 'bg-red-500/20' : 'bg-[#4CBBD5]/20'}`} />
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
                                { year: "1888", title: "Le Gymnote", desc: "Premier sous-marin électrique, construit et naviguant au Mourillon." },
                                { year: "1943", title: "Les Mousquemers", desc: "Cousteau, Tailliez, Dumas inventent la plongée autonome moderne dans la rade." },
                                { year: "1953", title: "Records du FNRS III", desc: "Premiers records établis au large de Toulon, profitant des grands fonds à proximité." }
                            ].map((item, i) => (
                                <div key={i} className="timeline-item relative flex flex-col md:grid md:grid-cols-2 md:gap-20 items-start md:items-center pl-8 md:pl-0">
                                    {/* Dot */}
                                    <div className="absolute left-0 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#020A19] border-2 border-[#4CBBD5] rounded-full md:-translate-x-1/2 ml-[0.15rem] md:ml-0 z-10 top-2 md:top-auto" />

                                    {/* Date */}
                                    <div className={`w-full ${i % 2 === 0 ? 'md:text-right md:pr-0' : 'md:order-2 md:text-left'}`}>
                                        <span className="text-4xl md:text-8xl font-serif font-bold text-white/20 block leading-none mb-1 md:mb-0">{item.year}</span>
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
        </main>
    );
}
