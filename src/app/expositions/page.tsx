import { Navbar } from "@/components/UI";

export default function ExpositionsPage() {
    return (
        <main className="min-h-screen bg-[#020A19] text-white pt-32 px-6 md:px-20">
            <Navbar />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-8">Expositions</h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                    Découvrez nos expositions temporaires et permanentes, plongeant au cœur de l&apos;histoire sous-marine et de la biodiversité.
                </p>
            </div>
        </main>
    );
}
