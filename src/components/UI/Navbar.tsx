"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-8 transition-all duration-300 ${isOpen ? 'bg-transparent' : 'bg-gradient-to-b from-black/60 to-transparent'}`}>
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-[101] hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
            suppressHydrationWarning
          >
            <Image
              src="/assets/logo-final.svg"
              alt="ABYSSE"
              width={160}
              height={52}
              className="h-10 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu - Centré en absolu */}
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

          {/* CTA Button (Desktop) */}
          <Link
            href="/billetterie"
            className="hidden md:block group relative px-5 py-2.5 bg-[#4CBBD5] text-[#020A19] text-xs font-semibold uppercase tracking-[0.1em] overflow-hidden transition-all hover:bg-[#5DCCE6] rounded-full"
          >
            <span className="relative z-10">Billetterie</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[101] p-2 text-white hover:text-[#4CBBD5] transition-colors"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
