"use client";

import Link from "next/link";
import { CheckCircle, X } from "lucide-react";

/**
 * Props du modal de succès
 */
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

/**
 * Modal de confirmation/succès réutilisable
 * Affiche un message de succès avec des actions optionnelles
 * @param isOpen - État d'ouverture du modal
 * @param onClose - Callback de fermeture
 * @param title - Titre du modal
 * @param message - Message descriptif
 * @param actions - Actions optionnelles (boutons ou liens)
 */
export function SuccessModal({ isOpen, onClose, title, message, actions }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop avec blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal content */}
            <div className="relative bg-[#041C30] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icône de succès */}
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>

                {/* Titre et message */}
                <h2 className="text-xl font-semibold text-white text-center mb-2">{title}</h2>
                <p className="text-white/60 text-center mb-6">{message}</p>

                {/* Actions (boutons ou liens) */}
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
