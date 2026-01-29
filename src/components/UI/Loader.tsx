/**
 * Composant : Écran de chargement initial (Loader)
 *
 * DESCRIPTION :
 * Écran de chargement plein écran affiché pendant le chargement des assets Three.js.
 * Interface radar/sonar avec animation de balayage et indicateur de progression.
 *
 * FONCTIONNALITÉS :
 * - Affichage de la progression du chargement (0-100%)
 * - Animation radar avec ligne de balayage rotative
 * - Cercles concentriques simulant un sonar
 * - Blips animés (points détectés) apparaissant progressivement
 * - Barre de progression en bas de l'écran
 * - Disparition en fondu quand le chargement est terminé
 *
 * HOOK UTILISÉ :
 * - useProgress() de @react-three/drei : Fournit l'état du chargement Three.js
 *   - active (boolean) : true si des assets sont en cours de chargement
 *   - progress (number) : Pourcentage de progression (0-100)
 *
 * GESTION DE L'AFFICHAGE :
 * 1. Chargement en cours : Loader visible (opacity-100)
 * 2. Chargement terminé (active=false & progress=100) :
 *    - Fondu de sortie (opacity-0, duration 1s)
 *    - Délai de 800ms avant le démontage
 *    - pointer-events-none pour ne pas bloquer les interactions
 * 3. Après 800ms : Démontage complet (return null)
 *
 * DESIGN VISUEL :
 * - Fond sombre (#020A19) avec gradient radial cyan/bleu
 * - Z-index 200 : Au-dessus de tout le contenu
 * - Interface radar circulaire inspirée des sonars militaires
 * - Couleur accent : cyan (#4CBBD5)
 *
 * ANIMATIONS CSS :
 * - animate-spin-radar : Rotation de la ligne de balayage
 * - animate-blip : Apparition/disparition des points détectés (délais 1s, 2.5s, 4s)
 *
 * ACCESSIBILITÉ :
 * - fixed inset-0 : Overlay plein écran
 * - Texte lisible avec ombres portées
 * - Progression affichée en pourcentage
 */
"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

/**
 * Composant principal du Loader
 *
 * LOGIQUE :
 * 1. useProgress() récupère l'état du chargement Three.js
 * 2. Quand active=false & progress=100 :
 *    - Déclenche le fondu de sortie (opacity CSS)
 *    - Démonte le composant après 800ms
 * 3. Sinon : Reste visible et affiche la progression
 *
 * ÉTATS :
 * - show (boolean) : Contrôle le démontage du composant
 *
 * CLEANUP :
 * Le timeout est nettoyé si le composant est démonté avant la fin
 */
export function Loader() {
    // Récupération de l'état du chargement Three.js
    const { active, progress } = useProgress();
    const [show, setShow] = useState(true);

    /**
     * Hook : Gestion du démontage du loader
     *
     * LOGIQUE :
     * - Si le chargement est terminé (active=false & progress=100) :
     *   - Attend 800ms (durée du fondu CSS)
     *   - setShow(false) pour démonter le composant
     * - Sinon : setShow(true) pour garder le composant monté
     *
     * CLEANUP :
     * clearTimeout() évite les fuites mémoire si le composant est démonté
     */
    useEffect(() => {
        if (!active && progress === 100) {
            const timer = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(timer);
        } else {
            setShow(true);
        }
    }, [active, progress]);

    // Si show=false : démontage complet (économise le rendu)
    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020A19] transition-opacity duration-1000 ${!active && progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/**
             * Fond avec gradient radial
             *
             * EFFET :
             * - Gradient radial du centre vers les bords
             * - Couleurs : cyan/bleu foncé (#006994) au centre -> noir (#020A19) aux bords
             * - Opacité 20% au centre, 50% milieu, plein aux bords
             *
             * TECHNIQUE :
             * - bg-[radial-gradient(...)] : Gradient radial Tailwind
             * - var(--tw-gradient-stops) : Variable Tailwind pour les stops
             * - from-/via-/to- : Définition des couleurs du gradient
             */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#006994]/20 via-[#020A19]/50 to-[#020A19]" />

            <div className="relative z-10 flex flex-col items-center">
                {/**
                 * Conteneur du radar/sonar
                 *
                 * DIMENSIONS :
                 * - w-64 h-64 : Carré de 256x256px
                 * - mb-16 : Marge bottom de 64px (espacement avec le titre)
                 *
                 * CONTENU :
                 * 1. Cercles concentriques (distance markers)
                 * 2. Réticule central (crosshairs)
                 * 3. Ligne de balayage rotative (radar sweep)
                 * 4. Point central
                 * 5. Blips animés (objets détectés)
                 */}
                <div className="relative mb-16 w-64 h-64 flex items-center justify-center">
                    {/**
                     * Cercles concentriques (Distance Markers)
                     *
                     * FONCTION :
                     * Simulent les anneaux de distance d'un radar/sonar
                     *
                     * DISPOSITION :
                     * - inset-0 : Cercle extérieur (256x256px, rayon 128px)
                     * - inset-[15%] : 2e cercle (85% du rayon, ~109px)
                     * - inset-[30%] : 3e cercle (70% du rayon, ~90px)
                     * - inset-[45%] : Cercle intérieur (55% du rayon, ~70px)
                     *
                     * STYLE :
                     * - rounded-full : Forme circulaire
                     * - border border-[#4CBBD5]/X : Bordure cyan avec opacité décroissante
                     * - Opacités : 30%, 20%, 10%, 5% (du plus extérieur au plus intérieur)
                     */}
                    <div className="absolute inset-0 rounded-full border border-[#4CBBD5]/30" />
                    <div className="absolute inset-[15%] rounded-full border border-[#4CBBD5]/20" />
                    <div className="absolute inset-[30%] rounded-full border border-[#4CBBD5]/10" />
                    <div className="absolute inset-[45%] rounded-full border border-[#4CBBD5]/5" />

                    {/**
                     * Réticule central (Crosshairs)
                     *
                     * FONCTION :
                     * Lignes horizontale et verticale se croisant au centre du radar
                     *
                     * STRUCTURE :
                     * - Conteneur flex centré (items-center justify-center)
                     * - Ligne horizontale : w-full h-[1px]
                     * - Ligne verticale : h-full w-[1px] en position absolue
                     *
                     * STYLE :
                     * - bg-[#4CBBD5]/20 : Cyan à 20% d'opacité
                     */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-[#4CBBD5]/20" />
                        <div className="h-full w-[1px] bg-[#4CBBD5]/20 absolute" />
                    </div>

                    {/**
                     * Ligne de balayage radar (Radar Sweep)
                     *
                     * ANIMATION :
                     * - animate-spin-radar : Rotation infinie (définie dans tailwind.config)
                     * - overflow-hidden : Contient le gradient dans le cercle
                     *
                     * GRADIENT CONIQUE :
                     * - conic-gradient : Gradient circulaire (comme une tarte)
                     * - 0-270° : Transparent (3/4 du cercle)
                     * - 270-300° : Transition transparent -> cyan/10
                     * - 300-360° : Cyan/10 -> cyan/40 (ligne de balayage visible)
                     *
                     * EFFET VISUEL :
                     * Simule le balayage d'un radar détectant les objets
                     */}
                    <div className="absolute inset-0 rounded-full animate-spin-radar overflow-hidden">
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(76,187,213,0.1)_300deg,rgba(76,187,213,0.4)_360deg)]" />
                    </div>

                    {/**
                     * Point central du radar
                     *
                     * FONCTION :
                     * Représente la position du sonar/radar (origine du balayage)
                     *
                     * STYLE :
                     * - w-2 h-2 : Diamètre 8px
                     * - bg-[#4CBBD5] : Cyan plein
                     * - rounded-full : Forme circulaire
                     * - shadow-[0_0_10px_#4CBBD5] : Effet glow cyan
                     * - z-20 : Au-dessus de tout le radar
                     */}
                    <div className="absolute w-2 h-2 bg-[#4CBBD5] rounded-full shadow-[0_0_10px_#4CBBD5] z-20" />

                    {/**
                     * Blips (Objets détectés par le radar)
                     *
                     * FONCTION :
                     * Points lumineux apparaissant/disparaissant simulant des objets détectés
                     *
                     * POSITIONS :
                     * - Blip 1 : top-[20%] right-[30%] (haut droite)
                     * - Blip 2 : bottom-[30%] left-[25%] (bas gauche)
                     * - Blip 3 : top-[40%] left-[40%] (milieu gauche)
                     *
                     * TAILLES :
                     * - Blip 1 : w-1.5 h-1.5 (6px, cyan)
                     * - Blip 2 : w-2 h-2 (8px, blanc - prioritaire)
                     * - Blip 3 : w-1 h-1 (4px, cyan)
                     *
                     * ANIMATIONS :
                     * - animate-blip : Fade in/out (défini dans tailwind.config)
                     * - opacity-0 : Invisible par défaut
                     * - animationDelay : 1s, 2.5s, 4s (apparition progressive)
                     */}
                    <div className="absolute top-[20%] right-[30%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full animate-blip opacity-0" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-white rounded-full animate-blip opacity-0" style={{ animationDelay: '2.5s' }} />
                    <div className="absolute top-[40%] left-[40%] w-1 h-1 bg-[#4CBBD5] rounded-full animate-blip opacity-0" style={{ animationDelay: '4s' }} />
                </div>

                {/**
                 * Titre et statistiques sous le radar
                 *
                 * CONTENU :
                 * 1. Titre "ABYSSE" en grande typographie
                 * 2. Label "INITIALISATION"
                 * 3. Pourcentage de progression
                 *
                 * LAYOUT :
                 * - text-center : Tout centré
                 * - space-y-2 : Espacement vertical de 8px entre les éléments
                 */}
                <div className="text-center space-y-2">
                    {/**
                     * Titre principal "ABYSSE"
                     *
                     * TYPOGRAPHIE :
                     * - text-6xl : Taille 60px (4rem)
                     * - font-bold : Poids gras
                     * - tracking-[0.2em] : Espacement des lettres élargi (20%)
                     * - font-glancyr : Police custom (si chargée)
                     *
                     * EFFETS :
                     * - text-white : Couleur blanche
                     * - drop-shadow-[0_0_15px_rgba(76,187,213,0.5)] : Glow cyan autour du texte
                     */}
                    <h1 className="text-6xl font-bold text-white tracking-[0.2em] font-glancyr drop-shadow-[0_0_15px_rgba(76,187,213,0.5)]">
                        ABYSSE
                    </h1>

                    {/**
                     * Statistiques de chargement
                     *
                     * CONTENU :
                     * - Label "INITIALISATION" (style technique)
                     * - Pourcentage arrondi (ex: 78%)
                     *
                     * STYLE :
                     * - flex-col items-center : Empilage vertical centré
                     * - gap-1 : Espacement de 4px entre label et pourcentage
                     * - text-[#4CBBD5] : Cyan
                     * - font-mono : Police monospace (style terminal)
                     * - text-xs : Petit (12px)
                     * - tracking-[0.3em] : Espacement lettres élargi (30%)
                     * - opacity-80 : Légère transparence (80%)
                     */}
                    <div className="flex flex-col items-center gap-1 text-[#4CBBD5] font-mono text-xs tracking-[0.3em] opacity-80">
                        <span>INITIALISATION</span>
                        <span className="text-lg font-bold">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/**
             * Barre de progression en bas de l'écran
             *
             * POSITION :
             * - absolute bottom-12 : 48px depuis le bas
             * - left-1/2 -translate-x-1/2 : Centrage horizontal parfait
             *
             * DIMENSIONS :
             * - w-96 : Largeur 384px (24rem)
             * - h-[1px] : Hauteur 1px (ligne fine)
             *
             * STYLE :
             * - bg-white/10 : Fond blanc semi-transparent (track)
             * - rounded-full : Coins arrondis
             * - overflow-hidden : Contient le remplissage
             *
             * REMPLISSAGE (div enfant) :
             * - h-full : Même hauteur que le parent (1px)
             * - bg-[#4CBBD5] : Couleur cyan
             * - shadow-[0_0_20px_#4CBBD5] : Glow cyan autour de la barre
             * - transition-all duration-200 : Animation fluide (200ms)
             * - ease-linear : Progression linéaire (pas d'accélération)
             * - width dynamique : Suit le pourcentage de progression
             */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-96 h-[1px] bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#4CBBD5] shadow-[0_0_20px_#4CBBD5] transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

        </div>
    );
}
