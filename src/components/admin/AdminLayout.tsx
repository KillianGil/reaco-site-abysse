"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Home, FileText, PlusCircle, LayoutDashboard, LogOut, Tag } from "lucide-react";
import { useAdmin } from "./AdminProvider";

/**
 * Layout d'administration avec sidebar et navigation
 * Fournit la structure de base pour toutes les pages admin
 * @param children - Contenu de la page
 * @param title - Titre affiché dans le header
 */
export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
    const { logout } = useAdmin();
    const pathname = usePathname();

    // Configuration de la navigation
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/articles", label: "Gérer les articles", icon: FileText },
        { href: "/admin/categories", label: "Catégories", icon: Tag },
        { href: "/admin/nouveau", label: "Nouvel article", icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-[#041C30] text-white">
            {/* Background décoratif */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-20 flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-64 bg-[#020A19]/80 backdrop-blur-sm border-r border-white/10 flex flex-col">
                    {/* Logo et titre */}
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

                    {/* Navigation principale */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive
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

                    {/* Footer avec boutons de navigation secondaires */}
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
                    {/* Header sticky avec titre */}
                    <header className="sticky top-0 z-10 bg-[#041C30]/80 backdrop-blur-sm border-b border-white/10 px-8 py-4">
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </header>

                    {/* Contenu de la page */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
