/**
 * Composant : Jauge de profondeur interactive
 *
 * DESCRIPTION :
 * Indicateur de profondeur fixe qui évolue avec le scroll de la page.
 * Affiche la profondeur actuelle de -0m à -11000m, avec une barre de progression
 * draggable permettant de naviguer directement dans la page.
 *
 * FONCTIONNALITÉS :
 * 1. Affichage de la profondeur : Convertit scrollProgress (0-1) en mètres (0-11000)
 * 2. Barre de progression visuelle : Gradient bleu remplissant la track
 * 3. Indicateur de zone océanique : Surface, Mésopélagique, Bathyal, Abyssal, Hadale
 * 4. Navigation interactive :
 *    - Clic sur la track : Scroll direct vers la position cliquée (smooth)
 *    - Drag de l'indicateur : Navigation continue en temps réel (auto)
 * 5. Marques de profondeur : Labels à 0m, 3km, 6km, 9km, 11km
 *
 * POSITION ET RESPONSIVE :
 * - Fixe à gauche de l'écran (left-8)
 * - Centré verticalement (top-1/2 -translate-y-1/2)
 * - Z-index 50 pour rester visible au-dessus du contenu
 * - hidden md:flex : Visible uniquement sur desktop (caché sur mobile)
 *
 * ZONES OCÉANIQUES :
 * - Surface : 0-200m (zone euphotique, lumière solaire)
 * - Mésopélagique : 200-1000m (zone crépusculaire, peu de lumière)
 * - Bathyal : 1000-4000m (zone de minuit, obscurité totale)
 * - Abyssal : 4000-6000m (plaines abyssales)
 * - Zone Hadale : 6000m+ (fosses océaniques, Mariannes)
 *
 * INTERACTIVITÉ :
 * 1. Clic sur la track :
 *    - Convertit la position Y du clic en pourcentage (0-1)
 *    - Scroll la page vers la position correspondante (behavior: smooth)
 *
 * 2. Drag de l'indicateur :
 *    - isDragging passe à true au mouseDown/touchStart
 *    - La position est mise à jour en continu (handleDragMove)
 *    - La page scroll en temps réel (behavior: auto pour fluidité)
 *    - isDragging passe à false au mouseUp/touchEnd
 *
 * OPTIMISATIONS :
 * - Transitions CSS pour la fluidité du remplissage (pas de gsap)
 * - useCallback pour éviter les re-renders inutiles
 * - Gestion séparée des événements mouse et touch
 * - cleanup des event listeners au démontage
 *
 * PROPS :
 * - scrollProgress (number) : Progression du scroll (0 à 1) depuis useScrollProgress()
 */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Interface TypeScript des props
 */
interface DepthGaugeProps {
  scrollProgress: number;
}

/**
 * Composant principal de la jauge de profondeur
 *
 * LOGIQUE :
 * 1. Conversion scrollProgress -> depth en mètres (0-11000)
 * 2. Affichage avec formatage (séparateur de milliers)
 * 3. Barre de progression avec gradient bleu-cyan
 * 4. Indicateur draggable pour navigation
 * 5. Zone océanique affichée selon la profondeur
 *
 * ÉTATS :
 * - mounted : SSR safety (rendu uniquement côté client)
 * - displayProgress : Progression affichée (suit scrollProgress sauf en drag)
 * - isDragging : État de drag de l'indicateur
 *
 * REFS :
 * - trackRef : Référence à la track pour calculer les positions de clic/drag
 */
export function DepthGauge({ scrollProgress }: DepthGaugeProps) {
  // Profondeur maximale en mètres (Fosse des Mariannes)
  const maxDepth = 11000;

  // Calcul de la profondeur actuelle en mètres
  const depth = Math.round(scrollProgress * maxDepth);

  // États pour le rendu côté client et l'interactivité
  const [mounted, setMounted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Référence à la track pour les calculs de position
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * Hook : Activation du rendu côté client uniquement
   *
   * RAISON :
   * Évite les erreurs d'hydratation SSR/Client mismatch.
   * La jauge dépend de la position du scroll qui n'existe pas côté serveur.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Hook : Mise à jour de displayProgress depuis scrollProgress
   *
   * LOGIQUE :
   * - Si l'utilisateur drag : on ignore scrollProgress (contrôle manuel)
   * - Sinon : displayProgress suit scrollProgress (contrôle automatique)
   *
   * TRANSITIONS CSS :
   * L'animation est gérée par CSS (transition sur height) pour performance
   */
  useEffect(() => {
    if (!isDragging) {
      setDisplayProgress(scrollProgress);
    }
  }, [scrollProgress, isDragging]);

  /**
   * Handler : Démarrage du drag
   *
   * ÉVÉNEMENTS :
   * - mouseDown (desktop)
   * - touchStart (mobile/tablette)
   *
   * ACTIONS :
   * - Empêche le comportement par défaut (sélection de texte)
   * - Active l'état isDragging
   */
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  /**
   * Handler : Mouvement pendant le drag
   *
   * LOGIQUE :
   * 1. Récupère la position Y du curseur/doigt
   * 2. Calcule la position relative dans la track (0-1)
   * 3. Met à jour displayProgress
   * 4. Scroll la page vers la position correspondante (behavior: auto)
   *
   * CALCULS :
   * - clientY - rect.top : Position Y relative à la track
   * - y / rect.height : Progression (0-1)
   * - Math.max(0, Math.min(1, ...)) : Clamp entre 0 et 1
   *
   * SCROLL :
   * - scrollHeight : Hauteur totale scrollable de la page
   * - window.innerHeight : Hauteur de la fenêtre
   * - scrollHeight - innerHeight : Distance maximale de scroll
   * - progress * scrollHeight : Position de scroll cible
   * - behavior: auto : Scroll instantané (pas d'animation pendant le drag)
   */
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));

    setDisplayProgress(progress);

    // Scroll la page en temps réel
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'auto',
    });
  }, [isDragging]);

  /**
   * Handler : Fin du drag
   *
   * ACTIONS :
   * - Désactive l'état isDragging
   * - displayProgress reprend le suivi de scrollProgress
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Hook : Gestion des événements mouse globaux pendant le drag
   *
   * ÉVÉNEMENTS :
   * - mousemove : Met à jour la position pendant le drag
   * - mouseup : Termine le drag
   *
   * CLEANUP :
   * Supprime les listeners au démontage ou quand isDragging = false
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  /**
   * Hook : Gestion des événements touch globaux pendant le drag
   *
   * ÉVÉNEMENTS :
   * - touchmove : Met à jour la position pendant le drag (mobile)
   * - touchend : Termine le drag
   *
   * OPTIONS :
   * - passive: false : Permet d'appeler preventDefault() dans handleDragStart
   *
   * CLEANUP :
   * Supprime les listeners au démontage ou quand isDragging = false
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      handleDragEnd();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  /**
   * Handler : Clic sur la track pour navigation rapide
   *
   * LOGIQUE :
   * 1. Récupère la position Y du clic
   * 2. Calcule la progression (0-1)
   * 3. Scroll la page vers la position (behavior: smooth)
   *
   * DIFFÉRENCE AVEC DRAG :
   * - Clic : behavior smooth (animation fluide)
   * - Drag : behavior auto (instantané pour suivre le curseur)
   */
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  /**
   * Fonction : Formatage de la profondeur pour l'affichage
   *
   * LOGIQUE :
   * - Si >= 1000 : Ajoute un séparateur de milliers (ex: 5 234)
   * - Sinon : Affichage simple (ex: 856)
   *
   * FORMAT FRANÇAIS :
   * - toLocaleString("fr-FR") : Séparateur espace (5 234)
   * - Format international : 5,234 (US) ou 5.234 (DE)
   */
  const formatDepth = (d: number) => {
    if (d >= 1000) {
      return d.toLocaleString("fr-FR");
    }
    return d.toString();
  };

  // SSR safety : ne rien rendre côté serveur
  if (!mounted) return null;

  // Calculs de position
  const fillPercent = displayProgress * 100;
  const trackHeight = 176; // h-44 = 11rem = 176px
  const dotPosition = (fillPercent / 100) * trackHeight;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4 select-none">
      {/**
       * Affichage de la profondeur
       *
       * FORMAT :
       * - Signe moins devant (ex: -5234m)
       * - Formatage avec séparateur de milliers
       * - Unité "m" en plus petit (text-lg) et semi-transparent (opacity-80)
       *
       * STYLE :
       * - text-3xl md:text-4xl : Responsive (plus grand sur desktop)
       * - font-bold : Poids important pour visibilité
       * - tracking-tight : Espacement serré pour compacité
       * - text-white : Couleur blanche
       * - drop-shadow-lg : Ombre portée pour détacher du fond
       */}
      <div className="relative">
        <div className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
          -{formatDepth(depth)}
          <span className="text-lg ml-1 font-normal opacity-80">m</span>
        </div>
      </div>

      {/**
       * Conteneur de la track et de l'indicateur
       *
       * LAYOUT :
       * - relative : Pour positionner l'indicateur en absolu
       * - flex items-start : Aligner la track et les labels
       * - gap-3 : Espacement de 12px entre track et labels
       */}
      <div className="relative flex items-start gap-3">
        {/**
         * Track principale (barre de progression) - Cliquable
         *
         * INTERACTIVITÉ :
         * - Cliquable : handleTrackClick pour navigation rapide
         * - cursor-pointer : Indicateur visuel de cliquabilité
         *
         * STYLE :
         * - w-2 h-44 : Largeur 8px, hauteur 176px
         * - bg-white/20 : Fond blanc semi-transparent
         * - rounded-full : Coins arrondis
         * - overflow-hidden : Contenir le remplissage
         * - shadow-inner : Ombre intérieure pour effet de profondeur
         *
         * REMPLISSAGE (div enfant) :
         * - Position absolue top-0 left-0
         * - height calculée dynamiquement (fillPercent)
         * - Gradient vertical : cyan clair -> cyan moyen -> cyan foncé
         * - pointer-events-none : Ne pas interférer avec les clics sur la track
         */}
        <div
          ref={trackRef}
          className="relative w-2 h-44 bg-white/20 rounded-full overflow-hidden shadow-inner cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Remplissage de la track avec gradient bleu-cyan */}
          <div
            className="absolute top-0 left-0 w-full rounded-full pointer-events-none"
            style={{
              height: `${fillPercent}%`,
              background: "linear-gradient(to bottom, #4CBBD5, #1a8aaa, #0a6080)",
            }}
          />

          {/**
           * Marques de graduation sur la track
           *
           * FONCTION :
           * Repères visuels pour les profondeurs 0m, 3km, 6km, 9km, 11km
           *
           * LAYOUT :
           * - flex-col justify-between : Répartition égale verticalement
           * - py-1 : Padding pour ne pas toucher les bords
           * - pointer-events-none : Ne pas interférer avec le clic
           *
           * MARQUES :
           * - 5 lignes horizontales blanches semi-transparentes
           * - h-px : Hauteur 1px
           * - bg-white/30 : Opacité 30%
           */}
          <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-px bg-white/30" />
            ))}
          </div>
        </div>

        {/**
         * Indicateur de position actuelle (point draggable)
         *
         * INTERACTIVITÉ :
         * - Draggable : handleDragStart (mouse & touch)
         * - cursor-grab : Indicateur visuel de draggabilité
         * - cursor-grabbing : Indicateur visuel pendant le drag
         *
         * POSITION :
         * - absolute : Positionné par rapport au conteneur parent
         * - -left-1 : Décalage de -4px pour centrer sur la track (w-4 / 2)
         * - top calculée dynamiquement (dotPosition)
         * - translateY(-50%) : Centrage vertical sur la position
         *
         * STYLE :
         * - w-4 h-4 : Diamètre 16px (bien cliquable)
         * - rounded-full : Forme circulaire
         * - bg-white : Fond blanc pur
         * - shadow-lg : Ombre portée normale
         * - scale-125 pendant le drag : Agrandissement de 25%
         *
         * GLOW EFFECT :
         * - Au repos : shadow blanc + glow cyan léger
         * - En drag : glow cyan intensifié (0 0 24px)
         */}
        <div
          className={`absolute w-4 h-4 rounded-full bg-white shadow-lg -left-1 ${isDragging ? 'scale-125 cursor-grabbing' : 'cursor-grab'
            }`}
          style={{
            top: `${dotPosition}px`,
            transform: `translateY(-50%) ${isDragging ? 'scale(1.25)' : ''}`,
            transition: 'transform 0.1s',
            boxShadow: isDragging
              ? "0 0 12px #fff, 0 0 24px #4CBBD5"
              : "0 0 8px #fff, 0 0 16px #4CBBD5"
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />

        {/**
         * Labels de profondeur sur le côté droit
         *
         * FONCTION :
         * Affiche les repères de profondeur (0m, 3km, 6km, 9km, 11km)
         *
         * LAYOUT :
         * - flex-col justify-between : Répartition égale verticalement
         * - h-44 : Même hauteur que la track (176px)
         * - ml-4 : Espacement de 16px depuis l'indicateur
         *
         * STYLE :
         * - text-[10px] : Très petit pour discrétion
         * - font-medium : Poids moyen pour lisibilité
         * - text-white/60 : Blanc semi-transparent
         * - pointer-events-none : Ne pas interférer avec les clics
         */}
        <div className="flex flex-col justify-between h-44 text-[10px] font-medium text-white/60 ml-4 pointer-events-none">
          <span>0m</span>
          <span>3km</span>
          <span>6km</span>
          <span>9km</span>
          <span>11km</span>
        </div>
      </div>

      {/**
       * Badge de zone océanique
       *
       * FONCTION :
       * Affiche le nom de la zone océanique selon la profondeur actuelle
       *
       * ZONES :
       * - Surface : 0-200m (lumière solaire directe)
       * - Mésopélagique : 200-1000m (zone crépusculaire)
       * - Bathyal : 1000-4000m (obscurité totale)
       * - Abyssal : 4000-6000m (plaines abyssales)
       * - Zone Hadale : 6000m+ (fosses océaniques)
       *
       * STYLE :
       * - px-3 py-1.5 : Padding interne
       * - rounded : Coins légèrement arrondis
       * - bg-white/20 : Fond blanc semi-transparent
       * - backdrop-blur-sm : Flou du fond pour effet de verre
       * - border border-white/30 : Bordure blanche semi-transparente
       *
       * TEXTE :
       * - text-[10px] : Très petit
       * - uppercase : Majuscules
       * - tracking-widest : Espacement maximal des lettres
       * - font-semibold : Poids semi-gras
       * - text-white : Couleur blanche
       * - leading-none : Pas d'interligne (compact)
       * - text-center : Centré
       * - whitespace-nowrap : Pas de retour à la ligne
       */}
      <div className="px-3 py-1.5 rounded bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-white leading-none text-center whitespace-nowrap">
          {depth < 200 && "Surface"}
          {depth >= 200 && depth < 1000 && "Mésopélagique"}
          {depth >= 1000 && depth < 4000 && "Bathyal"}
          {depth >= 4000 && depth < 6000 && "Abyssal"}
          {depth >= 6000 && "Zone Hadale"}
        </span>
      </div>
    </div>
  );
}
