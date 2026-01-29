"use client";

/**
 * Composant de carte de statistique pour le dashboard
 * Affiche une icône, un label et une valeur avec code couleur
 * @param icon - Composant d'icône Lucide React
 * @param label - Label descriptif de la statistique
 * @param value - Valeur numérique ou textuelle
 * @param color - Couleur de l'icône (cyan, emerald, amber, purple)
 */
export function StatCard({
    icon: Icon,
    label,
    value,
    color = "cyan"
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: string
}) {
    // Classes CSS pour chaque couleur prédéfinie
    const colorClasses = {
        cyan: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30",
        emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-4">
                {/* Icône avec background coloré */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {/* Label et valeur */}
                <div>
                    <p className="text-white/50 text-sm">{label}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
}
