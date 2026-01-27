import { useState } from "react";
import { X, AlertCircle, Loader2, Trash2 } from "lucide-react";
import type { Category } from "@/types/category";

interface DeleteCategoryModalProps {
    isOpen: boolean;
    category: Category | null;
    articleCount: number;
    availableCategories: Category[];
    onConfirm: (replacementCategoryKey?: string) => Promise<void>;
    onCancel: () => void;
}

export function DeleteCategoryModal({
    isOpen,
    category,
    articleCount,
    availableCategories,
    onConfirm,
    onCancel
}: DeleteCategoryModalProps) {
    const [selectedReplacement, setSelectedReplacement] = useState<string>("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !category) return null;

    const needsReplacement = articleCount > 0;
    const otherCategories = availableCategories.filter(c => c.id !== category.id);

    const handleConfirm = async () => {
        if (needsReplacement && !selectedReplacement) {
            setError("Veuillez sélectionner une catégorie de remplacement");
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await onConfirm(needsReplacement ? selectedReplacement : undefined);
        } catch (err) {
            setError("Erreur lors de la suppression");
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative bg-[#041C30] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                    <Trash2 className="w-8 h-8 text-red-400" />
                </div>

                {/* Content */}
                <h2 className="text-xl font-semibold text-white text-center mb-2">
                    Supprimer la catégorie
                </h2>
                <p className="text-white/60 text-center mb-6">
                    Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-white">{category.label}</strong> ?
                </p>

                {/* Warning if articles exist */}
                {needsReplacement && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-300 font-medium mb-2">
                                    {articleCount} article{articleCount > 1 ? 's' : ''} utilise{articleCount > 1 ? 'nt' : ''} cette catégorie
                                </p>
                                <p className="text-amber-200/70 text-sm mb-3">
                                    Veuillez sélectionner une catégorie de remplacement pour ces articles.
                                </p>

                                {/* Replacement category selector */}
                                <select
                                    value={selectedReplacement}
                                    onChange={(e) => {
                                        setSelectedReplacement(e.target.value);
                                        setError(null);
                                    }}
                                    disabled={isDeleting}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#4CBBD5] focus:outline-none transition-colors disabled:opacity-50"
                                >
                                    <option value="" className="bg-[#041C30]">
                                        Sélectionner une catégorie...
                                    </option>
                                    {otherCategories.map(cat => (
                                        <option key={cat.id} value={cat.key} className="bg-[#041C30]">
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-5 h-5" />
                                Supprimer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
