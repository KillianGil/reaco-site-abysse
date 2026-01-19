"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
    reducedMotion: boolean;
    setReducedMotion: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [reducedMotion, setReducedMotion] = useState(false);

    // Check for system preference and localStorage on mount
    useEffect(() => {
        // Check localStorage first
        const saved = localStorage.getItem("abysse-reduced-motion");
        if (saved !== null) {
            setReducedMotion(saved === "true");
            return;
        }

        // Fall back to system preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) {
            setReducedMotion(true);
        }
    }, []);

    // Save preference to localStorage
    useEffect(() => {
        localStorage.setItem("abysse-reduced-motion", String(reducedMotion));
    }, [reducedMotion]);

    return (
        <AccessibilityContext.Provider value={{ reducedMotion, setReducedMotion }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}
