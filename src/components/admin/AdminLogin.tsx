"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, AlertCircle, Home, Loader2 } from "lucide-react";
import { useAdmin } from "./AdminProvider";

/**
 * Page de connexion administrateur
 * Affiche un formulaire de mot de passe avec validation
 * Redirige automatiquement après authentification réussie
 */
export function AdminLogin() {
    const { login } = useAdmin();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    /**
     * Gère la soumission du formulaire de connexion
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setPasswordError(false);

        const success = await login(password);

        if (!success) {
            setPasswordError(true);
        }
        setIsLoggingIn(false);
    };

    return (
        <main className="min-h-screen bg-[#041C30] flex items-center justify-center p-4">
            {/* Background décoratif avec bulles animées */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#4CBBD5]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#4CBBD5]/30">
                        <Lock className="w-8 h-8 text-[#4CBBD5]" />
                    </div>
                    <h1 className="text-2xl font-light text-white mb-2">Administration</h1>
                    <p className="text-white/50 text-sm">Accès réservé au personnel autorisé</p>
                </div>

                {/* Formulaire de connexion */}
                <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <div className="mb-6">
                        <label className="block text-sm text-white/60 mb-2">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError(false);
                                }}
                                className={`w-full bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors pr-12`}
                                placeholder="Entrez le mot de passe"
                            />
                            {/* Bouton toggle visibilité du mot de passe */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {/* Message d'erreur */}
                        {passwordError && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Mot de passe incorrect
                            </p>
                        )}
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </form>

                {/* Lien de retour au site */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors inline-flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Retour au site
                    </Link>
                </div>
            </div>
        </main>
    );
}
