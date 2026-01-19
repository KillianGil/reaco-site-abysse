"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Waves, Pause } from "lucide-react";

export function CalmModeToggle() {
    const { reducedMotion, setReducedMotion } = useAccessibility();

    return (
        <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center group ${
                reducedMotion
                    ? "bg-[#4CBBD5]/20 border-[#4CBBD5]/50 shadow-[0_0_20px_rgba(76,187,213,0.3)]"
                    : "bg-white/5 border-white/20 hover:border-white/40"
            }`}
            title={reducedMotion
                ? "Mode Calme actif - Animations figées. Cliquez pour réactiver les animations"
                : "Activer le Mode Calme - Fige les animations pour l'accessibilité et les performances"
            }
            aria-label={reducedMotion ? "Désactiver le mode calme" : "Activer le mode calme"}
            aria-pressed={reducedMotion}
        >
            {reducedMotion ? (
                <Pause className="w-5 h-5 text-[#4CBBD5]" />
            ) : (
                <Waves className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors" />
            )}

            {/* Tooltip amélioré */}
            <span className="absolute left-full ml-3 px-3 py-2 bg-[#031525]/95 border border-white/10 rounded-lg text-xs text-white/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                <span className="font-medium block">
                    {reducedMotion ? "Mode Calme actif" : "Mode Calme"}
                </span>
                <span className="text-white/60 text-[10px]">
                    {reducedMotion ? "Cliquez pour réactiver" : "Accessibilité & Performance"}
                </span>
            </span>
        </button>
    );
}
