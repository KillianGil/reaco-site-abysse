import { Navbar } from "@/components/UI";

export default function PartenairesPage() {
    return (
        <main className="min-h-screen bg-[#020A19] text-white pt-32 px-6 md:px-20">
            <Navbar />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-8">Nos Partenaires</h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-12">
                    Ils soutiennent le projet ABYSSE et contribuent à la préservation du patrimoine maritime.
                </p>

                {/* Placeholder grid for partners */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="text-sm tracking-widest uppercase">Partenaire {i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
