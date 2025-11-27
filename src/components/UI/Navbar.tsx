"use client";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase hover:text-white transition-colors">
          ABYSSE
        </a>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#histoire" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Histoire
          </a>
          <a href="#musee" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Le Musée
          </a>
          <a href="#experience" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Expérience
          </a>
          <a href="#partenaires" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Partenaires
          </a>
        </div>

        {/* CTA Button */}
        <a 
          href="#contact" 
          className="group relative px-5 py-2.5 bg-[#4CBBD5] text-[#020A19] text-[10px] font-semibold uppercase tracking-[0.1em] overflow-hidden transition-all hover:bg-[#5DCCE6]"
        >
          <span className="relative z-10">Infos & Billetterie</span>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </a>
      </div>
    </nav>
  );
}
