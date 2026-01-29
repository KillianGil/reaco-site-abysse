"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";

const SESSION_KEY = "abysse_admin_session";

/**
 * Interface du contexte d'authentification admin
 * Fournit les méthodes de login/logout et l'état d'authentification
 */
interface AdminContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

/**
 * Hook pour accéder au contexte d'authentification admin
 * Doit être utilisé dans un composant enfant de AdminProvider
 * @throws {Error} Si utilisé hors d'un AdminProvider
 */
export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within AdminProvider");
    }
    return context;
}

/**
 * Provider d'authentification admin
 * Gère la session via sessionStorage et les appels API de login
 */
export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier la session existante au chargement
    useEffect(() => {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session === "authenticated") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    /**
     * Authentifie l'utilisateur avec un mot de passe
     * @param password - Mot de passe admin
     * @returns true si authentification réussie, false sinon
     */
    const login = async (password: string): Promise<boolean> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                sessionStorage.setItem(SESSION_KEY, "authenticated");
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    /**
     * Déconnecte l'utilisateur et nettoie la session
     */
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem(SESSION_KEY);
    };

    // Afficher un loader pendant la vérification de session
    // Évite le flash de contenu non authentifié
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#041C30] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#4CBBD5] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
}
