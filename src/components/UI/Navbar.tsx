/**
 * Composant : Barre de navigation principale du site
 *
 * DESCRIPTION :
 * Navigation responsive avec logo, menu desktop centré, bouton CTA billetterie
 * et menu hamburger mobile. Le fond devient transparent quand le menu mobile est ouvert.
 *
 * COMPORTEMENT RESPONSIVE :
 * - Desktop (md+) : Logo à gauche, menu centré (position absolue), bouton billetterie à droite
 * - Mobile : Logo à gauche, bouton hamburger à droite, menu full-screen overlay
 *
 * NAVIGATION DESKTOP :
 * - 5 liens principaux : Visiter, Informations, Actualités, Partenaires, Contact
 * - Positionnement centré absolu (left-1/2 top-1/2 -translate)
 * - Effet hover : soulignement animé (ligne blanche qui s'étend de gauche à droite)
 * - Typographie : uppercase, tracking élargi, text-xs
 *
 * BOUTON CTA BILLETTERIE :
 * - Couleur accent cyan (#4CBBD5) avec effet shimmer au hover
 * - Gradient animé qui se déplace de gauche à droite au survol
 * - Coins arrondis (rounded-full)
 *
 * BOUTON HAMBURGER MOBILE :
 * - Icône Menu ou X selon l'état isOpen
 * - Z-index élevé pour rester au-dessus du menu overlay
 * - Transition de couleur au hover (blanc -> cyan)
 *
 * ÉTATS :
 * - isOpen : Contrôle l'affichage du menu mobile et le fond de la navbar
 *
 * ACCESSIBILITÉ :
 * - aria-label sur le bouton hamburger (décrit l'action)
 * - suppressHydrationWarning sur le logo pour éviter les erreurs SSR
 * - priority sur l'image logo pour optimiser le LCP (Largest Contentful Paint)
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

/**
 * Composant principal de la barre de navigation
 *
 * ARCHITECTURE :
 * - Navigation fixe en haut de page (fixed top-0)
 * - Z-index 100 pour rester au-dessus du contenu mais sous le menu mobile (z-90)
 * - Conteneur flex avec justify-between pour espacer logo et CTA
 * - Menu desktop en position absolue pour centrage parfait
 *
 * GESTION DU FOND :
 * - Menu fermé : Gradient noir semi-transparent (from-black/60)
 * - Menu ouvert : Fond transparent pour laisser voir le menu overlay
 */
export function Navbar() {
  // État local pour gérer l'ouverture/fermeture du menu mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Barre de navigation principale */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-8 transition-all duration-300 ${isOpen ? 'bg-transparent' : 'bg-gradient-to-b from-black/60 to-transparent'}`}>
        <div className="flex items-center justify-between relative">

          {/**
           * Logo ABYSSE
           *
           * COMPORTEMENT :
           * - Lien vers la page d'accueil (/)
           * - Ferme automatiquement le menu mobile au clic
           * - Z-index 101 pour rester au-dessus du bouton hamburger
           *
           * IMAGE :
           * - Taille responsive : h-10 mobile, h-14 desktop
           * - unoptimized: true pour éviter l'optimisation Next.js (logo déjà optimisé)
           * - priority: true pour charger l'image en priorité (au-dessus du fold)
           *
           * ACCESSIBILITÉ :
           * - suppressHydrationWarning évite les erreurs de mismatch SSR/Client
           * - alt="ABYSSE" pour les lecteurs d'écran
           */}
          <Link
            href="/"
            className="relative z-[101] hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
            suppressHydrationWarning
          >
            <Image
              src="/assets/logofinal.png"
              alt="ABYSSE"
              width={160}
              height={52}
              className="h-10 md:h-14 w-auto"
              unoptimized
              priority
            />
          </Link>

          {/**
           * Menu de navigation desktop (caché sur mobile)
           *
           * POSITIONNEMENT :
           * - Position absolue avec centrage parfait : left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
           * - Permet au logo et au bouton CTA de rester sur les côtés
           * - hidden md:flex pour afficher uniquement sur desktop
           *
           * LIENS DE NAVIGATION :
           * - 5 liens principaux du site
           * - Chaque lien est un groupe avec effet hover coordonné
           * - Texte : blanc/60 au repos, blanc au hover
           * - Soulignement animé : ligne blanche qui apparaît de gauche à droite
           *
           * EFFET HOVER :
           * - Texte passe de text-white/60 à text-white
           * - Ligne de soulignement s'étend de w-0 à w-full
           * - Transition de 300ms sur la largeur (duration-300)
           * - Position absolue (-bottom-1) pour placer la ligne sous le texte
           */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/visiter" className="group relative text-xs text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors">
              Visiter
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/informations" className="group relative text-xs text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors">
              Informations
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/actualites" className="group relative text-xs text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors">
              Actualités
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/partenaires" className="group relative text-xs text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors">
              Partenaires
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/contact" className="group relative text-xs text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors">
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/**
           * Bouton CTA "Billetterie" (desktop uniquement)
           *
           * STYLE :
           * - Bouton arrondi (rounded-full) avec couleur accent cyan (#4CBBD5)
           * - Texte en uppercase avec espacement des lettres (tracking-[0.1em])
           * - Fond sombre (#020A19) pour le texte, excellente lisibilité
           *
           * EFFET HOVER :
           * - Changement de couleur de fond : #4CBBD5 -> #5DCCE6 (plus clair)
           * - Effet shimmer : gradient blanc/30 qui traverse le bouton de gauche à droite
           * - Durée de l'animation shimmer : 700ms
           *
           * TECHNIQUE :
           * - overflow-hidden pour contenir le gradient animé
           * - Position relative sur le bouton pour contenir le span z-10
           * - Gradient en position absolue qui se translate de -100% à 100%
           *
           * RESPONSIVE :
           * - hidden md:block : Caché sur mobile (remplacé par le hamburger)
           */}
          <Link
            href="/billetterie"
            className="hidden md:block group relative px-5 py-2.5 bg-[#4CBBD5] text-[#020A19] text-xs font-semibold uppercase tracking-[0.1em] overflow-hidden transition-all hover:bg-[#5DCCE6] rounded-full"
          >
            <span className="relative z-10">Billetterie</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </Link>

          {/**
           * Bouton hamburger mobile (mobile uniquement)
           *
           * FONCTIONNEMENT :
           * - Toggle l'état isOpen au clic (menu ouvert/fermé)
           * - Affiche l'icône Menu (☰) quand fermé, icône X (✕) quand ouvert
           * - md:hidden : Visible uniquement sur mobile et tablettes
           *
           * VISUEL :
           * - Z-index 101 pour rester au-dessus du menu overlay (z-90)
           * - Icônes de taille 28px pour faciliter le clic sur mobile
           * - Transition de couleur au hover : blanc -> cyan
           *
           * ACCESSIBILITÉ :
           * - aria-label dynamique qui décrit l'action ("Ouvrir le menu" ou "Fermer le menu")
           * - Permet aux lecteurs d'écran de comprendre l'état actuel du menu
           */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[101] p-2 text-white hover:text-[#4CBBD5] transition-colors"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/**
       * Menu mobile en overlay plein écran
       *
       * COMPOSANT :
       * - MobileMenu : Overlay animé avec Framer Motion
       * - isOpen : Contrôle l'affichage (AnimatePresence gère l'animation exit)
       * - onClose : Callback pour fermer le menu (setIsOpen(false))
       *
       * COMPORTEMENT :
       * - Overlay full-screen (fixed inset-0) en z-90
       * - Animation slide-in depuis la droite (x: 100% -> 0%)
       * - Bloque le scroll du body quand ouvert (overflow: hidden)
       * - Se ferme au clic sur un lien ou sur le bouton X
       */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
