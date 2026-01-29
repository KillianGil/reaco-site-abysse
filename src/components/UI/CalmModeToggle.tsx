/**
 * Composant : Bouton de basculement du Mode Calme (Accessibilité)
 *
 * DESCRIPTION :
 * Bouton fixe en bas à gauche permettant d'activer/désactiver le mode calme.
 * Le mode calme réduit ou fige les animations pour améliorer l'accessibilité
 * et les performances, notamment pour les utilisateurs sensibles aux mouvements.
 *
 * FONCTIONNALITÉ :
 * - Active/désactive le mode "reduced motion" via le contexte d'accessibilité
 * - Fige les animations Three.js, GSAP et CSS quand activé
 * - Améliore les performances sur les appareils moins puissants
 * - Respecte les préférences utilisateur (prefers-reduced-motion)
 *
 * POSITION :
 * - Fixe en bas à gauche (bottom-6 left-6)
 * - Z-index 50 pour rester visible au-dessus du contenu
 * - Bouton circulaire de 12x12 (48x48px) pour faciliter le clic
 *
 * ÉTATS VISUELS :
 * 1. Mode Calme INACTIF (animations normales) :
 *    - Icône Waves (vagues)
 *    - Fond blanc/5 avec bordure blanche/20
 *    - Texte blanc/60, passe à blanc/90 au hover
 *
 * 2. Mode Calme ACTIF (animations figées) :
 *    - Icône Pause
 *    - Fond cyan/20 avec bordure cyan/50
 *    - Shadow glow cyan pour effet lumineux
 *    - Texte cyan pour indiquer l'état actif
 *
 * TOOLTIP :
 * - Apparaît au hover sur le côté droit (left-full ml-3)
 * - 2 lignes : Titre (Mode Calme) + Description (Cliquez pour...)
 * - Fond sombre avec bordure et backdrop blur
 * - pointer-events-none pour ne pas interférer avec le hover
 *
 * ACCESSIBILITÉ :
 * - aria-label décrivant l'action ("Activer/Désactiver le mode calme")
 * - aria-pressed indiquant l'état actuel (true/false)
 * - title pour tooltip natif sur desktop
 * - Transitions fluides (300ms) pour éviter les changements brusques
 *
 * CONTEXTE :
 * Utilise AccessibilityContext pour :
 * - Lire l'état reducedMotion
 * - Mettre à jour l'état via setReducedMotion()
 * - Propager le changement à tous les composants animés
 */
"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Waves, Pause } from "lucide-react";

/**
 * Composant bouton de toggle du mode calme
 *
 * LOGIQUE :
 * - Récupère reducedMotion et setReducedMotion depuis le contexte
 * - Au clic : inverse l'état (true <-> false)
 * - Les composants animés écoutent ce contexte et s'adaptent automatiquement
 *
 * DESIGN SYSTEM :
 * - Couleur accent : #4CBBD5 (cyan) pour l'état actif
 * - Backdrop blur pour effet de profondeur
 * - Shadow glow cyan pour effet de luminescence sous-marine
 * - Transitions fluides sur toutes les propriétés (duration-300)
 */
export function CalmModeToggle() {
    // Récupération de l'état et du setter depuis le contexte d'accessibilité
    const { reducedMotion, setReducedMotion } = useAccessibility();

    return (
        <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center group ${
                reducedMotion
                    ? "bg-[#4CBBD5]/20 border-[#4CBBD5]/50 shadow-[0_0_20px_rgba(76,187,213,0.3)]"
                    : "bg-white/5 border-white/20 hover:border-white/40"
            }`}
            title={reducedMotion
                ? "Mode Calme actif - Animations figées. Cliquez pour réactiver les animations"
                : "Activer le Mode Calme - Fige les animations pour l'accessibilité et les performances"
            }
            aria-label={reducedMotion ? "Désactiver le mode calme" : "Activer le mode calme"}
            aria-pressed={reducedMotion}
        >
            {/**
             * Icône conditionnelle selon l'état
             *
             * ACTIF (reducedMotion = true) :
             * - Icône Pause (symbole universel d'arrêt)
             * - Couleur cyan pour cohérence avec le fond
             *
             * INACTIF (reducedMotion = false) :
             * - Icône Waves (vagues) évoquant le mouvement océanique
             * - Couleur blanche/60 au repos, blanche/90 au hover
             * - Transition fluide sur la couleur
             */}
            {reducedMotion ? (
                <Pause className="w-5 h-5 text-[#4CBBD5]" />
            ) : (
                <Waves className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors" />
            )}

            {/**
             * Tooltip amélioré (apparaît au hover)
             *
             * POSITIONNEMENT :
             * - absolute left-full (à droite du bouton)
             * - ml-3 pour espacement de 12px depuis le bouton
             * - whitespace-nowrap pour éviter les retours à la ligne
             *
             * CONTENU :
             * - Titre en gras (font-medium)
             * - Description en plus petit (text-[10px]) et plus discret (text-white/60)
             *
             * ANIMATION :
             * - opacity-0 par défaut (invisible)
             * - group-hover:opacity-100 (apparaît au survol du bouton)
             * - transition-opacity pour fondu fluide
             *
             * TECHNIQUE :
             * - pointer-events-none pour ne pas interférer avec le hover du bouton
             * - shadow-lg pour détacher le tooltip du fond
             * - bg sombre avec border pour lisibilité
             */}
            <span className="absolute left-full ml-3 px-3 py-2 bg-[#031525]/95 border border-white/10 rounded-lg text-xs text-white/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                <span className="font-medium block">
                    {reducedMotion ? "Mode Calme actif" : "Mode Calme"}
                </span>
                <span className="text-white/60 text-[10px]">
                    {reducedMotion ? "Cliquez pour réactiver" : "Accessibilité & Performance"}
                </span>
            </span>
        </button>
    );
}
