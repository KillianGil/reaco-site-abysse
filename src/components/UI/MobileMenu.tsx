/**
 * Composant : Menu mobile en overlay plein écran
 *
 * DESCRIPTION :
 * Menu de navigation mobile qui s'affiche en overlay plein écran avec animations
 * Framer Motion. S'ouvre depuis la droite avec effet slide-in et stagger sur les liens.
 *
 * COMPORTEMENT :
 * - Overlay plein écran (fixed inset-0) activé uniquement sur mobile (md:hidden)
 * - Animation d'entrée : slide depuis la droite (x: 100% -> 0%)
 * - Animation de sortie : slide vers la droite (x: 0% -> 100%)
 * - Bloque le scroll du body quand ouvert (overflow: hidden)
 * - Se ferme au clic sur un lien ou sur le bouton X de la Navbar
 *
 * ANIMATIONS FRAMER MOTION :
 * - menuVariants : Contrôle l'animation du conteneur entier
 *   - closed : opacity 0, x: 100% (hors écran à droite)
 *   - open : opacity 1, x: 0% (visible)
 *   - Easing custom [0.22, 1, 0.36, 1] (ease-out-cubic fluide)
 *   - Stagger sur les enfants : 0.1s entre chaque lien
 *
 * - linkVariants : Contrôle l'animation de chaque lien
 *   - closed : opacity 0, x: 50 (décalé vers la droite)
 *   - open : opacity 1, x: 0 (position normale)
 *
 * LIENS DE NAVIGATION :
 * - 6 liens : Visiter, Actualités, Informations, Partenaires, Contact, Billetterie
 * - Numérotation à gauche (01-06) en cyan semi-transparent
 * - Texte en text-4xl pour faciliter le clic sur mobile
 * - Billetterie en couleur accent cyan + font-semibold (CTA)
 *
 * DESIGN VISUEL :
 * - Fond sombre (#020A19/95) avec backdrop-blur-xl
 * - 2 cercles de lumière floue en arrière-plan (cyan/5)
 * - Footer avec infos musée (adresse Toulon) en bas de l'overlay
 *
 * GESTION DU SCROLL :
 * - useEffect surveille isOpen
 * - Si ouvert : document.body.style.overflow = "hidden"
 * - Si fermé : document.body.style.overflow = "unset"
 * - Cleanup au démontage pour éviter les bugs
 *
 * ACCESSIBILITÉ :
 * - Z-index 90 (sous la navbar qui est en z-100)
 * - AnimatePresence gère le démontage animé proprement
 * - Transitions fluides (500ms) pour éviter les mouvements brusques
 *
 * PROPS :
 * - isOpen (boolean) : État d'ouverture du menu
 * - onClose (() => void) : Callback appelé à la fermeture (clic sur lien)
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Interface TypeScript des props du composant
 *
 * PROPS :
 * - isOpen : Contrôle l'affichage du menu (AnimatePresence gère le unmount)
 * - onClose : Fonction appelée quand l'utilisateur clique sur un lien
 */
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Variantes d'animation pour le conteneur du menu
 *
 * CLOSED (état fermé) :
 * - opacity: 0 (invisible)
 * - x: "100%" (hors écran à droite)
 * - duration: 0.5s
 * - staggerChildren: 0.05s (entre chaque lien en sortie)
 * - staggerDirection: -1 (ordre inversé en sortie)
 *
 * OPEN (état ouvert) :
 * - opacity: 1 (visible)
 * - x: "0%" (position normale)
 * - duration: 0.5s
 * - delayChildren: 0.2s (attend 200ms avant d'animer les liens)
 * - staggerChildren: 0.1s (100ms entre chaque lien)
 *
 * EASING :
 * - [0.22, 1, 0.36, 1] : Courbe de Bézier cubique
 * - Équivalent à ease-out-cubic : démarrage rapide, ralentissement fluide
 */
const menuVariants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            duration: 0.5,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ease: [0.22, 1, 0.36, 1] as any,
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
    open: {
        opacity: 1,
        x: "0%",
        transition: {
            duration: 0.5,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ease: [0.22, 1, 0.36, 1] as any,
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

/**
 * Variantes d'animation pour chaque lien individuel
 *
 * CLOSED :
 * - opacity: 0 (invisible)
 * - x: 50 (décalé de 50px vers la droite)
 *
 * OPEN :
 * - opacity: 1 (visible)
 * - x: 0 (position normale)
 *
 * COMPORTEMENT :
 * - Hérite du timing du parent (menuVariants.staggerChildren)
 * - Chaque lien apparaît avec 100ms de décalage (effet cascade)
 */
const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
};

/**
 * Configuration des liens de navigation
 *
 * STRUCTURE :
 * - name : Texte affiché
 * - href : Route Next.js
 * - isCta : true pour le lien Billetterie (style différencié)
 *
 * ORDRE :
 * Les liens sont numérotés de 01 à 06 dans l'affichage
 */
const links = [
    { name: "Visiter", href: "/visiter" },
    { name: "Actualités", href: "/actualites" },
    { name: "Informations", href: "/informations" },
    { name: "Partenaires", href: "/partenaires" },
    { name: "Contact", href: "/contact" },
    { name: "Billetterie", href: "/billetterie", isCta: true },
];

/**
 * Composant principal du menu mobile
 *
 * LOGIQUE :
 * 1. Gestion du scroll du body selon isOpen
 * 2. AnimatePresence gère le montage/démontage animé
 * 3. Chaque lien appelle onClose() au clic pour fermer le menu
 *
 * RESPONSIVE :
 * - md:hidden : Visible uniquement sur mobile et tablettes (< 768px)
 * - Sur desktop, le menu de la Navbar est utilisé à la place
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    /**
     * Hook : Verrouillage du scroll du body quand le menu est ouvert
     *
     * PROBLÈME RÉSOLU :
     * Quand le menu overlay est ouvert, l'utilisateur peut toujours scroller
     * la page en arrière-plan, ce qui crée une expérience utilisateur confuse.
     *
     * SOLUTION :
     * - Si isOpen = true : bloquer le scroll (overflow: hidden)
     * - Si isOpen = false : restaurer le scroll (overflow: unset)
     *
     * CLEANUP :
     * La fonction de return restaure le scroll au démontage du composant
     * pour éviter que le body reste bloqué si le composant est démonté.
     */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    className="fixed inset-0 z-[90] bg-[#020A19]/95 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
                >
                    {/**
                     * Éléments de fond décoratifs
                     *
                     * CERCLES DE LUMIÈRE :
                     * - 2 cercles flous en cyan semi-transparent (#4CBBD5/5)
                     * - Positionnés en haut à droite et en bas à gauche
                     * - Flou de 100px et 80px (blur-[100px], blur-[80px])
                     * - Débordent légèrement (top-[-10%], right-[-10%], etc.)
                     *
                     * TECHNIQUE :
                     * - Position absolue inset-0 pour couvrir tout l'overlay
                     * - pointer-events-none pour ne pas bloquer les clics
                     * - overflow-hidden pour contenir les cercles débordants
                     *
                     * EFFET VISUEL :
                     * Crée une ambiance océanique avec halos de lumière diffuse
                     */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4CBBD5]/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4CBBD5]/5 rounded-full blur-[80px]" />
                    </div>

                    {/**
                     * Navigation principale
                     *
                     * LAYOUT :
                     * - z-10 pour rester au-dessus des cercles de fond
                     * - flex-col pour empiler les liens verticalement
                     * - gap-8 pour espacement généreux (32px entre chaque lien)
                     *
                     * LIENS :
                     * - Chaque lien est animé avec linkVariants (stagger effect)
                     * - Numérotation 01-06 en cyan semi-transparent
                     * - Texte en text-4xl pour faciliter le clic
                     * - Tracking élargi (tracking-widest) pour style moderne
                     * - Billetterie en cyan + font-semibold (CTA)
                     */}
                    <nav className="relative z-10 flex flex-col gap-8">
                        {links.map((link, i) => (
                            <motion.div key={link.name} variants={linkVariants}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`block text-4xl font-light tracking-widest uppercase transition-colors ${link.isCta
                                        ? "text-[#4CBBD5] font-semibold"
                                        : "text-white hover:text-[#4CBBD5]"
                                        }`}
                                >
                                    {/**
                                     * Numérotation des liens
                                     *
                                     * FORMAT :
                                     * - text-xs font-mono pour style technique
                                     * - text-[#4CBBD5]/50 (cyan semi-transparent)
                                     * - mr-4 pour espacement de 16px depuis le texte
                                     * - align-top pour aligner avec le haut du texte
                                     *
                                     * AFFICHAGE :
                                     * - 01, 02, 03... jusqu'à 06
                                     * - Le 0 est ajouté pour les nombres < 10
                                     */}
                                    <span className="text-xs font-mono text-[#4CBBD5]/50 mr-4 align-top">
                                        0{i + 1}
                                    </span>
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/**
                     * Footer avec informations du musée
                     *
                     * POSITION :
                     * - Position absolue en bas (bottom-12)
                     * - Marges latérales identiques au nav (left-8 right-8)
                     *
                     * STYLE :
                     * - Bordure supérieure blanche/10 pour séparation visuelle
                     * - Padding top de 8 unités (32px)
                     * - Texte en font-mono pour style technique
                     * - uppercase + tracking-widest pour cohérence avec les liens
                     *
                     * CONTENU :
                     * - Nom du musée : "Musée Sous-Marin de Toulon"
                     * - Adresse : "Port de Toulon, 83000"
                     * - Couleur blanche/40 pour discrétion
                     *
                     * ANIMATION :
                     * - linkVariants pour apparaître en même temps que les liens
                     * - Dernier élément du stagger (apparaît après tous les liens)
                     */}
                    <motion.div
                        variants={linkVariants}
                        className="absolute bottom-12 left-8 right-8 border-t border-white/10 pt-8"
                    >
                        <div className="flex flex-col gap-2 text-white/40 text-xs font-mono tracking-widest uppercase">
                            <p>Musée Sous-Marin de Toulon</p>
                            <p>Port de Toulon, 83000</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
