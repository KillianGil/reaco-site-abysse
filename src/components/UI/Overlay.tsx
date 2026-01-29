/**
 * Composant : Overlay narratif principal (Overlay)
 *
 * DESCRIPTION :
 * Couche narrative principale du site, superposée au canvas Three.js en arrière-plan.
 * Contient 6 sections racontant l'histoire du musée ABYSSE, avec animations GSAP
 * déclenchées au scroll et effets interactifs Framer Motion.
 *
 * STRUCTURE NARRATIVE (6 SECTIONS) :
 * 1. Section1Surface : Hero avec titre ABYSSE, introduction du musée
 * 2. Section2Histoire : Histoire de la plongée à Toulon (texte à gauche)
 * 3. Section3Casabianca : Présentation du sous-marin (texte à droite)
 * 4. Section4Experience : Expériences VR et immersives (texte à gauche)
 * 5. Section5Biodiversite : Biodiversité des abysses (texte à droite)
 * 6. Section6Contact : Contact, partenaires, footer
 *
 * TECHNOLOGIES D'ANIMATION :
 * - GSAP (GreenSock) : Animations timeline pour les apparitions progressives
 * - ScrollTrigger : Déclenchement des animations basé sur le scroll
 * - Framer Motion : Effets hover interactifs sur les cartes et boutons
 *
 * MISE EN PAGE :
 * - Grille 12 colonnes responsive
 * - Alternance gauche/droite pour rythme visuel
 * - Hauteurs minimales (min-h) pour espacement vertical
 * - Snap scroll pour navigation fluide
 *
 * DESIGN SYSTEM :
 * - Couleur accent : #4CBBD5 (cyan océanique)
 * - Typographie : Font light pour titres, medium pour corps
 * - Espacements généreux (py-32) entre sections
 * - Lignes séparatrices horizontales (h-px bg-white/10)
 *
 * Z-INDEX :
 * - z-[5] : Au-dessus du canvas 3D (z-0) et des décorations (z-[3])
 * - Sous la navbar (z-100) et le loader (z-200)
 *
 * PERFORMANCE :
 * - useEffect avec cleanup (ctx.revert()) pour éviter fuites mémoire GSAP
 * - Animations optimisées avec ScrollTrigger.scrub
 * - Refs pour ciblage direct des éléments DOM
 *
 * ACCESSIBILITÉ :
 * - IDs sur les sections pour navigation par ancres (#histoire, #musee, etc.)
 * - Snap scroll pour expérience guidée
 * - Transitions fluides pour éviter motion sickness
 */
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

/**
 * Enregistrement du plugin ScrollTrigger de GSAP
 *
 * NÉCESSITÉ :
 * ScrollTrigger n'est pas inclus par défaut dans GSAP.
 * Cette ligne active le plugin pour pouvoir utiliser scrollTrigger dans les animations.
 *
 * ALTERNATIVE :
 * Sans cette ligne, les animations scroll ne fonctionneraient pas
 * et génèreraient des erreurs console.
 */
gsap.registerPlugin(ScrollTrigger);

/**
 * Composant principal : Conteneur des 6 sections narratives
 *
 * ARCHITECTURE :
 * - Conteneur relatif avec z-[5] (au-dessus du canvas 3D)
 * - pt-20 : Padding top pour compenser la hauteur de la navbar
 * - Chaque section est un composant séparé pour organisation modulaire
 *
 * AVANTAGES DE LA MODULARISATION :
 * - Chaque section gère ses propres animations GSAP
 * - Facilite la maintenance et les modifications
 * - Permet l'isolation des bugs (une section cassée n'affecte pas les autres)
 * - Améliore la lisibilité du code (6 fonctions de ~100 lignes vs 1 de 600)
 *
 * ORDRE NARRATIF :
 * Surface (introduction) -> Histoire -> Musée -> Expérience -> Biodiversité -> Contact
 * Chaque section approfondit progressivement la thématique sous-marine.
 */
export function Overlay() {
  return (
    <div className="relative z-[5] pt-20">
      <Section1Surface />
      <Section2Histoire />
      <Section3Casabianca />
      <Section4Experience />
      <Section5Biodiversite />
      <Section6Contact />
    </div>
  );
}

// ============================================
// SECTION 1 : ACCUEIL (HERO)
// ============================================
/**
 * Section 1 : Hero avec titre ABYSSE
 *
 * FONCTION :
 * Page d'accueil plein écran introduisant le musée avec le titre principal ABYSSE
 * en grande typographie. Animation d'entrée au chargement + parallax au scroll.
 *
 * ANIMATIONS :
 * 1. ENTRÉE (timeline) :
 *    - Titre ABYSSE : Chaque lettre apparaît avec effet 3D (rotateX, y, opacity)
 *    - Textes secondaires : Apparition progressive avec stagger (délai 0.5s)
 *
 * 2. PARALLAX (scroll) :
 *    - Section monte et disparaît pendant le scroll (y: -150, opacity: 0)
 *    - scrub: 1.5 pour mouvement fluide suivant le scroll
 *
 * MISE EN PAGE :
 * - min-h-screen : Hauteur minimale 100vh (plein écran)
 * - flex items-center justify-center : Centrage vertical et horizontal
 * - -mt-32 md:-mt-64 : Décalage vers le haut pour meilleur centrage visuel
 *
 * ÉLÉMENTS :
 * - 2 lignes verticales décoratives (left-[10%] et left-[90%])
 * - Titre ABYSSE avec perspective 3D
 * - Baseline : "Le Monde des Profondeurs"
 * - Description courte
 * - Séparateur "Découvrir" en bas
 */
function Section1Surface() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  /**
   * Hook : Configuration des animations GSAP d'entrée et de parallax
   *
   * TIMELINE D'ENTRÉE :
   * - delay: 0.5s (attend que le loader disparaisse)
   * - Étape 1 : Animation des lettres du titre ABYSSE
   *   - fromTo : De {opacity: 0, y: 80, rotateX: -40} vers {opacity: 1, y: 0, rotateX: 0}
   *   - stagger: 0.08s (80ms de décalage entre chaque lettre)
   *   - duration: 1.2s, ease: "power3.out" (décélération fluide)
   * - Étape 2-4 : Apparition des textes secondaires
   *   - Classes .surface-1, .surface-2, .surface-3
   *   - Décalage -=0.5, -=0.4, -=0.3 (chevauchement avec l'animation précédente)
   *
   * PARALLAX AU SCROLL :
   * - scrollTrigger : Déclenché quand la section atteint le haut (start: "top top")
   * - y: -150 : Monte de 150px
   * - opacity: 0 : Disparaît progressivement
   * - scrub: 1.5 : Suit le scroll avec lissage (1.5s de latence)
   *
   * CLEANUP :
   * ctx.revert() au démontage pour nettoyer tous les listeners GSAP
   * Évite les fuites mémoire et les bugs de navigation
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        tl.fromTo(chars,
          { opacity: 0, y: 80, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.08, ease: "power3.out" }
        );
      }

      tl.fromTo(".surface-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
      tl.fromTo(".surface-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
      tl.fromTo(".surface-3", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");

      gsap.to(sectionRef.current, {
        y: -150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const title = "ABYSSE";

  return (
    <section ref={sectionRef} className="min-h-screen md:min-h-[130vh] flex items-center justify-center relative overflow-hidden snap-start">
      {/**
       * Lignes verticales décoratives
       *
       * FONCTION :
       * 2 lignes verticales fines encadrant le contenu (style interface technique)
       *
       * POSITIONNEMENT :
       * - absolute inset-0 : Couvre toute la section
       * - left-[10%] et left-[90%] : Positionnées à 10% et 90% de la largeur
       * - top-0 bottom-0 : Hauteur totale de la section
       *
       * STYLE :
       * - w-px : Largeur 1px (ligne fine)
       * - bg-white/5 : Blanc très transparent (discret)
       * - pointer-events-none : Ne bloque pas les interactions
       * - opacity-50 : Transparence supplémentaire pour effet subtil
       */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-white/5" />
        <div className="absolute left-[90%] top-0 bottom-0 w-px bg-white/5" />
      </div>

      <div className="text-center px-4 md:px-8 max-w-3xl -mt-32 md:-mt-64">
        {/**
         * Label supérieur : "Musée Sous-Marin • Toulon"
         *
         * STYLE :
         * - text-[8px] md:text-[10px] : Très petit (8-10px)
         * - uppercase : Tout en majuscules
         * - tracking-[0.5em] : Espacement lettres très large (50%)
         * - text-white/50 : Blanc semi-transparent
         * - drop-shadow-md : Ombre portée pour lisibilité
         *
         * ANIMATION :
         * Classe .surface-1 ciblée par GSAP (première apparition après le titre)
         */}
        <p className="surface-1 text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-white/50 mb-4 md:mb-6 drop-shadow-md font-medium">
          Musée Sous-Marin • Toulon
        </p>

        {/**
         * Titre principal : ABYSSE avec effet 3D
         *
         * TYPOGRAPHIE :
         * - text-[clamp(3rem,12vw,10rem)] : Taille responsive (min 3rem, max 10rem)
         * - font-light : Poids léger pour élégance
         * - tracking-wide : Espacement lettres modéré
         * - leading-[0.9] : Interligne serré (90% de la hauteur)
         *
         * EFFET 3D :
         * - perspective: "800px" : Profondeur 3D pour les rotations
         * - Chaque lettre dans un span.char avec transformStyle: "preserve-3d"
         * - Permet l'animation rotateX individuellement sur chaque lettre
         *
         * ANIMATION :
         * Ref titleRef permet à GSAP de cibler les .char individuellement
         * Chaque lettre apparaît avec rotation 3D (-40deg -> 0deg)
         */}
        <h1
          ref={titleRef}
          className="text-[clamp(3rem,12vw,10rem)] font-light tracking-wide leading-[0.9] text-white mb-6 md:mb-8 drop-shadow-lg"
          style={{ perspective: "800px" }}
        >
          {title.split("").map((char, i) => (
            <span key={i} className="char inline-block" style={{ transformStyle: "preserve-3d" }}>
              {char}
            </span>
          ))}
        </h1>

        {/**
         * Baseline : "Le Monde des Profondeurs."
         *
         * STYLE :
         * - text-base md:text-xl : Taille moyenne responsive
         * - font-medium : Poids moyen pour emphase
         * - tracking-wide : Espacement lettres large
         * - text-white/70 : Blanc légèrement transparent
         *
         * ANIMATION :
         * Classe .surface-2 (deuxième vague d'apparition)
         */}
        <p className="surface-2 text-base md:text-xl font-medium tracking-wide text-white/70 mb-4 md:mb-5 drop-shadow-md">
          Le Monde des Profondeurs.
        </p>

        {/**
         * Description courte
         *
         * CONTENU :
         * "Une expérience immersive unique pour découvrir les mystères des profondeurs océaniques."
         *
         * STYLE :
         * - text-xs md:text-sm : Petit texte
         * - leading-relaxed : Interligne aéré (1.625)
         * - text-white/50 : Très transparent (discret)
         * - max-w-xs md:max-w-md : Largeur limitée pour lisibilité
         * - mx-auto : Centré horizontalement
         *
         * ANIMATION :
         * Classe .surface-3 (troisième vague d'apparition)
         */}
        <p className="surface-3 text-xs md:text-sm font-medium leading-relaxed text-white/50 max-w-xs md:max-w-md mx-auto drop-shadow-sm">
          Une expérience immersive unique pour découvrir les mystères des profondeurs océaniques.
        </p>

        {/**
         * Séparateur "Découvrir"
         *
         * STRUCTURE :
         * - 2 lignes horizontales encadrant le mot "Découvrir"
         * - flex items-center justify-center gap-3 : Disposition horizontale centrée
         *
         * LIGNES :
         * - w-8 md:w-10 : Largeur 32-40px
         * - h-px : Hauteur 1px
         * - bg-white/30 : Blanc semi-transparent
         *
         * TEXTE :
         * - text-[8px] md:text-[9px] : Très petit
         * - uppercase tracking-[0.25em] : Majuscules espacées
         * - text-white/50 : Discret
         *
         * ANIMATION :
         * Classe .surface-3 (apparaît en même temps que la description)
         */}
        <div className="surface-3 mt-10 md:mt-14 flex items-center justify-center gap-3">
          <div className="w-8 md:w-10 h-px bg-white/30" />
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-white/50 font-medium">Découvrir</span>
          <div className="w-8 md:w-10 h-px bg-white/30" />
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 2 : L'HISTOIRE (TEXTE À GAUCHE)
// ============================================
/**
 * Section 2 : Histoire de la plongée à Toulon
 *
 * FONCTION :
 * Présente l'histoire de Toulon comme berceau de la plongée autonome moderne.
 * Contenu : Invention du scaphandre autonome par Cousteau, Tailliez, Dumas en 1943.
 *
 * ANIMATIONS :
 * - 6 éléments apparaissent progressivement au scroll (stagger 0.1s)
 * - Déclenchement : start: "top 55%" (quand la section atteint 55% du viewport)
 * - toggleActions: "play none none reverse" (rejouable en arrière)
 *
 * MISE EN PAGE :
 * - Grille 12 colonnes
 * - Contenu dans colonnes 2-6 (5 colonnes, côté gauche)
 * - Colonnes 7-12 vides (espace pour canvas 3D visible)
 *
 * ÉLÉMENTS :
 * - Marqueur numérique "01"
 * - Titre : "TERRE DE PIONNIERS"
 * - Texte historique sur les Mousquemers
 * - Carte statistique : "1943 - Invention du scaphandre autonome" (hover animé)
 *
 * DESIGN :
 * - Ligne séparatrice horizontale en haut (h-px bg-white/10)
 * - Hauteur minimale 150vh pour espacement vertical généreux
 * - ID #histoire pour navigation par ancre
 */
function Section2Histoire() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Hook : Animation GSAP déclenchée au scroll
   *
   * LOGIQUE :
   * - gsap.context() : Scope GSAP pour cleanup automatique
   * - Boucle sur 6 classes CSS : .hist-depth, .hist-marker, .hist-title, etc.
   * - Chaque élément apparaît avec fromTo (opacity 0->1, y 50->0)
   * - delay: i * 0.1 : Stagger de 100ms entre chaque élément
   *
   * SCROLLTRIGGER :
   * - trigger: sectionRef.current : Déclenche quand cette section entre dans le viewport
   * - start: "top 55%" : Activation quand le haut de la section atteint 55% du viewport
   * - toggleActions: "play none none reverse" :
   *   - onEnter: play (joue l'animation)
   *   - onLeave: none (ne fait rien)
   *   - onEnterBack: none (ne fait rien)
   *   - onLeaveBack: reverse (inverse l'animation)
   *
   * CLEANUP :
   * ctx.revert() nettoie tous les ScrollTriggers et animations au démontage
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".hist-depth", ".hist-marker", ".hist-title", ".hist-tagline", ".hist-body", ".hist-stat"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[150vh] relative snap-start" id="histoire">
      {/**
       * Ligne séparatrice horizontale en haut de section
       *
       * FONCTION :
       * Sépare visuellement les sections (style minimaliste)
       *
       * POSITIONNEMENT :
       * - absolute top-0 : En haut de la section
       * - left-[10%] right-[10%] : Largeur 80% (marges latérales 10%)
       *
       * STYLE :
       * - h-px : Hauteur 1px (ligne fine)
       * - bg-white/10 : Blanc très transparent
       */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[150vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        {/**
         * Colonne de contenu (gauche)
         *
         * GRILLE :
         * - col-span-12 : Pleine largeur sur mobile
         * - md:col-span-5 : 5 colonnes sur desktop
         * - md:col-start-2 : Commence à la colonne 2 (marge gauche d'1 colonne)
         *
         * CENTRAGE VERTICAL :
         * - flex flex-col justify-center : Centré verticalement dans les 150vh
         */}
        <div className="col-span-12 md:col-span-5 md:col-start-2 flex flex-col justify-center">

          {/**
           * Label section : "L'Histoire"
           *
           * STYLE :
           * - text-4xl : Grande taille (36px)
           * - font-light : Poids léger
           * - text-[#4CBBD5] : Couleur cyan (accent)
           * - drop-shadow-md : Ombre portée pour relief
           *
           * ANIMATION :
           * Classe .hist-depth ciblée par GSAP (première apparition)
           */}
          <div className="hist-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">L&apos;Histoire</span>
          </div>

          {/**
           * Marqueur numérique : "01 — Toulon, berceau de la plongée"
           *
           * STRUCTURE :
           * - Numéro "01" en cyan monospace
           * - Ligne de séparation horizontale (10px)
           * - Label descriptif en uppercase
           *
           * STYLE :
           * - flex items-center gap-3 : Disposition horizontale avec espacement
           * - font-mono : Police monospace pour le numéro (style technique)
           *
           * ANIMATION :
           * Classe .hist-marker (deuxième apparition, delay 0.1s)
           */}
          <div className="hist-marker flex items-center gap-3 mb-5">
            <span className="text-[#4CBBD5] font-mono text-xs">01</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Toulon, berceau de la plongée</span>
          </div>

          {/**
           * Titre principal : "TERRE DE PIONNIERS"
           *
           * TYPOGRAPHIE :
           * - text-4xl md:text-5xl : Taille responsive (36-48px)
           * - font-light : Poids léger pour élégance
           * - tracking-tight : Espacement lettres serré (-0.025em)
           * - <br /> : Retour à la ligne pour "TERRE DE" / "PIONNIERS"
           *
           * ANIMATION :
           * Classe .hist-title (troisième apparition, delay 0.2s)
           */}
          <h2 className="hist-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            TERRE DE<br />PIONNIERS
          </h2>

          {/**
           * Baseline : "Là où tout a commencé."
           *
           * STYLE :
           * - text-base : Taille moyenne (16px)
           * - font-medium italic : Poids moyen + italique pour emphase
           * - text-[#4CBBD5]/90 : Cyan à 90% d'opacité
           *
           * ANIMATION :
           * Classe .hist-tagline (quatrième apparition, delay 0.3s)
           */}
          <p className="hist-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Là où tout a commencé.
          </p>

          {/**
           * Texte historique principal
           *
           * CONTENU :
           * Histoire de l'invention de la plongée autonome en 1943 à Toulon
           * par les "Mousquemers" (Cousteau, Tailliez, Dumas).
           *
           * STYLE :
           * - text-sm : Petit texte (14px)
           * - font-medium : Poids moyen pour lisibilité
           * - leading-[1.9] : Interligne large (190% pour confort lecture)
           * - text-white/60 : Blanc à 60% d'opacité (discret)
           * - max-w-sm : Largeur max 384px (optimale pour lecture)
           *
           * ANIMATION :
           * Classe .hist-body (cinquième apparition, delay 0.4s)
           */}
          <p className="hist-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-sm drop-shadow-sm">
            1943. C&apos;est dans la rade de Toulon que les &quot;Mousquemers&quot; — Cousteau, Tailliez, Dumas —
            inventent la plongée autonome moderne. De Jules Verne au Bathyscaphe FNRS III,
            cette terre est le berceau de la conquête sous-marine mondiale.
          </p>

          {/**
           * Carte statistique : "1943"
           *
           * STRUCTURE :
           * - Grande année "1943" en cyan
           * - Label "Invention du scaphandre autonome"
           *
           * FRAMER MOTION :
           * - whileHover : scale 1.02 + changement de fond au survol
           * - Chiffre "1943" passe à scale 1.1 + couleur cyan au hover
           * - transition: duration 0.2s pour fluidité
           *
           * STYLE :
           * - p-5 : Padding généreux (20px)
           * - border-l-2 border-[#4CBBD5]/60 : Bordure gauche cyan
           * - bg-white/[0.03] : Fond blanc très transparent
           * - backdrop-blur-sm : Flou d'arrière-plan (effet verre)
           * - cursor-pointer : Indique l'interactivité
           *
           * ANIMATION :
           * Classe .hist-stat (sixième et dernière apparition, delay 0.5s)
           */}
          <motion.div
            className="hist-stat p-5 border-l-2 border-[#4CBBD5]/60 bg-white/[0.03] backdrop-blur-sm cursor-pointer"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="block text-3xl font-light text-white mb-1"
              whileHover={{ scale: 1.1, color: "#4CBBD5" }}
              transition={{ duration: 0.2 }}
            >
              1943
            </motion.span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 font-medium">
              Invention du scaphandre autonome
            </span>
          </motion.div>
        </div>

        {/**
         * Colonne vide (droite)
         *
         * FONCTION :
         * Espace vide pour laisser visible le canvas Three.js en arrière-plan.
         * Sur mobile, n'existe pas (col-span-12 uniquement).
         *
         * GRILLE :
         * - col-span-12 : Pleine largeur sur mobile (inexistant, caché par contenu)
         * - md:col-span-6 : 6 colonnes sur desktop (moitié droite de l'écran)
         */}
        <div className="col-span-12 md:col-span-6" />
      </div>
    </section>
  );
}

// ============================================
// SECTION 3 : LE CASABIANCA (TEXTE À DROITE)
// ============================================
/**
 * Section 3 : Présentation du sous-marin Casabianca
 *
 * FONCTION :
 * Présente la pièce maîtresse du musée : le sous-marin nucléaire d'attaque (SNA) Casabianca.
 * Contenu : Caractéristiques techniques (2600 tonnes, 73m, 70 hommes d'équipage).
 *
 * PARTICULARITÉ :
 * Contenu aligné à DROITE (inversion par rapport à la section précédente).
 * Crée un rythme visuel gauche/droite pour dynamiser la navigation.
 *
 * ANIMATIONS :
 * - 6 éléments apparaissent avec effet x: 20 (depuis la droite)
 * - Déclenchement : start: "top 50%" (plus tôt que section 2)
 *
 * MISE EN PAGE :
 * - Colonne vide à gauche (col-span-5)
 * - Contenu à droite (col-span-6)
 * - md:items-end md:text-right : Alignement à droite sur desktop
 *
 * ÉLÉMENTS :
 * - Marqueur "02 — Pièce maîtresse"
 * - Titre : "LE CASABIANCA"
 * - 3 cartes statistiques en grille : 2600 tonnes, 73m, 70 hommes
 *
 * ID :
 * #musee pour navigation par ancre
 */
function Section3Casabianca() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Hook : Animation GSAP avec effet de glissement depuis la droite
   *
   * DIFFÉRENCE AVEC SECTION 2 :
   * - x: 20 en plus de y: 50 (glissement horizontal depuis la droite)
   * - start: "top 50%" au lieu de "top 55%" (déclenche plus tôt)
   *
   * CLASSES CIBLÉES :
   * .casa-depth, .casa-marker, .casa-title, .casa-tagline, .casa-body, .casa-stats
   *
   * ANIMATION :
   * fromTo { opacity: 0, y: 50, x: 20 } -> { opacity: 1, y: 0, x: 0 }
   * Stagger 0.1s entre chaque élément
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".casa-depth", ".casa-marker", ".casa-title", ".casa-tagline", ".casa-body", ".casa-stats"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50, x: 20 },
          {
            opacity: 1, y: 0, x: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 50%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[160vh] relative snap-start" id="musee">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[160vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        {/**
         * Espace vide à gauche
         *
         * FONCTION :
         * Laisse la moitié gauche vide pour :
         * - Laisser visible le canvas 3D
         * - Créer un rythme visuel (alternance gauche/droite)
         * - Équilibrer la composition
         *
         * GRILLE :
         * - col-span-12 : Pleine largeur sur mobile (contenu après)
         * - md:col-span-5 : 5 colonnes vides sur desktop
         */}
        <div className="col-span-12 md:col-span-5" />

        {/**
         * Contenu aligné à droite
         *
         * ALIGNEMENT :
         * - md:items-end : Alignement horizontal à droite (flexbox)
         * - md:text-right : Texte aligné à droite
         * - flex-row-reverse sur le marqueur : Inverse l'ordre (numéro à droite)
         *
         * GRILLE :
         * - col-span-12 : Pleine largeur sur mobile
         * - md:col-span-6 : 6 colonnes sur desktop (moitié droite)
         */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center md:items-end md:text-right">

          <div className="casa-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">Le Musée</span>
          </div>

          {/**
           * Marqueur "02" avec inversion sur desktop
           *
           * PARTICULARITÉ :
           * - md:flex-row-reverse : Inverse l'ordre sur desktop
           * - Sur mobile : 02 — Pièce maîtresse (ordre normal)
           * - Sur desktop : Pièce maîtresse — 02 (ordre inversé pour alignement droite)
           */}
          <div className="casa-marker flex items-center gap-3 mb-5 md:flex-row-reverse">
            <span className="text-[#4CBBD5] font-mono text-xs">02</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Pièce maîtresse</span>
          </div>

          {/**
           * Titre : "LE CASABIANCA"
           *
           * TYPOGRAPHIE :
           * - text-4xl md:text-6xl : Plus grand que section 2 (60px sur desktop)
           * - Retour à la ligne entre "LE" et "CASABIANCA"
           */}
          <h2 className="casa-title text-4xl md:text-6xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            LE<br />CASABIANCA
          </h2>

          <p className="casa-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Une cathédrale technologique sous les flots.
          </p>

          {/**
           * Description du sous-marin
           *
           * CONTENU :
           * Présentation du SNA (Sous-marin Nucléaire d'Attaque) :
           * - 2600 tonnes
           * - Désarmé et transformé en espace d'exposition
           * - Symbole du génie naval français
           *
           * LARGEUR :
           * - max-w-md : Largeur max 448px (plus large que section 2 pour plus de contenu)
           */}
          <p className="casa-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-md drop-shadow-sm">
            Pièce maîtresse du musée : un véritable Sous-marin Nucléaire d&apos;Attaque (SNA) de 2 600 tonnes,
            désarmé et transformé en espace d&apos;exposition. Explorez les entrailles de ce chasseur silencieux,
            symbole du génie naval français.
          </p>

          {/**
           * Grille de statistiques : 3 cartes
           *
           * DONNÉES :
           * 1. 2 600 tonnes (poids du sous-marin)
           * 2. 73 mètres (longueur)
           * 3. 70 hommes (équipage)
           *
           * GRILLE :
           * - grid grid-cols-3 gap-3 : 3 colonnes égales, espacement 12px
           * - w-full max-w-md : Pleine largeur avec limite 448px
           *
           * FRAMER MOTION :
           * - whileHover : scale 1.05 + fond cyan + bordure cyan
           * - Chiffre interne : scale 1.1 au hover
           * - Effet : Mise en avant de la carte survolée
           *
           * STYLE :
           * - p-4 : Padding généreux
           * - border border-white/10 : Bordure fine transparente
           * - bg-white/[0.02] backdrop-blur-sm : Fond vitré très subtil
           * - text-center : Texte centré dans chaque carte
           */}
          <div className="casa-stats grid grid-cols-3 gap-3 w-full max-w-md">
            {[
              { value: "2 600", label: "Tonnes" },
              { value: "73", label: "Mètres" },
              { value: "70", label: "Hommes" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-4 border border-white/10 text-center bg-white/[0.02] backdrop-blur-sm cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(76, 187, 213, 0.1)",
                  borderColor: "rgba(76, 187, 213, 0.3)"
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="block text-2xl font-light text-[#4CBBD5] mb-1"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-[8px] uppercase tracking-[0.1em] text-white/50 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4 : L'EXPÉRIENCE (TEXTE À GAUCHE)
// ============================================
/**
 * Section 4 : Expériences VR et immersives
 *
 * FONCTION :
 * Présente les technologies immersives du musée : simulateurs VR, ROV, parcours thématiques.
 * Partenariats : Ifremer, Naval Group.
 *
 * RETOUR À GAUCHE :
 * Contenu à gauche (comme section 2) pour rythme visuel alterné.
 *
 * ANIMATIONS :
 * - 6 éléments avec effet y: 50 (standard, sans x)
 * - start: "top 55%" (déclenchement modéré)
 *
 * ÉLÉMENTS :
 * - Marqueur "03 — Immersion totale"
 * - Titre : "PLONGEZ AU CŒUR DES ABYSSES"
 * - 2 cartes de fonctionnalités : Simulateurs VR + Parcours immersif
 *
 * ID :
 * #experience pour navigation par ancre
 */
function Section4Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Hook : Animation GSAP standard (similaire à section 2)
   *
   * CLASSES CIBLÉES :
   * .exp-depth, .exp-marker, .exp-title, .exp-tagline, .exp-body, .exp-features
   *
   * ANIMATION :
   * fromTo { opacity: 0, y: 50 } -> { opacity: 1, y: 0 }
   * Pas d'effet x (mouvement vertical uniquement)
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".exp-depth", ".exp-marker", ".exp-title", ".exp-tagline", ".exp-body", ".exp-features"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[145vh] relative snap-start" id="experience">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[145vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        <div className="col-span-12 md:col-span-5 md:col-start-2 flex flex-col justify-center">

          <div className="exp-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">L&apos;Expérience</span>
          </div>

          <div className="exp-marker flex items-center gap-3 mb-5">
            <span className="text-[#4CBBD5] font-mono text-xs">03</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Immersion totale</span>
          </div>

          <h2 className="exp-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            PLONGEZ AU<br />CŒUR DES ABYSSES
          </h2>

          <p className="exp-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Une aventure sensorielle unique.
          </p>

          {/**
           * Description des expériences technologiques
           *
           * CONTENU :
           * - Simulateurs de pilotage
           * - Expériences en réalité virtuelle
           * - Parcours immersifs
           * - Mention des partenaires : Ifremer, Naval Group
           *
           * LARGEUR :
           * max-w-sm : Largeur optimale pour lecture (384px)
           */}
          <p className="exp-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-sm drop-shadow-sm">
            Simulateurs de pilotage, expériences en réalité virtuelle, parcours immersifs...
            Découvrez les technologies françaises de pointe (Ifremer, Naval Group) et vivez
            l&apos;exploration sous-marine comme jamais auparavant.
          </p>

          {/**
           * Grille de fonctionnalités : 2 cartes
           *
           * DONNÉES :
           * 1. Simulateurs VR — Pilotez un ROV
           * 2. Parcours immersif — 6 zones thématiques
           *
           * GRILLE :
           * - grid grid-cols-2 gap-3 : 2 colonnes égales
           *
           * FRAMER MOTION :
           * - whileHover : scale 1.03 + fond plus opaque + blur renforcé
           * - Effet vitré (backdrop-filter: blur(12px)) au hover
           *
           * STYLE :
           * - p-4 : Padding généreux
           * - border border-white/10 : Bordure fine
           * - bg-white/[0.02] backdrop-blur-sm : Fond vitré très subtil
           * - cursor-pointer : Indique l'interactivité
           *
           * CONTENU :
           * - Titre de la fonctionnalité (text-sm font-medium)
           * - Sous-titre descriptif (text-[9px] text-white/50)
           */}
          <div className="exp-features grid grid-cols-2 gap-3">
            {[
              { title: "Simulateurs VR", sub: "Pilotez un ROV" },
              { title: "Parcours immersif", sub: "6 zones thématiques" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-4 border border-white/10 bg-white/[0.02] backdrop-blur-sm cursor-pointer"
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)"
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-sm font-medium text-white/90 mb-1 drop-shadow-sm">{feature.title}</span>
                <span className="text-[9px] text-white/50 font-medium">{feature.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6" />
      </div>
    </section>
  );
}

// ============================================
// SECTION 5 : BIODIVERSITÉ (TEXTE À DROITE)
// ============================================
/**
 * Section 5 : Biodiversité des abysses
 *
 * FONCTION :
 * Présente la vie dans les grandes profondeurs : bioluminescence, créatures extraordinaires.
 * Thème : Comprendre pour protéger ces écosystèmes fragiles.
 *
 * RETOUR À DROITE :
 * Contenu aligné à droite (comme section 3) pour alternance visuelle.
 *
 * ANIMATIONS :
 * - 6 éléments avec effet x: 20 (glissement depuis la droite)
 * - start: "top 50%" (déclenchement précoce)
 *
 * ÉLÉMENTS :
 * - Marqueur "04 — 90% inexploré"
 * - Titre : "LA VIE DANS L'OBSCURITÉ"
 * - Citation de Jacques-Yves Cousteau avec hover effect
 *
 * HAUTEUR :
 * min-h-[150vh] : Plus haute que section 4 pour espacement généreux
 */
function Section5Biodiversite() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Hook : Animation GSAP avec glissement depuis la droite
   *
   * CLASSES CIBLÉES :
   * .bio-depth, .bio-marker, .bio-title, .bio-tagline, .bio-body, .bio-quote
   *
   * ANIMATION :
   * fromTo { opacity: 0, y: 50, x: 20 } -> { opacity: 1, y: 0, x: 0 }
   * Identique à section 3 (effet de glissement horizontal)
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".bio-depth", ".bio-marker", ".bio-title", ".bio-tagline", ".bio-body", ".bio-quote"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50, x: 20 },
          {
            opacity: 1, y: 0, x: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 50%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[150vh] relative snap-start">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[150vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        <div className="col-span-12 md:col-span-5" />

        <div className="col-span-12 md:col-span-6 flex flex-col justify-center md:items-end md:text-right">

          <div className="bio-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">Les Abysses</span>
          </div>

          {/**
           * Marqueur "04 — 90% inexploré"
           *
           * PARTICULARITÉ :
           * Label "90% inexploré" fait référence au fait que 90% des océans
           * restent inexplorés par l'humanité.
           *
           * INVERSION :
           * md:flex-row-reverse pour alignement droite sur desktop
           */}
          <div className="bio-marker flex items-center gap-3 mb-5 md:flex-row-reverse">
            <span className="text-[#4CBBD5] font-mono text-xs">04</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">90% inexploré</span>
          </div>

          <h2 className="bio-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            LA VIE DANS<br />L&apos;OBSCURITÉ
          </h2>

          <p className="bio-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Un monde fascinant à découvrir.
          </p>

          {/**
           * Description de la biodiversité abyssale
           *
           * CONTENU :
           * - Bioluminescence (production de lumière par les organismes)
           * - Créatures extraordinaires (poissons abyssaux, méduses géantes, etc.)
           * - Écosystèmes uniques (cheminées hydrothermales, etc.)
           * - Message de protection environnementale
           *
           * LARGEUR :
           * max-w-md : Largeur max 448px pour contenu plus développé
           */}
          <p className="bio-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-md drop-shadow-sm">
            Bioluminescence, créatures extraordinaires, écosystèmes uniques... Les profondeurs
            océaniques abritent des merveilles que le musée vous invite à explorer. Comprendre
            ces environnements fragiles est essentiel pour les protéger.
          </p>

          {/**
           * Citation de Jacques-Yves Cousteau
           *
           * CONTENU :
           * "Un monde froid, obscur, bizarre... mais vivant."
           * — Jacques-Yves Cousteau
           *
           * FRAMER MOTION :
           * - whileHover : Fond légèrement plus opaque (0.06 au lieu de 0.03)
           * - transition: 0.3s (plus lent que les autres cartes pour effet subtil)
           *
           * STYLE :
           * - p-5 : Padding généreux
           * - border-r-2 border-[#4CBBD5]/40 : Bordure DROITE (au lieu de gauche)
           * - bg-white/[0.03] backdrop-blur-sm : Fond vitré très subtil
           * - max-w-md : Largeur max 448px
           *
           * TYPOGRAPHIE :
           * - Citation en italique (font-medium italic)
           * - Attribution en uppercase très petit (text-[9px])
           * - tracking-[0.12em] : Espacement lettres pour l'attribution
           *
           * ANIMATION :
           * Classe .bio-quote (sixième apparition, delay 0.5s)
           */}
          <motion.div
            className="bio-quote p-5 border-r-2 border-l-0 border-[#4CBBD5]/40 bg-white/[0.03] backdrop-blur-sm max-w-md"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium italic text-white/60 mb-2 drop-shadow-sm">
              &quot;Un monde froid, obscur, bizarre... mais vivant.&quot;
            </p>
            <span className="text-[9px] uppercase tracking-[0.12em] text-white/40 font-medium">
              — Jacques-Yves Cousteau
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6 : CONTACT & PARTENAIRES (FINALE)
// ============================================
/**
 * Section 6 : Contact, partenaires et footer
 *
 * FONCTION :
 * Section finale du site avec :
 * - Appel à l'action (Nous contacter, Dossier de presse)
 * - Liste des 4 partenaires principaux
 * - Footer avec copyright
 *
 * CENTRAGE :
 * Contenu centré horizontalement (contrairement aux sections précédentes)
 * flex flex-col items-center justify-center
 *
 * ANIMATIONS :
 * - 6 éléments apparaissent progressivement (stagger 0.08s, plus rapide)
 * - start: "top 55%" (déclenchement modéré)
 *
 * ÉLÉMENTS :
 * - Marqueur "05 — Contact"
 * - Titre : "NOUS RENCONTRER"
 * - 2 boutons CTA (Call-To-Action) avec effets shimmer/hover
 * - Grille 2x2 (ou 4 colonnes sur desktop) des partenaires
 * - Footer absolu en bas avec copyright
 *
 * IDs :
 * - #contact : Ancre pour navigation
 * - #partenaires : Ancre pour section partenaires (au sein de la section contact)
 *
 * HAUTEUR :
 * min-h-[140vh] : Hauteur généreuse pour section finale
 */
function Section6Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Hook : Animation GSAP standard avec stagger accéléré
   *
   * CLASSES CIBLÉES :
   * .contact-marker, .contact-title, .contact-body, .contact-info,
   * .contact-partners, .contact-footer
   *
   * DIFFÉRENCE :
   * - delay: i * 0.08 (80ms au lieu de 100ms) : Apparition plus rapide
   * - Pas d'effet x (contenu centré, pas de glissement horizontal)
   *
   * ANIMATION :
   * fromTo { opacity: 0, y: 40 } -> { opacity: 1, y: 0 }
   * y: 40 au lieu de 50 (mouvement plus subtil)
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".contact-marker", ".contact-title", ".contact-body", ".contact-info", ".contact-partners", ".contact-footer"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[140vh] flex flex-col items-center justify-center relative px-6 md:px-12 snap-start" id="contact">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="text-center max-w-xl" id="partenaires">

        <div className="contact-marker flex items-center justify-center gap-3 mb-8">
          <span className="text-[#4CBBD5] font-mono text-xs">05</span>
          <div className="w-10 h-px bg-white/20" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Contact</span>
        </div>

        <h2 className="contact-title text-4xl md:text-5xl font-light tracking-tight text-white mb-6 drop-shadow-lg">
          NOUS<br />RENCONTRER
        </h2>

        {/**
         * Description de la section contact
         *
         * CONTENU :
         * Invite les visiteurs à :
         * - En savoir plus sur le projet
         * - Devenir partenaire
         * - Poser des questions à l'équipe
         *
         * LARGEUR :
         * max-w-md mx-auto : Largeur max 448px, centré horizontalement
         */}
        <p className="contact-body text-sm font-medium leading-[1.9] text-white/60 mb-10 max-w-md mx-auto drop-shadow-sm">
          Le projet ABYSSE prend forme. Vous souhaitez en savoir plus, devenir partenaire
          ou simplement nous poser une question ? Contactez notre équipe.
        </p>

        {/**
         * Boutons d'action (CTA)
         *
         * STRUCTURE :
         * - flex flex-col sm:flex-row : Empilé sur mobile, côte à côte sur tablette+
         * - items-center justify-center gap-4 : Centré avec espacement
         *
         * BOUTONS :
         * 1. PRIMAIRE : "Nous contacter" (fond cyan #4CBBD5)
         *    - Effet shimmer au hover (bande de lumière qui traverse)
         *    - whileHover: scale 1.05, whileTap: scale 0.98
         *    - Lien vers /contact
         *
         * 2. SECONDAIRE : "Dossier de presse" (bordure blanche)
         *    - hover:bg-white/5 : Fond subtil au survol
         *    - whileHover: scale 1.05 + borderColor plus opaque
         *    - Lien href="#" (à définir)
         *
         * ANIMATION :
         * Classe .contact-info (quatrième apparition)
         */}
        <div className="contact-info flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          {/**
           * Bouton primaire : "Nous contacter"
           *
           * STYLE :
           * - bg-[#4CBBD5] : Fond cyan (couleur accent du site)
           * - text-[#020A19] : Texte sombre pour contraste avec fond cyan
           * - font-semibold : Poids gras pour emphase
           * - text-xs uppercase tracking-[0.1em] : Petit, majuscules, espacé
           *
           * EFFET SHIMMER :
           * - div absolu avec gradient de lumière (from-transparent via-white/30 to-transparent)
           * - -translate-x-full : Positionné hors du bouton à gauche
           * - group-hover:translate-x-full : Traverse le bouton vers la droite au hover
           * - duration-500 : Animation lente (500ms) pour effet de vague lumineuse
           *
           * FRAMER MOTION :
           * - whileHover: scale 1.05 : Agrandissement au survol
           * - whileTap: scale 0.98 : Réduction au clic (feedback tactile)
           */}
          <motion.a
            href="/contact"
            className="group relative px-6 py-3 bg-[#4CBBD5] text-[#020A19] font-semibold text-xs uppercase tracking-[0.1em] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">Nous contacter</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.a>

          {/**
           * Bouton secondaire : "Dossier de presse"
           *
           * STYLE :
           * - border border-white/20 : Bordure blanche fine
           * - text-white/70 : Texte blanc semi-transparent
           * - hover:bg-white/5 : Fond subtil au survol (CSS hover)
           *
           * FRAMER MOTION :
           * - whileHover: scale 1.05 + borderColor plus visible (0.4)
           * - whileTap: scale 0.98 : Feedback tactile au clic
           */}
          <motion.a
            href="#"
            className="px-6 py-3 border border-white/20 text-white/70 font-semibold text-xs uppercase tracking-[0.1em] hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Dossier de presse
          </motion.a>
        </div>

        {/**
         * Section partenaires
         *
         * STRUCTURE :
         * - pt-10 border-t : Séparation visuelle avec ligne horizontale
         * - max-w-lg mx-auto : Largeur max 512px, centré
         *
         * TITRE :
         * - text-[9px] uppercase tracking-[0.15em] : Très petit, majuscules, espacé
         * - text-white/40 : Très transparent (discret)
         *
         * GRILLE :
         * - grid grid-cols-2 md:grid-cols-4 gap-6 : 2 colonnes mobile, 4 desktop
         *
         * PARTENAIRES :
         * 1. Marine Nationale
         * 2. Région Sud (Provence-Alpes-Côte d'Azur)
         * 3. Naval Group (construction navale)
         * 4. Ifremer (Institut français de recherche pour l'exploitation de la mer)
         *
         * FRAMER MOTION :
         * - whileHover: scale 1.1 + opacity 1 : Agrandissement et pleine opacité au survol
         * - Identifie visuellement le partenaire survolé
         *
         * ANIMATION :
         * Classe .contact-partners (cinquième apparition)
         */}
        <div className="contact-partners pt-10 border-t border-white/10 max-w-lg mx-auto">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-6 font-medium">
            Nos partenaires
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Marine Nationale", "Région Sud", "Naval Group", "Ifremer"].map((partner, i) => (
              <motion.div
                key={i}
                className="text-center cursor-pointer"
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-sm font-medium text-white/60 drop-shadow-sm">{partner}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/**
         * Footer de section : "Musée ABYSSE — Toulon, France"
         *
         * STYLE :
         * - text-[8px] uppercase tracking-[0.15em] : Très petit, majuscules, espacé
         * - text-white/30 : Très transparent (très discret)
         * - mt-12 : Marge top 48px pour espacement
         *
         * ANIMATION :
         * Classe .contact-footer (sixième et dernière apparition)
         */}
        <p className="contact-footer text-[8px] uppercase tracking-[0.15em] text-white/30 mt-12 font-medium">
          Musée ABYSSE — Toulon, France
        </p>
      </div>

      {/**
       * Footer global du site (copyright)
       *
       * POSITION :
       * - absolute bottom-6 : Ancré en bas de la section à 24px du bord
       * - left-0 right-0 : Pleine largeur
       * - text-center : Centré horizontalement
       *
       * CONTENU :
       * "© 2026 Projet Abysse"
       *
       * STYLE :
       * - text-[8px] : Très petit (8px)
       * - uppercase tracking-[0.15em] : Majuscules espacées
       * - text-white/25 : Très transparent (maximum discrétion)
       *
       * NOTE :
       * Footer absolu permet de rester en bas même si le contenu de la section
       * ne remplit pas toute la hauteur min-h-[140vh].
       */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[8px] uppercase tracking-[0.15em] text-white/25 font-medium">
          © 2026 Projet Abysse
        </p>
      </footer>
    </section>
  );
}
