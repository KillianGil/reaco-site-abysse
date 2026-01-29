/**
 * Page : Page d'accueil du musée ABYSSE
 *
 * DESCRIPTION :
 * Page d'accueil immersive avec expérience 3D de plongée dans les abysses.
 * Utilise Three.js pour créer un banc de poissons interactif animé qui suit
 * la progression du scroll de l'utilisateur.
 *
 * COMPOSANTS PRINCIPAUX :
 * - Scene (Three.js) : Scène 3D avec banc de poissons et effets océaniques
 * - Overlay : Contenu textuel superposé (sections narratives)
 * - DepthGauge : Jauge de profondeur qui évolue au scroll
 * - OceanDecorations : Éléments visuels décoratifs (bulles, particules)
 * - CalmModeToggle : Bouton pour désactiver les animations (accessibilité)
 *
 * FONCTIONNALITÉS :
 * - Scroll progressif : La scène 3D évolue en fonction du scroll
 * - Chargement dynamique : La scène Three.js est chargée uniquement côté client (SSR désactivé)
 * - Responsive : Les animations sont recalculées au redimensionnement de la fenêtre
 * - Mode calme : Option pour réduire/désactiver les animations (accessibilité)
 *
 * PERFORMANCE :
 * - Le composant Scene est chargé dynamiquement pour éviter les problèmes de SSR
 * - Les événements de scroll sont optimisés via ScrollTrigger de GSAP
 * - Un loader est affiché pendant le chargement initial
 */
"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Overlay, DepthGauge, Navbar, OceanDecorations, Loader, CalmModeToggle } from "@/components/UI";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

// Enregistrer le plugin ScrollTrigger de GSAP pour les animations au scroll
gsap.registerPlugin(ScrollTrigger);

/**
 * Composant Scene chargé dynamiquement sans SSR
 *
 * RAISON DU CHARGEMENT DYNAMIQUE :
 * Three.js nécessite un accès à l'objet "window" qui n'existe pas côté serveur.
 * Le chargement dynamique avec ssr: false garantit que le composant n'est rendu
 * que côté client après l'hydratation.
 *
 * PARAMÈTRES :
 * - ssr: false : Désactive le rendu côté serveur
 * - loading: () => null : Aucun placeholder pendant le chargement
 */
const Scene = dynamic(
  () => import("@/components/Canvas/Scene").then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Composant interne gérant le contenu de la page
 *
 * LOGIQUE :
 * - Récupère la progression du scroll via useScrollProgress()
 * - Transmet cette progression aux composants animés (Scene, DepthGauge, OceanDecorations)
 * - Gère le rafraîchissement de ScrollTrigger au redimensionnement
 * - Force le scroll en haut de page au chargement
 */
function PageContent() {
  // Hook custom qui calcule la progression du scroll (0 à 1)
  const scrollProgress = useScrollProgress();

  // Forcer le scroll en haut de page au chargement/rafraîchissement
  // Évite que l'utilisateur arrive au milieu de la page après un refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gérer le rafraîchissement de ScrollTrigger au redimensionnement de la fenêtre
  // ScrollTrigger doit recalculer les positions des éléments après un resize
  useEffect(() => {
    ScrollTrigger.refresh();
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    // Cleanup : supprimer l'event listener et tuer toutes les instances ScrollTrigger
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <>
      {/* Loader affiché pendant le chargement initial */}
      <Loader />

      {/* Scène 3D Three.js (banc de poissons) - reçoit la progression du scroll */}
      <Scene scrollProgress={scrollProgress} />

      {/* Barre de navigation principale */}
      <Navbar />

      {/* Jauge de profondeur qui évolue avec le scroll */}
      <DepthGauge scrollProgress={scrollProgress} />

      {/* Décorations océaniques (bulles, particules) */}
      <OceanDecorations scrollProgress={scrollProgress} />

      {/* Contenu textuel superposé (sections narratives de la page) */}
      <Overlay />

      {/* Bouton toggle pour désactiver les animations (accessibilité) */}
      <CalmModeToggle />

      {/* Overlay de texture grain pour un effet film/photo */}
      <div className="grain-overlay" />
    </>
  );
}

/**
 * Composant principal de la page d'accueil
 *
 * ARCHITECTURE :
 * - Wrappé dans AccessibilityProvider pour gérer le contexte d'accessibilité
 * - Le contexte permet aux composants enfants de réagir aux préférences d'accessibilité
 *   (mode calme, réduction des animations, etc.)
 *
 * ACCESSIBILITÉ :
 * Le AccessibilityProvider permet aux utilisateurs de :
 * - Désactiver les animations automatiques (motion reduction)
 * - Activer le mode calme (calm mode) pour réduire les effets visuels
 * - Accéder aux contrôles d'accessibilité depuis n'importe quel composant
 *
 * @returns {JSX.Element} Page d'accueil avec expérience 3D interactive
 */
export default function Home() {
  return (
    <AccessibilityProvider>
      <main className="relative">
        <PageContent />
      </main>
    </AccessibilityProvider>
  );
}
