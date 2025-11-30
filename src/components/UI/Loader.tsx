"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function Loader() {
    const { active, progress } = useProgress();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!active && progress === 100) {
            const timer = setTimeout(() => setShow(false), 800); // Un peu plus long pour la fin
            return () => clearTimeout(timer);
        } else {
            setShow(true);
        }
    }, [active, progress]);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020A19] transition-opacity duration-1000 ${!active && progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#006994]/20 via-[#020A19]/50 to-[#020A19]" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Sonar/Radar Container */}
                <div className="relative mb-16 w-64 h-64 flex items-center justify-center">
                    {/* Concentric Circles (Distance Markers) */}
                    <div className="absolute inset-0 rounded-full border border-[#4CBBD5]/30" />
                    <div className="absolute inset-[15%] rounded-full border border-[#4CBBD5]/20" />
                    <div className="absolute inset-[30%] rounded-full border border-[#4CBBD5]/10" />
                    <div className="absolute inset-[45%] rounded-full border border-[#4CBBD5]/5" />

                    {/* Crosshairs */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-[#4CBBD5]/20" />
                        <div className="h-full w-[1px] bg-[#4CBBD5]/20 absolute" />
                    </div>

                    {/* Radar Sweep (Conic Gradient) */}
                    <div className="absolute inset-0 rounded-full animate-spin-radar overflow-hidden">
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(76,187,213,0.1)_300deg,rgba(76,187,213,0.4)_360deg)]" />
                    </div>

                    {/* Center Dot */}
                    <div className="absolute w-2 h-2 bg-[#4CBBD5] rounded-full shadow-[0_0_10px_#4CBBD5] z-20" />

                    {/* Blips (Detected Objects) - Animated */}
                    <div className="absolute top-[20%] right-[30%] w-1.5 h-1.5 bg-[#4CBBD5] rounded-full animate-blip opacity-0" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-white rounded-full animate-blip opacity-0" style={{ animationDelay: '2.5s' }} />
                    <div className="absolute top-[40%] left-[40%] w-1 h-1 bg-[#4CBBD5] rounded-full animate-blip opacity-0" style={{ animationDelay: '4s' }} />
                </div>

                {/* Title & Stats below Radar */}
                <div className="text-center space-y-2">
                    <h1 className="text-6xl font-bold text-white tracking-[0.2em] font-glancyr drop-shadow-[0_0_15px_rgba(76,187,213,0.5)]">
                        ABYSSE
                    </h1>
                    <div className="flex flex-col items-center gap-1 text-[#4CBBD5] font-mono text-xs tracking-[0.3em] opacity-80">
                        <span>INITIALISATION</span>
                        <span className="text-lg font-bold">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Loading Bar at bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-96 h-[1px] bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#4CBBD5] shadow-[0_0_20px_#4CBBD5] transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <style jsx>{`
        @keyframes spin-radar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-radar {
          animation: spin-radar 3s linear infinite;
        }
        @keyframes blip {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 10px #4CBBD5; }
          100% { opacity: 0; transform: scale(1); }
        }
        .animate-blip {
          animation: blip 2s ease-out infinite;
        }
      `}</style>
        </div>
    );
}
