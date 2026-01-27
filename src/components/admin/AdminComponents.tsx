"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, Home, FileText, PlusCircle, LayoutDashboard, LogOut, CheckCircle, X, Loader2, Tag } from "lucide-react";

const SESSION_KEY = "abysse_admin_session";

// Context pour l'authentification admin
interface AdminContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within AdminProvider");
    }
    return context;
}

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier la session au chargement
    useEffect(() => {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session === "authenticated") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

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

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem(SESSION_KEY);
    };

    // Éviter le flash de contenu pendant le chargement
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

// Modal de confirmation/succès
interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actions?: {
        label: string;
        href?: string;
        onClick?: () => void;
        primary?: boolean;
    }[];
}

export function SuccessModal({ isOpen, onClose, title, message, actions }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#041C30] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>

                {/* Content */}
                <h2 className="text-xl font-semibold text-white text-center mb-2">{title}</h2>
                <p className="text-white/60 text-center mb-6">{message}</p>

                {/* Actions */}
                {actions && actions.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {actions.map((action, index) => (
                            action.href ? (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-center transition-colors ${
                                        action.primary
                                            ? 'bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19]'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                                >
                                    {action.label}
                                </Link>
                            ) : (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                                        action.primary
                                            ? 'bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19]'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                                >
                                    {action.label}
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Login Screen Component
export function AdminLogin() {
    const { login } = useAdmin();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

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
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#4CBBD5]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#4CBBD5]/30">
                        <Lock className="w-8 h-8 text-[#4CBBD5]" />
                    </div>
                    <h1 className="text-2xl font-light text-white mb-2">Administration</h1>
                    <p className="text-white/50 text-sm">Accès réservé au personnel autorisé</p>
                </div>

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
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Mot de passe incorrect
                            </p>
                        )}
                    </div>

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

// Admin Layout with Sidebar
export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
    const { logout } = useAdmin();
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/articles", label: "Gérer les articles", icon: FileText },
        { href: "/admin/categories", label: "Catégories", icon: Tag },
        { href: "/admin/nouveau", label: "Nouvel article", icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-[#041C30] text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-20 flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-64 bg-[#020A19]/80 backdrop-blur-sm border-r border-white/10 flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4CBBD5]/20 rounded-xl flex items-center justify-center border border-[#4CBBD5]/30">
                                <Lock className="w-5 h-5 text-[#4CBBD5]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">ABYSSE</h1>
                                <p className="text-xs text-white/40">Administration</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-[#4CBBD5] text-[#020A19] font-medium'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <Home className="w-5 h-5" />
                            <span>Voir le site</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64">
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-[#041C30]/80 backdrop-blur-sm border-b border-white/10 px-8 py-4">
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </header>

                    {/* Content */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Stat Card Component
export function StatCard({ icon: Icon, label, value, color = "cyan" }: { icon: React.ElementType; label: string; value: string | number; color?: string }) {
    const colorClasses = {
        cyan: "bg-[#4CBBD5]/20 text-[#4CBBD5] border-[#4CBBD5]/30",
        emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-white/50 text-sm">{label}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
}
