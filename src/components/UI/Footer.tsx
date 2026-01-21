"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-[#031525] border-t border-white/10">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#4CBBD5]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] bg-[#006994]/8 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

                    {/* Brand */}
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

                    {/* Navigation */}
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
                                <Link href="/actualites" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Actualités
                                </Link>
                            </li>
                            <li>
                                <Link href="/informations" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Informations
                                </Link>
                            </li>
                            <li>
                                <Link href="/partenaires" className="text-sm text-white/60 hover:text-[#4CBBD5] transition-colors">
                                    Partenaires
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
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

                    {/* Contact */}
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

                {/* Bottom bar */}
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
