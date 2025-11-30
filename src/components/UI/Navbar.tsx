import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-5 bg-gradient-to-b from-black/30 to-transparent">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white/90 text-xl font-bold tracking-[0.2em] uppercase hover:text-white transition-colors">
          ABYSSE
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/expositions" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Expositions
          </Link>
          <Link href="/informations" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Informations
          </Link>
          <Link href="/partenaires" className="text-[11px] text-white/50 uppercase tracking-[0.15em] hover:text-white/90 transition-colors">
            Partenaires
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/billetterie"
          className="group relative px-5 py-2.5 bg-[#4CBBD5] text-[#020A19] text-[10px] font-semibold uppercase tracking-[0.1em] overflow-hidden transition-all hover:bg-[#5DCCE6] rounded-full"
        >
          <span className="relative z-10">Billetterie</span>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </Link>
      </div>
    </nav>
  );
}
