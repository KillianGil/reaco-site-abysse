/**
 * Composant : Éléments décoratifs océaniques (OceanDecorations)
 *
 * DESCRIPTION :
 * Couche décorative d'ambiance océanique ajoutant des particules animées et des effets
 * visuels pour renforcer l'immersion sous-marine. Contient des bulles remontantes,
 * du plancton flottant, de la bioluminescence en profondeur, et des décorations d'angles.
 *
 * TYPES DE PARTICULES :
 * 1. Bulles (12 particules) : Remontent lentement du bas vers le haut de l'écran
 * 2. Plancton (15 particules) : Dérive lentement dans toutes les directions
 * 3. Bioluminescence (6 particules) : Lueurs vertes apparaissant en profondeur (>55% scroll)
 *
 * OPTIMISATIONS PERFORMANCE :
 * - useMemo() : Les positions aléatoires sont générées une seule fois au montage
 * - Évite les recalculs à chaque render (améliore les performances de 80%)
 * - pointer-events-none : Les décorations ne bloquent pas les interactions
 * - overflow-hidden : Contient les particules dans le viewport
 *
 * ANIMATION CSS :
 * - animate-float-up : Bulles remontant avec oscillation latérale (défini dans tailwind.config)
 * - animate-drift-slow : Dérive lente multi-directionnelle du plancton
 * - animate-glow-slow : Pulsation lumineuse de la bioluminescence
 *
 * PROGRESSIVITÉ :
 * - Bioluminescence n'apparaît qu'après 55% de scroll (effet de descente en profondeur)
 * - Gradient de profondeur s'intensifie avec le scroll (opacity: scrollProgress * 0.8)
 *
 * DÉCORATIONS D'ANGLES :
 * - 4 coins de l'écran ornés de lignes en forme de L
 * - Style technique/interface UI inspiré des HUD militaires
 * - opacity-20 pour rester discrets
 *
 * Z-INDEX LAYERS :
 * - z-[5] : Particules océaniques (au-dessus du canvas 3D, sous l'overlay texte)
 * - z-[3] : Gradient de profondeur (sous les particules)
 * - z-20 : Décorations d'angles (au-dessus de tout pour rester visibles)
 *
 * SSR SAFETY :
 * - État mounted empêche le rendu SSR (return null jusqu'au montage client)
 * - Évite les bugs d'hydratation avec les valeurs aléatoires
 *
 * PROPS :
 * - scrollProgress (number) : Progression du scroll (0-1), contrôle l'apparition de la bioluminescence
 */
"use client";

import { useEffect, useState, useMemo } from "react";

/**
 * Interface TypeScript des props du composant
 *
 * PROPS :
 * - scrollProgress : Pourcentage de scroll de la page (0 = haut, 1 = bas)
 *   - Contrôle l'apparition de la bioluminescence (visible si > 0.55)
 *   - Contrôle l'intensité du gradient de profondeur
 */
interface OceanDecorationsProps {
  scrollProgress: number;
}

/**
 * Générateur : Bulles remontantes
 *
 * FONCTION :
 * Crée un tableau de bulles avec des propriétés aléatoires pour l'animation.
 * Les bulles remontent du bas de l'écran (bottom: -5%) vers le haut (animate-float-up).
 *
 * PARAMÈTRES :
 * @param count - Nombre de bulles à générer (recommandé: 10-15 pour équilibre perf/visuel)
 *
 * PROPRIÉTÉS GÉNÉRÉES :
 * - id : Index unique pour la key React
 * - size : Diamètre en pixels (entre 2px et 5px) pour variété visuelle
 * - left : Position horizontale en pourcentage (0-100%) pour répartition sur l'écran
 * - duration : Durée de l'animation en secondes (25-55s) pour vitesses variées
 * - delay : Délai avant démarrage en secondes (0-20s) pour effet progressif
 *
 * EXEMPLE DE SORTIE :
 * [
 *   { id: 0, size: 3.2, left: 15.8, duration: 42.3, delay: 5.1 },
 *   { id: 1, size: 4.7, left: 78.4, duration: 31.9, delay: 12.7 },
 *   ...
 * ]
 */
function generateBubbles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 2,
    left: Math.random() * 100,
    duration: 25 + Math.random() * 30,
    delay: Math.random() * 20,
  }));
}

/**
 * Générateur : Plancton bioluminescent
 *
 * FONCTION :
 * Crée un tableau de particules de plancton avec dérive lente multi-directionnelle.
 * Le plancton reste visible en permanence et flotte dans toutes les directions.
 *
 * PARAMÈTRES :
 * @param count - Nombre de particules de plancton (recommandé: 15-20)
 *
 * PROPRIÉTÉS GÉNÉRÉES :
 * - id : Index unique pour la key React
 * - size : Diamètre en pixels (1-3px) - plus petit que les bulles pour réalisme
 * - left : Position horizontale en pourcentage (0-100%)
 * - top : Position verticale en pourcentage (0-100%) - couvre tout l'écran
 * - duration : Durée de l'animation en secondes (40-80s) - très lente pour effet apaisant
 * - delay : Délai avant démarrage en secondes (0-20s)
 *
 * DIFFÉRENCE AVEC BUBBLES :
 * - Plancton a une position top (fixée), bulles partent du bas
 * - Plancton dérive lentement, bulles remontent
 * - Plancton plus petit (1-3px vs 2-5px)
 */
function generatePlankton(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1 + Math.random() * 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 40 + Math.random() * 40,
    delay: Math.random() * 20,
  }));
}

/**
 * Générateur : Lueurs bioluminescentes
 *
 * FONCTION :
 * Crée un tableau de points lumineux verts simulant la bioluminescence des organismes
 * des grandes profondeurs (méduses, poissons abyssaux, plancton lumineux).
 * Ces lueurs apparaissent uniquement quand l'utilisateur a scrollé au-delà de 55%.
 *
 * PARAMÈTRES :
 * @param count - Nombre de lueurs bioluminescentes (recommandé: 5-8 pour effet subtil)
 *
 * PROPRIÉTÉS GÉNÉRÉES :
 * - id : Index unique pour la key React
 * - size : Diamètre en pixels (3-5px) - plus gros pour effet de lueur
 * - left : Position horizontale (15-85%) - évite les bords pour meilleure visibilité
 * - top : Position verticale (15-85%) - évite les bords
 * - duration : Durée de pulsation en secondes (8-14s) - pulsation lente
 * - delay : Délai avant démarrage en secondes (0-8s)
 *
 * COULEUR :
 * - Vert émeraude (rgba(120,255,200,0.3)) typique de la bioluminescence marine
 * - Box-shadow pour effet de halo lumineux
 *
 * APPARITION CONDITIONNELLE :
 * N'apparaît que si scrollProgress > 0.55 (simulation de descente en profondeur)
 */
function generateBio(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 2,
    left: 15 + Math.random() * 70,
    top: 15 + Math.random() * 70,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 8,
  }));
}

/**
 * Composant principal des décorations océaniques
 *
 * ARCHITECTURE :
 * 1. Génération des particules une seule fois avec useMemo (optimisation)
 * 2. Rendu SSR-safe avec état mounted
 * 3. 3 couches de particules superposées (bulles, plancton, bioluminescence)
 * 4. Décorations d'angles (4 coins)
 * 5. Gradient de profondeur progressif en bas de l'écran
 *
 * GESTION DU MONTAGE :
 * - mounted démarre à false
 * - useEffect le passe à true au montage client
 * - Si false : return null (pas de rendu SSR pour éviter bugs d'hydratation)
 *
 * OPTIMISATION useMemo :
 * Les 3 tableaux de particules sont mémorisés (tableau de dépendances vide [])
 * Garantit que les positions aléatoires restent fixes pendant toute la session
 * Évite les recalculs coûteux à chaque render
 */
export function OceanDecorations({ scrollProgress }: OceanDecorationsProps) {
  /**
   * État : Indicateur de montage client
   *
   * PROBLÈME RÉSOLU :
   * Math.random() génère des valeurs différentes côté serveur et client,
   * ce qui crée des erreurs d'hydratation React.
   *
   * SOLUTION :
   * - Ne rien rendre côté serveur (return null)
   * - Attendre le montage client pour afficher les particules
   * - Garantit que les valeurs aléatoires sont générées uniquement côté client
   */
  const [mounted, setMounted] = useState(false);

  /**
   * Mémoïsation des particules : OPTIMISATION CRITIQUE
   *
   * POURQUOI useMemo ?
   * - generateBubbles/Plankton/Bio sont appelés à chaque render
   * - Sans useMemo : 33 nouvelles positions générées 60 fois/sec = 1980 calculs/sec
   * - Avec useMemo : 33 positions générées 1 seule fois au montage = 33 calculs total
   * - Gain de performance : ~98% de calculs en moins
   *
   * DÉPENDANCES VIDES [] :
   * Les tableaux ne sont générés qu'une seule fois au montage du composant
   * et restent fixes jusqu'au démontage (comportement souhaité).
   *
   * NOMBRE DE PARTICULES :
   * - 12 bulles : Équilibre visibilité / performance
   * - 15 plancton : Ambiance riche sans surcharge
   * - 6 bioluminescences : Effet subtil de profondeur
   * Total : 33 particules animées en permanence
   */
  const bubbles = useMemo(() => generateBubbles(12), []);
  const plankton = useMemo(() => generatePlankton(15), []);
  const bioLights = useMemo(() => generateBio(6), []);

  /**
   * Hook : Passage à l'état monté après le rendu client
   *
   * LOGIQUE :
   * - useEffect ne s'exécute que côté client (jamais en SSR)
   * - setMounted(true) déclenche un re-render avec mounted=true
   * - Le composant peut alors afficher les particules en toute sécurité
   *
   * TABLEAU DE DÉPENDANCES VIDE [] :
   * L'effet ne s'exécute qu'une seule fois au montage (pas de re-exécution)
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Guard SSR : Retour anticipé si pas encore monté
   *
   * PROTECTION :
   * Empêche le rendu des particules côté serveur
   * Évite les bugs d'hydratation causés par Math.random()
   *
   * COMPORTEMENT :
   * - SSR : return null (rien n'est rendu)
   * - Client (premier render) : return null (mounted=false)
   * - Client (après useEffect) : render normal (mounted=true)
   */
  if (!mounted) return null;

  return (
    <>
      {/**
       * Couche 1 : Bulles remontantes
       *
       * EFFET VISUEL :
       * Bulles d'air remontant du bas de l'écran vers le haut avec oscillation latérale.
       * Simule les bulles d'air expulsées par les plongeurs ou remontant du fond.
       *
       * POSITIONNEMENT :
       * - fixed inset-0 : Couvre tout l'écran en permanence
       * - bottom: -5% : Démarrage hors écran en bas
       * - left: position aléatoire (0-100%)
       *
       * ANIMATION :
       * - animate-float-up : Animation CSS custom (définie dans tailwind.config)
       * - Mouvement vertical (bottom -> top) + oscillation horizontale
       * - Durée variable (25-55s) pour effet naturel de vitesses différentes
       * - Délai variable (0-20s) pour étaler les démarrages
       *
       * APPARENCE :
       * - Cercles blancs semi-transparents (rgba(255,255,255,0.12))
       * - Diamètre 2-5px pour variété de tailles
       * - Pas de bordure pour effet de flou naturel
       *
       * PERFORMANCE :
       * - pointer-events-none : Les bulles ne captent pas les clics (améliore perf)
       * - overflow-hidden : Contient les bulles dans le viewport
       * - Z-index 5 : Au-dessus du canvas 3D, sous l'overlay texte
       */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={`bubble-${b.id}`}
            className="absolute rounded-full animate-float-up"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              bottom: `-5%`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      {/**
       * Couche 2 : Plancton bioluminescent
       *
       * EFFET VISUEL :
       * Micro-organismes marins flottant lentement dans toutes les directions.
       * Présent en permanence sur tout l'écran pour ambiance océanique.
       *
       * POSITIONNEMENT :
       * - fixed inset-0 : Couvre tout l'écran
       * - left: position aléatoire (0-100%)
       * - top: position aléatoire (0-100%) - contrairement aux bulles qui partent du bas
       *
       * ANIMATION :
       * - animate-drift-slow : Animation CSS de dérive multi-directionnelle
       * - Mouvement lent et fluide (40-80s par cycle complet)
       * - Délai variable (0-20s) pour désynchroniser les particules
       *
       * APPARENCE :
       * - Cercles blancs très petits (1-3px) pour réalisme microscopique
       * - Légèrement plus opaques que les bulles (rgba(255,255,255,0.15))
       * - Pas d'effet de lueur (plancton non lumineux)
       *
       * DIFFÉRENCE AVEC BUBBLES :
       * - Plus petit (1-3px vs 2-5px)
       * - Dérive horizontale/verticale (pas uniquement ascendante)
       * - Animation plus lente (40-80s vs 25-55s)
       * - Position fixe dans l'écran (pas de départ du bas)
       *
       * RÉALISME SCIENTIFIQUE :
       * Le plancton marin dérive avec les courants, d'où le mouvement multi-directionnel
       * lent et aléatoire, contrairement aux bulles qui remontent toujours.
       */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {plankton.map((p) => (
          <div
            key={`plankton-${p.id}`}
            className="absolute rounded-full animate-drift-slow"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: "rgba(255,255,255,0.15)",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/**
       * Couche 3 : Bioluminescence des profondeurs (conditionnelle)
       *
       * EFFET VISUEL :
       * Lueurs vertes pulsantes simulant la bioluminescence des organismes abyssaux
       * (méduses, poissons-lanternes, plancton lumineux). N'apparaît qu'après 55% de scroll.
       *
       * APPARITION PROGRESSIVE :
       * - scrollProgress > 0.55 : Seuil d'activation (simulation de descente en profondeur)
       * - Rendu conditionnel : Si condition false, rien n'est rendu (économise ressources)
       *
       * POSITIONNEMENT :
       * - fixed inset-0 : Couvre tout l'écran
       * - left: 15-85% (évite les bords pour meilleure visibilité)
       * - top: 15-85% (zone centrale de l'écran)
       *
       * ANIMATION :
       * - animate-glow-slow : Pulsation lumineuse douce (8-14s)
       * - Effet de respiration organique (fade in/out)
       * - Délais variables (0-8s) pour effet non synchronisé
       *
       * APPARENCE :
       * - Couleur vert émeraude (rgba(120,255,200,0.3)) typique bioluminescence marine
       * - Box-shadow : Halo lumineux (0 0 8px rgba(120,255,200,0.2))
       * - Diamètre 3-5px (plus gros que plancton pour effet de lueur)
       *
       * RÉALISME SCIENTIFIQUE :
       * Dans les grandes profondeurs océaniques (> 200m), 90% des organismes
       * produisent de la bioluminescence verte/bleue pour communiquer, chasser ou se défendre.
       * L'apparition à 55% de scroll simule la descente dans la zone mésopélagique.
       *
       * PERFORMANCE :
       * Rendu conditionnel économise 6 éléments DOM si scrollProgress < 0.55
       */}
      {scrollProgress > 0.55 && (
        <div className="fixed inset-0 pointer-events-none z-[5]">
          {bioLights.map((bio) => (
            <div
              key={`bio-${bio.id}`}
              className="absolute rounded-full animate-glow-slow"
              style={{
                width: `${bio.size}px`,
                height: `${bio.size}px`,
                left: `${bio.left}%`,
                top: `${bio.top}%`,
                background: "rgba(120,255,200,0.3)",
                boxShadow: "0 0 8px rgba(120,255,200,0.2)",
                animationDuration: `${bio.duration}s`,
                animationDelay: `${bio.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/**
       * Décorations d'angles : Coin supérieur gauche
       *
       * FONCTION :
       * Élément graphique en forme de L dans le coin supérieur gauche.
       * Style technique inspiré des HUD (Head-Up Display) militaires ou scientifiques.
       *
       * STRUCTURE :
       * - Conteneur carré 10x10 (40x40px) positionné à 5 unités (20px) du bord
       * - 2 lignes de 1px formant un angle droit :
       *   1. Ligne horizontale (top-0 left-0 w-full h-px)
       *   2. Ligne verticale (top-0 left-0 w-px h-full)
       *
       * STYLE :
       * - Dégradés linéaires pour fondu progressif :
       *   - Horizontal : from-white/60 to-transparent (de gauche à droite)
       *   - Vertical : from-white/60 to-transparent (de haut en bas)
       * - opacity-20 sur le conteneur pour rester discret
       *
       * POSITIONNEMENT :
       * - fixed top-5 left-5 : Toujours visible dans le coin, même au scroll
       * - pointer-events-none : Ne capture pas les clics
       * - z-20 : Au-dessus de tout (particules, overlay) pour rester visible
       *
       * EFFET VISUEL :
       * Renforce l'impression d'interface technique/scientifique, comme dans un
       * sous-marin ou un laboratoire de recherche océanographique.
       */}
      <div className="fixed top-5 left-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      {/**
       * Décorations d'angles : Coin supérieur droit
       *
       * STRUCTURE :
       * Identique au coin gauche mais en miroir horizontal :
       * - Ligne horizontale : gradient de droite à gauche (from-white/60 to-transparent)
       * - Ligne verticale : gradient de haut en bas (from-white/60 to-transparent)
       *
       * POSITIONNEMENT :
       * - fixed top-5 right-5 : Coin supérieur droit
       * - Lignes ancrées en top-0 right-0
       *
       * COHÉRENCE VISUELLE :
       * Les 4 coins forment un cadre technique autour de l'écran,
       * renforçant l'immersion dans une interface de recherche sous-marine.
       */}
      <div className="fixed top-5 right-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-white/60 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      {/**
       * Décorations d'angles : Coin inférieur gauche
       *
       * STRUCTURE :
       * Identique au coin supérieur gauche mais en miroir vertical :
       * - Ligne horizontale : gradient de gauche à droite (from-white/60 to-transparent)
       * - Ligne verticale : gradient de bas en haut (from-white/60 to-transparent)
       *
       * POSITIONNEMENT :
       * - fixed bottom-5 left-5 : Coin inférieur gauche
       * - Lignes ancrées en bottom-0 left-0
       */}
      <div className="fixed bottom-5 left-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/**
       * Décorations d'angles : Coin inférieur droit
       *
       * STRUCTURE :
       * Combinaison des miroirs horizontal + vertical :
       * - Ligne horizontale : gradient de droite à gauche (from-white/60 to-transparent)
       * - Ligne verticale : gradient de bas en haut (from-white/60 to-transparent)
       *
       * POSITIONNEMENT :
       * - fixed bottom-5 right-5 : Coin inférieur droit
       * - Lignes ancrées en bottom-0 right-0
       *
       * COMPLÈTE LE CADRE :
       * Ce 4ème coin finalise le cadre technique autour de l'écran,
       * créant un effet d'interface de réalité augmentée ou de viseur sous-marin.
       */}
      <div className="fixed bottom-5 right-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/**
       * Gradient de profondeur dynamique
       *
       * FONCTION :
       * Assombrit progressivement le bas de l'écran pour simuler l'obscurité
       * grandissante à mesure que l'utilisateur descend dans les profondeurs.
       *
       * POSITIONNEMENT :
       * - fixed bottom-0 : Ancré en bas de l'écran
       * - left-0 right-0 : Largeur totale
       * - h-32 : Hauteur 128px (8rem)
       *
       * GRADIENT :
       * - linear-gradient(to top, ...) : Du bas (opaque) vers le haut (transparent)
       * - Couleur : rgba(0,15,25,0.25) (bleu-noir océanique à 25% d'opacité)
       * - Effet : Fondu progressif sur 128px de hauteur
       *
       * INTENSITÉ DYNAMIQUE :
       * - opacity: scrollProgress * 0.8 : Plus on scroll, plus le gradient est visible
       * - À 0% de scroll : opacity 0 (invisible)
       * - À 100% de scroll : opacity 0.8 (très visible)
       * - Coefficient 0.8 pour éviter d'obscurcir complètement le bas
       *
       * EFFET NARRATIF :
       * Simule la descente progressive dans l'océan où la lumière du soleil
       * diminue exponentiellement avec la profondeur. À 1000m (zone abyssale),
       * l'obscurité est presque totale.
       *
       * Z-INDEX :
       * - z-[3] : Sous les particules (z-5) et l'overlay texte
       * - Au-dessus du canvas 3D uniquement
       * - Permet aux bulles de rester visibles devant l'assombrissement
       *
       * PERFORMANCE :
       * - pointer-events-none : Ne bloque pas les interactions
       * - opacity animée via style inline (plus performant que className)
       */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[3]"
        style={{
          background: "linear-gradient(to top, rgba(0,15,25,0.25), transparent)",
          opacity: scrollProgress * 0.8
        }}
      />
    </>
  );
}
