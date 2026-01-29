/**
 * Composant : Pied de page du site
 *
 * DESCRIPTION :
 * Footer responsive organisé en 4 colonnes avec effets visuels de profondeur
 * océanique. Contient la navigation principale, les informations légales,
 * les coordonnées de contact et les réseaux sociaux.
 *
 * STRUCTURE :
 * - Colonne 1 (Brand) : Logo, description du musée, liens réseaux sociaux
 * - Colonne 2 (Navigation) : Liens principaux du site
 * - Colonne 3 (Informations) : Liens légaux (mentions, confidentialité, accessibilité)
 * - Colonne 4 (Contact) : Adresse, téléphone, email avec icônes
 *
 * EFFETS VISUELS :
 * - Fond sombre (#031525) avec bordure supérieure translucide
 * - 2 effets de lumière floue en arrière-plan (cyan et bleu foncé)
 * - Effets de blur (100px et 80px) pour créer une ambiance océanique
 *
 * RESPONSIVE :
 * - Mobile : 1 colonne, toutes les sections empilées verticalement
 * - Tablette (md) : 2 colonnes
 * - Desktop (lg) : 4 colonnes
 *
 * RÉSEAUX SOCIAUX :
 * - Instagram, LinkedIn, YouTube
 * - Boutons carrés avec icônes centrées
 * - Effet hover : fond cyan semi-transparent + bordure cyan
 *
 * ACCESSIBILITÉ :
 * - target="_blank" avec rel="noopener noreferrer" pour la sécurité
 * - aria-label sur chaque lien social pour les lecteurs d'écran
 * - Liens cliquables avec zones de clic généreuses (w-9 h-9)
 *
 * COPYRIGHT :
 * - Barre inférieure avec copyright et slogan "Un projet au coeur de Toulon"
 * - Séparateur visuel (border-t) pour distinguer du contenu principal
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube } from "lucide-react";

/**
 * Composant principal du Footer
 *
 * ARCHITECTURE :
 * - Footer en position relative pour contenir les effets de fond en absolu
 * - Conteneur max-w-7xl centré pour la largeur maximale
 * - Z-index 10 sur le contenu principal pour rester au-dessus des effets de fond
 *
 * EFFETS DE FOND :
 * - Deux cercles flous cyan/bleu positionnés en bas à gauche et droite
 * - pointer-events-none pour ne pas interférer avec les clics
 * - overflow-hidden pour contenir les cercles dans le footer
 */
export function Footer() {
    return (
        <footer className="relative bg-[#031525] border-t border-white/10">
            {/**
             * Effets de lumière d'ambiance en arrière-plan
             *
             * TECHNIQUE :
             * - Position absolue inset-0 pour couvrir tout le footer
             * - pointer-events-none pour permettre les clics à travers
             * - overflow-hidden pour contenir les cercles flous
             *
             * CERCLES DE LUMIÈRE :
             * 1. Cyan gauche (left-1/4) : 400x200px, blur 100px, opacité 5%
             * 2. Bleu foncé droite (right-1/4) : 300x150px, blur 80px, opacité 8%
             *
             * EFFET VISUEL :
             * Crée une ambiance sous-marine avec des halos de lumière diffuse
             */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#4CBBD5]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] bg-[#006994]/8 rounded-full blur-[80px]" />
            </div>

            {/* Conteneur principal du contenu du footer avec z-index pour rester au-dessus des effets */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                {/**
                 * Grille responsive à 4 colonnes
                 *
                 * RESPONSIVE :
                 * - Mobile (< md) : grid-cols-1 (tout empilé verticalement)
                 * - Tablette (md) : grid-cols-2 (2 colonnes côte à côte)
                 * - Desktop (lg) : grid-cols-4 (4 colonnes)
                 *
                 * ESPACEMENT :
                 * - gap-10 sur mobile pour bien séparer les sections
                 * - gap-8 sur desktop (sections plus proches)
                 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

                    {/**
                     * Colonne 1 : Identité du musée (Brand)
                     *
                     * CONTENU :
                     * - Logo ABYSSE (lien vers l'accueil)
                     * - Description courte du musée (baseline)
                     * - 3 boutons de réseaux sociaux (Instagram, LinkedIn, YouTube)
                     *
                     * LOGO :
                     * - Taille fixe h-10 pour cohérence visuelle
                     * - unoptimized: true car logo déjà optimisé
                     * - Effet hover : opacity-80 pour feedback visuel
                     *
                     * RÉSEAUX SOCIAUX :
                     * - Boutons carrés 9x9 (36x36px) avec icônes centrées
                     * - Fond blanc/5 au repos, cyan/20 au hover
                     * - Bordure blanche/10 au repos, cyan/50 au hover
                     * - Transitions fluides sur toutes les propriétés (transition-all)
                     */}
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            className="inline-block mb-4 hover:opacity-80 transition-opacity"
                        >
                            <Image
                                src="/assets/logofinal.png"
                                alt="ABYSSE"
                                width={150}
                                height={50}
                                className="h-10 w-auto"
                                unoptimized
                            />
                        </Link>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            Le premier musée immersif dédié aux grandes profondeurs, au coeur de Toulon.
                        </p>

                        {/* Boutons de réseaux sociaux avec effets hover cyan */}
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4CBBD5]/20 hover:border-[#4CBBD5]/50 border border-white/10 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4 text-white/70" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4CBBD5]/20 hover:border-[#4CBBD5]/50 border border-white/10 transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4 text-white/70" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4CBBD5]/20 hover:border-[#4CBBD5]/50 border border-white/10 transition-all"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-4 h-4 text-white/70" />
                            </a>
                        </div>
                    </div>

                    {/**
                     * Colonne 2 : Navigation principale du site
                     *
                     * TITRE :
                     * - "EXPLORER" en cyan (#4CBBD5)
                     * - text-xs avec tracking élargi pour effet moderne
                     * - font-bold + uppercase pour emphase
                     *
                     * LIENS :
                     * - 5 pages principales du site
                     * - Texte blanc/60 au repos, cyan au hover
                     * - Espacement vertical de 3 unités (space-y-3)
                     * - Transitions fluides sur la couleur (transition-colors)
                     *
                     * ACCESSIBILITÉ :
                     * - Liste sémantique (ul/li) pour lecteurs d'écran
                     */}
                    <div>
                        <h4 className="text-xs font-bold text-[#4CBBD5] uppercase tracking-[0.2em] mb-4">Explorer</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/visiter" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Visiter
                                </Link>
                            </li>
                            <li>
                                <Link href="/informations" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Informations
                                </Link>
                            </li>
                            <li>
                                <Link href="/actualites" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Actualités
                                </Link>
                            </li>
                            <li>
                                <Link href="/partenaires" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Partenaires
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/**
                     * Colonne 3 : Informations légales
                     *
                     * TITRE :
                     * - "INFORMATIONS" en cyan
                     * - Même style que la colonne Navigation pour cohérence
                     *
                     * LIENS LÉGAUX :
                     * - Mentions Légales (obligations légales RGPD)
                     * - Politique de Confidentialité (traitement des données)
                     * - Accessibilité (conformité WCAG)
                     *
                     * IMPORTANCE :
                     * Ces pages sont obligatoires pour tout site web français
                     * en conformité avec la loi pour une République numérique
                     */}
                    <div>
                        <h4 className="text-xs font-bold text-[#4CBBD5] uppercase tracking-[0.2em] mb-4">Informations</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/mentions-legales" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Mentions Legales
                                </Link>
                            </li>
                            <li>
                                <Link href="/confidentialite" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Politique de Confidentialite
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessibilite" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Accessibilite
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/**
                     * Colonne 4 : Coordonnées de contact
                     *
                     * TITRE :
                     * - "CONTACT" en cyan
                     *
                     * INFORMATIONS AVEC ICÔNES :
                     * 1. Adresse physique (MapPin) :
                     *    - Port Marchand, 83000 Toulon
                     *    - items-start pour aligner l'icône en haut du texte multilignes
                     *    - mt-0.5 sur l'icône pour ajustement visuel fin
                     *
                     * 2. Téléphone (Phone) :
                     *    - Lien cliquable href="tel:..." pour appel direct sur mobile
                     *    - Format français : 04 94 00 00 00
                     *
                     * 3. Email (Mail) :
                     *    - Lien cliquable href="mailto:..." pour ouvrir le client mail
                     *    - contact@musee-abysse.fr
                     *
                     * ICÔNES :
                     * - Taille 4x4 (16x16px) en cyan (#4CBBD5)
                     * - flex-shrink-0 pour empêcher le rétrécissement sur mobile
                     * - gap-3 pour espacement harmonieux entre icône et texte
                     */}
                    <div>
                        <h4 className="text-xs font-bold text-[#4CBBD5] uppercase tracking-[0.2em] mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-[#4CBBD5] mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/60">Port Marchand, 83000 Toulon</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#4CBBD5] flex-shrink-0" />
                                <a href="tel:+33494000000" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    04 94 00 00 00
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#4CBBD5] flex-shrink-0" />
                                <a href="mailto:contact@musee-abysse.fr" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    contact@musee-abysse.fr
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/**
                 * Barre inférieure : Copyright et slogan
                 *
                 * STYLE :
                 * - Séparateur visuel : bordure supérieure blanche/10
                 * - Marges : mt-12 (espacement depuis le contenu) + pt-6 (padding interne)
                 * - Flexbox responsive : colonne sur mobile, ligne sur desktop
                 *
                 * CONTENU :
                 * 1. Copyright :
                 *    - "© 2025 Musee Abysse. Tous droits reserves."
                 *    - text-white/40 pour texte discret
                 *    - Centré sur mobile, aligné à gauche sur desktop
                 *
                 * 2. Slogan :
                 *    - "Un projet au coeur de Toulon"
                 *    - text-white/30 encore plus discret
                 *    - Ancrage territorial du projet
                 *
                 * RESPONSIVE :
                 * - flex-col sur mobile (empilage vertical)
                 * - flex-row sur desktop (côte à côte)
                 * - justify-between pour espacer copyright et slogan
                 */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/40 text-center md:text-left">
                        © 2025 Musee Abysse. Tous droits reserves.
                    </p>
                    <p className="text-xs text-white/30">
                        Un projet au coeur de Toulon
                    </p>
                </div>
            </div>
        </footer>
    );
}
