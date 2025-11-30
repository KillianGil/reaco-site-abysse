"use client";

import { Navbar } from "@/components/UI";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, FlaskConical, Cog, Anchor, Mail, ArrowRight, Microscope, Atom, Ship, Radio, Target } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function PartenairesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeInst, setActiveInst] = useState<number | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animations (Restored)
            gsap.from(".hero-badge", { y: 20, opacity: 0, duration: 1, ease: "power3.out" });
            gsap.from(".hero-title", { y: 100, opacity: 0, duration: 1.2, delay: 0.2, ease: "power4.out" });

            // Section headers slide in (Added)
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

            // Hexagons animation
            gsap.utils.toArray<HTMLElement>(".hex-item").forEach((hex, i) => {
                gsap.from(hex, {
                    scrollTrigger: { trigger: hex, start: "top 85%" },
                    scale: 0,
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "back.out(1.5)"
                });
            });

            // Blueprint lines drawing
            gsap.from(".blueprint-line", {
                scrollTrigger: { trigger: ".blueprint-section", start: "top 70%" },
                width: 0,
                duration: 1.5,
                ease: "power2.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const institutions = [
        {
            category: "L'ÉTAT",
            name: "Ministères",
            details: "Armées • Transition Écologique • Recherche",
            role: "Soutien National"
        },
        {
            category: "RÉGION",
            name: "Sud PACA",
            details: "Provence-Alpes-Côte d'Azur",
            role: "Partenaire Régional"
        },
        {
            category: "DÉPARTEMENT",
            name: "Var",
            details: "Conseil Départemental du Var",
            role: "Ancrage Territorial"
        },
        {
            category: "MÉTROPOLE",
            name: "TPM & Ville",
            details: "Toulon Provence Méditerranée",
            role: "Soutien Local"
        },
    ];

    return (
        <main ref={containerRef} className="min-h-screen bg-[#020A19] text-white selection:bg-[#4CBBD5] selection:text-[#020A19] overflow-x-hidden">
            <Navbar />

            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Section (Restored) */}
            <section className="relative h-[60vh] flex flex-col justify-center items-center text-center px-6 z-10">
                {/* Extended Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/20 to-[#020A19]" />


                <div className="relative z-10 space-y-6 max-w-4xl">
                    <div className="hero-badge inline-block px-6 py-2 bg-[#4CBBD5]/10 border border-[#4CBBD5]/30 rounded-full">
                        <span className="text-[#4CBBD5] text-sm font-bold tracking-[0.3em] uppercase">
                            Partenaires & Soutiens
                        </span>
                    </div>

                    <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
                        Une Ambition<br />
                        <span className="font-serif italic text-white/80">Collective</span>
                    </h1>

                    <p className="hero-title text-xl text-white/70 max-w-2xl mx-auto">
                        Institutions, Sciences & Industries
                    </p>
                </div>
            </section>

            <div className="space-y-32 pb-32">

                {/* 1. INSTITUTIONS - Interactive List (Clarified) */}
                <section className="px-6 md:px-20 max-w-7xl mx-auto w-full">
                    <div className="section-header mb-16">
                        <span className="text-[#4CBBD5] text-xs font-bold tracking-[0.3em] uppercase block mb-4">01. INSTITUTIONS</span>
                        <h3 className="text-4xl md:text-5xl font-light">Soutien Public</h3>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                    </div>

                    <div className="flex flex-col">
                        {institutions.map((inst, i) => (
                            <div
                                key={i}
                                className="group relative border-b border-white/10 py-8 cursor-pointer transition-all duration-500 hover:border-[#4CBBD5] hover:pl-4"
                                onMouseEnter={() => setActiveInst(i)}
                                onMouseLeave={() => setActiveInst(null)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-4">
                                    <div className="flex items-baseline gap-6">
                                        <span className="font-mono text-xs text-[#4CBBD5] w-24">{inst.category}</span>
                                        <h3 className="text-3xl md:text-4xl font-light group-hover:text-white transition-colors text-white/80">
                                            {inst.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:-translate-x-4 md:group-hover:translate-x-0">
                                        <span className="text-sm text-white/60 text-right hidden md:block">{inst.details}</span>
                                        <div className="px-3 py-1 rounded-full border border-[#4CBBD5]/30 bg-[#4CBBD5]/10 text-[#4CBBD5] text-xs font-bold whitespace-nowrap">
                                            {inst.role}
                                        </div>
                                    </div>
                                </div>

                                {/* Background Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#4CBBD5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. SCIENCES - Hexagonal Hive (Clarified) */}
                <section className="px-6 relative">
                    <div className="absolute inset-0 bg-[#4CBBD5]/5 skew-y-3 transform -z-10" />
                    <div className="max-w-7xl mx-auto py-10">
                        <div className="section-header text-center mb-20 flex flex-col items-center">
                            <span className="text-[#4CBBD5] text-xs font-bold tracking-[0.3em] uppercase block mb-4">02. SCIENCES</span>
                            <h3 className="text-4xl md:text-5xl font-light">Excellence Scientifique</h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                            <p className="text-white/60 mt-6 max-w-2xl mx-auto text-lg italic">"Un écosystème de recherche complet, des abysses à la surface"</p>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            {/* Ifremer */}
                            <div className="hex-item w-72 h-80 relative group">
                                <div className="absolute inset-0 bg-[#006994]/20 clip-hex backdrop-blur-sm border-2 border-[#4CBBD5]/30 group-hover:bg-[#4CBBD5]/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                    <FlaskConical className="w-12 h-12 text-[#4CBBD5] mb-6 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-2xl font-bold mb-2">Ifremer</h4>
                                    <div className="w-8 h-1 bg-[#4CBBD5] mb-4" />
                                    <p className="text-sm text-white/80">Expertise Océanique</p>
                                    <p className="text-xs text-white/50 mt-2">"Des abysses à la surface"</p>
                                </div>
                            </div>

                            {/* Université */}
                            <div className="hex-item w-72 h-80 relative group mt-0 md:mt-24">
                                <div className="absolute inset-0 bg-[#006994]/20 clip-hex backdrop-blur-sm border-2 border-[#4CBBD5]/30 group-hover:bg-[#4CBBD5]/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                    <Microscope className="w-12 h-12 text-[#4CBBD5] mb-6 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-2xl font-bold mb-2">Université</h4>
                                    <div className="w-8 h-1 bg-[#4CBBD5] mb-4" />
                                    <p className="text-sm text-white/80">Recherche & Formation</p>
                                    <p className="text-xs text-white/50 mt-2">SeaTech & Ingénierie</p>
                                </div>
                            </div>

                            {/* CNRS */}
                            <div className="hex-item w-72 h-80 relative group">
                                <div className="absolute inset-0 bg-[#006994]/20 clip-hex backdrop-blur-sm border-2 border-[#4CBBD5]/30 group-hover:bg-[#4CBBD5]/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                    <Atom className="w-12 h-12 text-[#4CBBD5] mb-6 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-2xl font-bold mb-2">CNRS</h4>
                                    <div className="w-8 h-1 bg-[#4CBBD5] mb-4" />
                                    <p className="text-sm text-white/80">Laboratoires</p>
                                    <p className="text-xs text-white/50 mt-2">Excellence Nationale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. INDUSTRIE - Technical Blueprint (Clarified) */}
                <section className="blueprint-section px-6 md:px-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    <div className="max-w-7xl mx-auto">
                        <div className="section-header mb-12 relative z-10">
                            <span className="text-[#4CBBD5] text-xs font-bold tracking-[0.3em] uppercase block mb-4">03. INDUSTRIE</span>
                            <h3 className="text-4xl md:text-5xl font-light">Leaders Technologiques</h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                        </div>

                        <div className="relative z-10 border border-[#4CBBD5]/30 bg-[#020A19]/90 backdrop-blur-md p-8 md:p-12">
                            {/* Technical Markers */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#4CBBD5]" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#4CBBD5]" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#4CBBD5]" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#4CBBD5]" />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Main Partner */}
                                <div className="lg:col-span-2 border-r border-white/10 pr-0 lg:pr-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[#4CBBD5] font-mono text-xs">PARTENAIRE MAJEUR</span>
                                        <Ship className="text-[#4CBBD5] w-6 h-6" />
                                    </div>
                                    <h3 className="text-5xl font-bold mb-4">NAVAL GROUP</h3>
                                    <div className="h-px w-full bg-[#4CBBD5]/30 mb-6 blueprint-line" />
                                    <p className="text-lg text-white/80 leading-relaxed mb-6">
                                        Leader mondial du naval de défense et héritier des arsenaux de Toulon. Un soutien historique et technologique pour le projet.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#4CBBD5]/5 p-3 border-l-2 border-[#4CBBD5]">
                                            <span className="block text-xs text-[#4CBBD5] font-bold">DOMAINE</span>
                                            <span className="text-sm">Défense Navale</span>
                                        </div>
                                        <div className="bg-[#4CBBD5]/5 p-3 border-l-2 border-[#4CBBD5]">
                                            <span className="block text-xs text-[#4CBBD5] font-bold">IMPLANTATION</span>
                                            <span className="text-sm">Toulon (Historique)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Partners */}
                                <div className="space-y-6">
                                    <span className="text-[#4CBBD5] font-mono text-xs block mb-4">ÉCOSYSTÈME INDUSTRIEL</span>

                                    <div className="group border border-white/10 p-4 hover:border-[#4CBBD5] transition-colors cursor-default">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Cog className="w-5 h-5 text-[#4CBBD5]" />
                                            <h5 className="font-bold">Pôle Mer Méditerranée</h5>
                                        </div>
                                        <p className="text-xs text-white/60">Cluster d'innovation maritime et économie bleue</p>
                                    </div>

                                    <div className="group border border-white/10 p-4 hover:border-[#4CBBD5] transition-colors cursor-default">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Radio className="w-5 h-5 text-[#4CBBD5]" />
                                            <h5 className="font-bold">ECA Group</h5>
                                        </div>
                                        <p className="text-xs text-white/60">Leader en robotique et drones sous-marins</p>
                                    </div>

                                    <div className="group border border-white/10 p-4 hover:border-[#4CBBD5] transition-colors cursor-default">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-[#4CBBD5] font-bold">●</div>
                                            <h5 className="font-bold">Orange Marine</h5>
                                        </div>
                                        <p className="text-xs text-white/60">Expert mondial des câbles sous-marins</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MARINE - Radar Interface (Clarified) */}
                <section className="px-6 md:px-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Radar Visual */}
                        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                {/* Radar Circles */}
                                <div className="absolute inset-0 rounded-full border border-[#4CBBD5]/20" />
                                <div className="absolute inset-[15%] rounded-full border border-[#4CBBD5]/20" />
                                <div className="absolute inset-[30%] rounded-full border border-[#4CBBD5]/20" />
                                <div className="absolute inset-[45%] rounded-full bg-[#4CBBD5]/10 backdrop-blur-md flex items-center justify-center z-20 shadow-[0_0_30px_rgba(76,187,213,0.2)]">
                                    <Anchor className="w-16 h-16 text-[#4CBBD5]" />
                                </div>

                                {/* Scanning Line */}
                                <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#4CBBD5]/30 to-transparent absolute top-0 left-0 origin-bottom-right animate-spin-slow" />
                                </div>

                                {/* Orbiting Items */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020A19] px-4 py-2 border border-[#4CBBD5] rounded-full z-30 shadow-lg">
                                    <span className="text-[#4CBBD5] font-bold text-sm tracking-wider">MARINE NATIONALE</span>
                                </div>

                                <div className="absolute bottom-[20%] right-[5%] text-right z-30 bg-[#020A19]/80 backdrop-blur px-3 py-1 rounded border border-white/10">
                                    <h5 className="text-white font-bold text-sm">CEPHISMER</h5>
                                    <p className="text-[10px] text-[#4CBBD5]">Plongée Humaine</p>
                                </div>

                                <div className="absolute top-[30%] left-[0%] z-30 bg-[#020A19]/80 backdrop-blur px-3 py-1 rounded border border-white/10">
                                    <h5 className="text-white font-bold text-sm">SNA</h5>
                                    <p className="text-[10px] text-[#4CBBD5]">Sous-marins</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="order-1 lg:order-2">
                            <div className="section-header mb-8">
                                <span className="text-[#4CBBD5] text-xs font-bold tracking-[0.3em] uppercase block mb-4">04. DÉFENSE</span>
                                <h3 className="text-4xl md:text-5xl font-light">Partenaire Stratégique</h3>
                                <div className="h-1 w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-4" />
                            </div>
                            <p className="text-lg text-white/80 leading-relaxed mb-8">
                                Une collaboration historique avec la <span className="text-white font-bold">base de défense de Toulon</span>, premier port militaire français. Ce partenariat ancre le projet au cœur de la souveraineté nationale.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[#4CBBD5]" />
                                    <div>
                                        <h5 className="font-bold text-white">Expertise Opérationnelle</h5>
                                        <p className="text-sm text-white/60">Lien direct avec les unités d'intervention sous-marine.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[#4CBBD5]" />
                                    <div>
                                        <h5 className="font-bold text-white">Patrimoine Unique</h5>
                                        <p className="text-sm text-white/60">Valorisation de l'histoire des sous-marins nucléaires.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CTA (Restored & Enhanced) */}
                <section className="px-6 pb-20 max-w-7xl mx-auto">
                    <div className="relative p-16 rounded-3xl bg-gradient-to-br from-[#4CBBD5]/20 to-[#006994]/10 border-2 border-[#4CBBD5]/50 overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CBBD5]/10 rounded-full blur-3xl" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="w-20 h-20 mx-auto mb-8 bg-[#4CBBD5]/20 rounded-2xl flex items-center justify-center border border-[#4CBBD5]/30">
                                <Mail className="w-10 h-10 text-[#4CBBD5]" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-4xl md:text-5xl font-light mb-6">Rejoignez l'Aventure</h3>
                            <p className="text-xl text-white/70 mb-10">
                                Associez votre image à un projet porteur de sens, alliant innovation, écologie et patrimoine maritime.
                            </p>

                            <a
                                href="mailto:partenariats@musee-abysse.fr"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4CBBD5] to-[#006994] text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:shadow-[0_0_40px_rgba(76,187,213,0.5)] hover:scale-105 transition-all duration-300"
                            >
                                <Mail className="w-5 h-5" />
                                <span>Nous Contacter</span>
                            </a>
                            <p className="text-white/40 text-sm mt-6 font-mono">
                                partenariats@musee-abysse.fr
                            </p>
                        </div>
                    </div>
                </section>

            </div>

            <style jsx>{`
        .clip-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </main>
    );
}
