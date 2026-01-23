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

                {/* ZONE 2: BIODIVERSITÉ - Design organique bioluminescent */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    {/* Background océan profond avec gradient complexe */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#041C30] via-[#01060D] to-[#041C30]" />

                    {/* Effet de lumière radiale centrale */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(76,187,213,0.15),transparent)]" />

                    {/* Particules bioluminescentes améliorées */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Grandes méduses lumineuses */}
                        <div className="bio-particle absolute top-[15%] left-[8%] w-16 h-16 bg-[#4CBBD5]/20 rounded-full blur-[30px] opacity-70" />
                        <div className="bio-particle absolute top-[45%] right-[12%] w-20 h-20 bg-emerald-400/15 rounded-full blur-[35px] opacity-60" />
                        <div className="bio-particle absolute bottom-[25%] left-[15%] w-14 h-14 bg-violet-400/20 rounded-full blur-[25px] opacity-50" />

                        {/* Petites particules scintillantes */}
                        <div className="bio-particle absolute top-[25%] left-[20%] w-1 h-1 bg-cyan-300 rounded-full blur-[1px] opacity-80" />
                        <div className="bio-particle absolute top-[60%] left-[30%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full blur-[1px] opacity-70" />
                        <div className="bio-particle absolute top-[35%] right-[25%] w-1 h-1 bg-emerald-300 rounded-full blur-[1px] opacity-60" />
                        <div className="bio-particle absolute bottom-[40%] right-[35%] w-2 h-2 bg-violet-300 rounded-full blur-[2px] opacity-50" />
                        <div className="bio-particle absolute top-[70%] left-[40%] w-1 h-1 bg-cyan-400 rounded-full opacity-90" />
                        <div className="bio-particle absolute top-[50%] right-[45%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full opacity-70" />
                    </div>

                    <div className="relative z-10 px-4 md:px-8 max-w-[1600px] mx-auto">
                        {/* Header avec typographie expressive */}
                        <div className="text-center mb-16 md:mb-24">
                            <span className="inline-block text-[#4CBBD5] text-xs font-bold tracking-[0.4em] uppercase mb-6 relative">
                                <span className="absolute -left-8 top-1/2 w-6 h-px bg-[#4CBBD5]/40" />
                                02. BIODIVERSITÉ
                                <span className="absolute -right-8 top-1/2 w-6 h-px bg-[#4CBBD5]/40" />
                            </span>

                            <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif italic mb-6 leading-[1.1]">
                                <span className="text-white/90">La Vie dans le</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#4CBBD5] via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                                    Royaume de l&apos;Ombre
                                </span>
                            </h3>

                            <p className="text-white/40 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                                À <span className="text-[#4CBBD5] font-mono">10 000 m</span> sous la surface, là où règne l&apos;obscurité absolue et la pression écrasante,
                                <br className="hidden md:block" />
                                <span className="text-white/60 italic">la vie invente ses propres lois.</span>
                            </p>
                        </div>

                        {/* Layout organique en constellation */}
                        <div className="relative max-w-[1400px] mx-auto">
                            {/* Carte principale - Bioluminescence (flottante, asymétrique) */}
                            <div className="group relative mb-8 md:mb-12 md:ml-[5%]">
                                <div className="relative bg-gradient-to-br from-[#4CBBD5]/5 via-transparent to-emerald-500/5 backdrop-blur-sm rounded-[3rem] p-10 md:p-14 border border-[#4CBBD5]/30 hover:border-[#4CBBD5]/60 transition-all duration-700 overflow-hidden max-w-4xl">
                                    {/* Effets de lumière internes animés */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#4CBBD5]/30 via-cyan-400/20 to-transparent rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000" />
                                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-[50px] opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-violet-400/10 rounded-full blur-[40px] animate-pulse" />

                                    {/* Cercles décoratifs */}
                                    <div className="absolute top-8 right-12 w-2 h-2 rounded-full bg-[#4CBBD5] opacity-60 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="absolute bottom-12 right-20 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-50 group-hover:scale-150 transition-transform duration-500 delay-100" />
                                    <div className="absolute top-20 left-16 w-1 h-1 rounded-full bg-violet-300 opacity-70 group-hover:scale-150 transition-transform duration-500 delay-200" />

                                    <div className="relative z-10">
                                        <div className="flex items-start gap-6 mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-[#4CBBD5]/10 border border-[#4CBBD5]/30 flex items-center justify-center group-hover:bg-[#4CBBD5]/20 group-hover:border-[#4CBBD5]/50 transition-all duration-500">
                                                <div className="w-8 h-8 rounded-full bg-[#4CBBD5] blur-[8px] animate-pulse" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-mono tracking-[0.2em] text-[#4CBBD5]/60 uppercase block mb-2">Phénomène Abyssal</span>
                                                <h4 className="text-4xl md:text-5xl font-serif italic text-white mb-1 group-hover:text-[#4CBBD5] transition-colors duration-500">Bioluminescence</h4>
                                            </div>
                                        </div>

                                        <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
                                            <span className="text-[#4CBBD5] font-bold text-2xl md:text-3xl">90%</span> des créatures abyssales produisent leur propre lumière —
                                            <span className="italic text-white/80"> un ballet de lucioles vivantes dans l&apos;abîme éternel.</span>
                                        </p>

                                        <div className="flex gap-8 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[#4CBBD5] blur-[2px]" />
                                                <span className="text-white/50">Communication</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-400 blur-[2px]" />
                                                <span className="text-white/50">Chasse</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-violet-400 blur-[2px]" />
                                                <span className="text-white/50">Défense</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cartes satellites en constellation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:mr-[5%]">
                                {/* Carte 1 - Expédition Galathea */}
                                <div className="group relative">
                                    <div className="relative bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-emerald-400/40 transition-all duration-500 overflow-hidden h-full">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-400/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

                                        <div className="relative z-10">
                                            <Microscope className="w-12 h-12 text-emerald-400 mb-6 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />

                                            <div className="mb-4">
                                                <div className="text-7xl md:text-8xl font-serif italic text-emerald-400 leading-none mb-2 group-hover:scale-105 transition-transform duration-500 origin-left">1951</div>
                                                <div className="h-px w-20 bg-gradient-to-r from-emerald-400/60 to-transparent" />
                                            </div>

                                            <h5 className="text-xl md:text-2xl font-bold text-white/90 mb-3 group-hover:text-emerald-400 transition-colors duration-500">Expédition Galathéa</h5>
                                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                                Première preuve irréfutable de vie au fond des fosses océaniques.
                                                <span className="text-white/80 italic"> La science repousse l&apos;impossible.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Carte 2 - Océans inexplorés */}
                                <div className="group relative md:mt-12">
                                    <div className="relative bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm rounded-[2.5rem] p-8 md:p-10 border border-white/10 hover:border-violet-400/40 transition-all duration-500 overflow-hidden h-full">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/0 to-violet-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-violet-400/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

                                        <div className="relative z-10">
                                            <Fish className="w-12 h-12 text-violet-400 mb-6 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />

                                            <div className="mb-4">
                                                <div className="text-7xl md:text-8xl font-serif italic text-violet-400 leading-none mb-2 group-hover:scale-105 transition-transform duration-500 origin-left">90%</div>
                                                <div className="h-px w-20 bg-gradient-to-r from-violet-400/60 to-transparent" />
                                            </div>

                                            <h5 className="text-xl md:text-2xl font-bold text-white/90 mb-3 group-hover:text-violet-400 transition-colors duration-500">Terra Incognita</h5>
                                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                                Des océans demeurent inexplorés. Un monde parallèle sous nos pieds.
                                                <span className="text-white/80 italic"> Chaque plongée révèle l&apos;inédit.</span>
                                            </p>
                                        </div>
                                    </div>
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
