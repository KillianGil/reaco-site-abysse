/**
 * Page : Visiter le Musée ABYSSE (Expositions et Parcours)
 *
 * DESCRIPTION :
 * Page de présentation du parcours de visite du musée organisé en 4 zones thématiques :
 * 1. Grande Halle des Engins - Véhicules sous-marins historiques
 * 2. Biodiversité - Vie abyssale et spécimens des grands fonds
 * 3. Enjeux Maritimes - Géopolitique et ressources océaniques
 * 4. Ancrage Territorial - Histoire maritime de Toulon
 *
 * ANIMATIONS :
 * - Hero : Fade-in du titre principal avec délai
 * - Cartes de contenu : Apparition en stagger (décalage progressif)
 * - Timeline : Animation alternée depuis les côtés gauche/droit
 * - Particules : Mouvement flottant continu pour la zone biodiversité
 * - Parallax : Effet de profondeur sur les lumières ambiantes
 *
 * STRUCTURE VISUELLE :
 * - Hero immersif avec gradient et effets de lumière
 * - Zones identifiées par numérotation (01, 02, 03, 04)
 * - Grilles responsive : Mobile 1 colonne, Desktop 2-3 colonnes
 * - Cartes interactives avec hover effects (bordure, scale, couleur)
 *
 * DONNÉES DYNAMIQUES :
 * - techItems : Liste des engins sous-marins avec spécifications techniques
 * - Timeline Toulon : Dates clés de l'histoire maritime toulonnaise (1888-2024)
 *
 * TECHNOLOGIES :
 * - GSAP + ScrollTrigger pour toutes les animations au scroll
 * - Lucide React pour les icônes thématiques
 * - Tailwind CSS pour le styling responsive
 */
"use client";

import { Navbar, Footer } from "@/components/UI";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Anchor, Ship, Globe, Radio, Database, ShieldAlert, Fish, Waves, Zap } from "lucide-react";

// Enregistrer le plugin ScrollTrigger pour les animations au scroll
gsap.registerPlugin(ScrollTrigger);

/**
 * Composant principal de la page Expositions
 *
 * ARCHITECTURE :
 * - Hero section avec titre et description
 * - 4 sections thématiques avec animations spécifiques
 * - Footer de navigation
 *
 * ANIMATIONS GSAP :
 * - Hero title : Slide-up avec fade-in (power4.out)
 * - Section headers : Slide-in depuis la gauche
 * - Zone 1 cards : Stagger vertical avec délai progressif
 * - Zone 2 bio : Fade-up + particules flottantes infinies
 * - Zone 3 enjeux : Slide-up avec délai
 * - Zone 4 timeline : Slide alternée gauche/droite selon l'index
 * - Ambient lights : Parallax au scroll (scrub)
 *
 * RESPONSIVE :
 * - Mobile : Grilles 1 colonne, espacements réduits
 * - Desktop : Grilles 2-3 colonnes, effets hover avancés
 */
export default function ExpositionsPage() {
    // Référence au conteneur principal pour scoper les animations GSAP
    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * Hook d'effet pour initialiser toutes les animations GSAP
     *
     * CONTEXTE GSAP :
     * Toutes les animations sont créées dans un contexte GSAP pour faciliter le cleanup.
     * Le contexte est automatiquement nettoyé au démontage du composant.
     *
     * STRUCTURE DES ANIMATIONS :
     * 1. Hero : Animations d'entrée du titre et sous-titre
     * 2. Section headers : Slide-in depuis la gauche au scroll
     * 3. Zone 1 (Tech) : Cards en stagger vertical
     * 4. Zone 2 (Bio) : Cards + particules flottantes infinies
     * 5. Zone 3 (Enjeux) : Cards en stagger
     * 6. Zone 4 (Timeline) : Alternance gauche/droite
     * 7. Parallax : Mouvement des lumières ambiantes
     */
    useEffect(() => {
        const ctx = gsap.context(() => {
            // === HERO ANIMATIONS ===
            // Titre principal : montée depuis le bas avec fade-in
            gsap.from(".hero-title", { y: 100, opacity: 0, duration: 1.2, delay: 0.2, ease: "power4.out" });
            // Sous-titre : montée plus douce avec fade-in légèrement décalé
            gsap.from(".hero-subtitle", { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });

            // === SECTION HEADERS ===
            // Tous les headers de section apparaissent depuis la gauche au scroll
            // Trigger : quand le header arrive à 85% de la hauteur de l'écran
            gsap.utils.toArray<HTMLElement>(".section-header").forEach((header) => {
                gsap.from(header, {
                    scrollTrigger: { trigger: header, start: "top 85%" },
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // === ZONE 1: TECH CARDS (Engins sous-marins) ===
            // Les cartes techniques apparaissent en stagger (décalage progressif)
            // Chaque carte a un délai basé sur son index (0.08s par carte)
            gsap.utils.toArray<HTMLElement>(".zone-1-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: card, start: "top 85%" },
                    y: 40,
                    opacity: 0,
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: "power2.out"
                });
            });

            // === ZONE 2: BIO CARDS (Biodiversité) ===
            // Fade-up avec stagger plus prononcé pour les cartes de biodiversité
            gsap.utils.toArray<HTMLElement>(".zone-2-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: card, start: "top 85%" },
                    y: 50,
                    opacity: 0,
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: "power2.out"
                });
            });

            // === ZONE 2: PARTICULES FLOTTANTES ===
            // Animation infinie des particules pour simuler le plancton
            // yoyo: true fait osciller les particules de haut en bas
            // stagger: random décale aléatoirement le démarrage de chaque particule
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

            // === ZONE 3: ENJEUX CARDS (Géopolitique) ===
            // Slide-up avec délai plus long entre chaque carte (0.15s)
            gsap.utils.toArray<HTMLElement>(".zone-3-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: card, start: "top 85%" },
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    delay: i * 0.15,
                    ease: "power2.out"
                });
            });

            // === ZONE 4: TIMELINE (Histoire de Toulon) ===
            // Animation alternée : éléments pairs viennent de la gauche, impairs de la droite
            // Crée un effet de zigzag le long de la timeline centrale
            gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: { trigger: item, start: "top 80%" },
                    x: i % 2 === 0 ? -40 : 40, // Alternance gauche/droite selon l'index pair/impair
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });

            // === PARALLAX: AMBIENT LIGHTS ===
            // Effet de parallax sur les lumières d'ambiance
            // scrub: 1 lie directement l'animation au scroll (pas de délai)
            // Les lumières se déplacent vers le haut au scroll pour créer de la profondeur
            gsap.utils.toArray<HTMLElement>(".ambient-light").forEach((light) => {
                gsap.to(light, {
                    scrollTrigger: {
                        trigger: light,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    },
                    y: -100,
                    ease: "none"
                });
            });

        }, containerRef);

        // Cleanup : revert() supprime toutes les animations créées dans ce contexte
        return () => ctx.revert();
    }, []);

    /**
     * Données des engins sous-marins exposés dans la Grande Halle (Zone 1)
     *
     * STRUCTURE :
     * - name : Nom de l'engin ou du véhicule
     * - year : Année de mise en service ou de construction
     * - depth : Profondeur maximale atteinte (en mètres)
     * - desc : Description historique et technique
     * - icon : Composant d'icône Lucide React correspondant
     *
     * ÉVOLUTION HISTORIQUE :
     * La liste est ordonnée chronologiquement pour montrer l'évolution technologique :
     * 1. 1935 : Casabianca (80m) - Sous-marin militaire historique
     * 2. 1953 : FNRS III (4050m) - Record de plongée bathyscaphe
     * 3. 2024 : Drones ROV (6000m+) - Technologies modernes autonomes
     *
     * Cette progression illustre 90 ans d'innovation dans l'exploration sous-marine.
     */
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
            desc: "Les robots autonomes d'ECA Group et Ifremer. Ils descendent là où l'homme ne peut aller., jusqu'à plus de 6 000 mètres de profondeur, pour cartographier les fonds et prélever des échantillons.",
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
                                <div key={i} className="zone-1-card group relative bg-[#031525] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center rounded-xl overflow-hidden">
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

                {/* ZONE 2: BIODIVERSITÉ */}
                <section className="px-4 md:px-12 max-w-[1400px] mx-auto w-full relative py-12 md:py-16">
                    {/* Particules discrètes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                        <div className="bio-particle absolute top-[20%] left-[10%] w-1 h-1 bg-[#4CBBD5] rounded-full blur-[1px]" />
                        <div className="bio-particle absolute top-[60%] left-[25%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full blur-[1px]" />
                        <div className="bio-particle absolute top-[40%] right-[20%] w-1 h-1 bg-[#4CBBD5] rounded-full blur-[1px]" />
                        <div className="bio-particle absolute bottom-[30%] right-[15%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full blur-[1px]" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start relative z-10">
                        {/* Left: Content (cartes) */}
                        <div className="w-full lg:w-2/3 space-y-6 order-2 lg:order-1">
                            {/* Spécimens Abyssaux - carte principale */}
                            <div className="zone-2-card group relative bg-[#031525] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#4CBBD5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-6 md:p-8 relative z-10">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-[#4CBBD5]/10 rounded-full flex items-center justify-center shrink-0">
                                            <Fish className="w-6 h-6 text-[#4CBBD5]" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#4CBBD5]/70 uppercase">Dans cet espace</span>
                                            <h4 className="text-xl md:text-2xl font-bold text-white mt-1">Spécimens Abyssaux</h4>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        Collection de créatures des grands fonds : méduses bioluminescentes, poissons des abysses, organismes extrêmophiles prélevés lors d&apos;expéditions scientifiques.
                                    </p>
                                </div>
                            </div>

                            {/* Grid 2 colonnes pour les sous-thèmes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Zones de profondeur */}
                                <div className="zone-2-card group relative bg-[#031525] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 rounded-xl overflow-hidden p-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4CBBD5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Waves className="w-8 h-8 text-[#4CBBD5] mb-4" strokeWidth={1.5} />
                                        <h5 className="text-lg font-bold text-white mb-2 group-hover:text-[#4CBBD5] transition-colors">Zones de Profondeur</h5>
                                        <p className="text-white/50 text-sm leading-relaxed">Voyage à travers les strates océaniques : de la zone photique éclairée aux abysses hadales à 11 000 m.</p>
                                    </div>
                                </div>

                                {/* Adaptations extrêmes */}
                                <div className="zone-2-card group relative bg-[#031525] border border-white/10 hover:border-[#4CBBD5] transition-all duration-500 rounded-xl overflow-hidden p-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4CBBD5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Zap className="w-8 h-8 text-[#4CBBD5] mb-4" strokeWidth={1.5} />
                                        <h5 className="text-lg font-bold text-white mb-2 group-hover:text-[#4CBBD5] transition-colors">Adaptations Extrêmes</h5>
                                        <p className="text-white/50 text-sm leading-relaxed">Bioluminescence, résistance à 1 100 bars de pression, gigantisme abyssal, métabolisme ralenti.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Header */}
                        <div className="w-full lg:w-1/3 lg:sticky lg:top-32 order-1 lg:order-2">
                            <div className="section-header mb-8 md:mb-10">
                                <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-3 md:mb-4">02. BIODIVERSITÉ</span>
                                <h3 className="text-3xl md:text-5xl font-light uppercase">Vie Abyssale</h3>
                                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#4CBBD5] to-transparent mt-3 md:mt-4" />
                                <p className="mt-4 md:mt-6 text-white/60 text-sm md:text-base leading-relaxed border-l-2 border-[#4CBBD5]/30 pl-4 md:pl-6">
                                    Dans l&apos;obscurité absolue des grands fonds, la vie a développé des adaptations extraordinaires pour survivre.
                                </p>
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
                                <div key={i} className="zone-3-card border-l-2 border-white/10 pl-6 hover:border-[#4CBBD5] transition-colors duration-300 group">
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
