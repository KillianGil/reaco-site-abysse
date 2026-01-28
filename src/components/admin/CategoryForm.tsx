import { useState, useEffect } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { CategoryFormData, Category } from "@/types/category";
import { AVAILABLE_COLORS, generateKeyFromLabel, validateCategoryKey } from "@/types/category";
import { validateCategoryKeyUnique } from "@/services/categoryService";

interface CategoryFormProps {
    category?: Category | null;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, loading = false }: CategoryFormProps) {
    const [form, setForm] = useState<CategoryFormData>({
        key: category?.key || "",
        label: category?.label || "",
        color: category?.color || "cyan",
        order: category?.order || 1
    });

    const [keyError, setKeyError] = useState<string | null>(null);
    const [labelError, setLabelError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        // Pour les nouvelles catégories, générer automatiquement la clé depuis le label
        if (!category && form.label) {
            const generatedKey = generateKeyFromLabel(form.label);
            setForm(prev => ({ ...prev, key: generatedKey }));
            // Réinitialiser l'erreur quand la clé change
            setKeyError(null);
        }
    }, [form.label, category]);

    const validateForm = async (): Promise<boolean> => {
        let isValid = true;

        // Validation du nom
        if (!form.label.trim()) {
            setLabelError("Le nom est requis");
            isValid = false;
        } else {
            setLabelError(null);
        }

        // Validation de la clé (uniquement pour les nouvelles catégories)
        if (!category) {
            const keyToValidate = form.key.trim();

            if (!keyToValidate) {
                setKeyError("La clé est requise");
                isValid = false;
            } else if (!validateCategoryKey(keyToValidate)) {
                setKeyError("La clé doit contenir seulement des lettres minuscules, chiffres et tirets");
                isValid = false;
            } else {
                // Vérifier l'unicité
                setIsValidating(true);
                try {
                    const isUnique = await validateCategoryKeyUnique(keyToValidate);
                    setIsValidating(false);

                    if (!isUnique) {
                        setKeyError("Cette clé est déjà utilisée");
                        isValid = false;
                    } else {
                        setKeyError(null);
                    }
                } catch (error) {
                    console.error("Erreur de validation:", error);
                    setIsValidating(false);
                    setKeyError("Erreur lors de la vérification de la clé");
                    isValid = false;
                }
            }
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de la catégorie */}
            <div>
                <label className="block text-sm text-white/60 mb-2">
                    Nom de la catégorie *
                </label>
                <input
                    type="text"
                    value={form.label}
                    onChange={(e) => {
                        setForm(prev => ({ ...prev, label: e.target.value }));
                        setLabelError(null);
                    }}
                    className={`w-full bg-white/5 border ${labelError ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors`}
                    placeholder="ex: Innovation"
                    disabled={loading}
                />
                {labelError && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {labelError}
                    </p>
                )}
            </div>

            {/* Clé */}
            <div>
                <label className="block text-sm text-white/60 mb-2">
                    Clé (URL-safe) *
                    {!category && <span className="text-white/30 ml-2">Auto-générée depuis le nom</span>}
                    {category && <span className="text-amber-400/70 ml-2">Non modifiable (utilisée par les articles)</span>}
                </label>
                <input
                    type="text"
                    value={form.key}
                    readOnly={!!category}
                    onChange={(e) => {
                        if (!category) {
                            setForm(prev => ({ ...prev, key: e.target.value }));
                            setKeyError(null);
                        }
                    }}
                    className={`w-full bg-white/5 border ${keyError ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 ${!category ? 'focus:border-[#4CBBD5]' : 'cursor-not-allowed opacity-60'} focus:outline-none transition-colors font-mono text-sm`}
                    placeholder="ex: innovation"
                    disabled={loading || !!category}
                />
                {keyError && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {keyError}
                    </p>
                )}
                {isValidating && (
                    <p className="text-white/40 text-sm mt-1 flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Vérification de l&apos;unicité...
                    </p>
                )}
                {category && (
                    <p className="text-xs text-white/40 mt-1">
                        ⚠️ La clé ne peut pas être modifiée car elle est utilisée pour identifier la catégorie dans la base de données
                    </p>
                )}
            </div>

            {/* Sélecteur de couleur */}
            <div>
                <label className="block text-sm text-white/60 mb-3">
                    Couleur *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AVAILABLE_COLORS.map((colorOption) => (
                        <button
                            key={colorOption.key}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, color: colorOption.key }))}
                            disabled={loading}
                            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                form.color === colorOption.key
                                    ? 'border-[#4CBBD5] bg-[#4CBBD5]/10'
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className={`w-full aspect-square rounded-lg ${colorOption.classes}`} />
                            <span className="text-xs text-white/60">{colorOption.name}</span>
                            {form.color === colorOption.key && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4CBBD5] rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-[#020A19]" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ordre */}
            <div>
                <label className="block text-sm text-white/60 mb-2">
                    Ordre d&apos;affichage
                </label>
                <input
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors"
                    disabled={loading}
                />
                <p className="text-xs text-white/30 mt-1">
                    Les catégories seront affichées dans l&apos;ordre croissant
                </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading || isValidating}
                    className="flex-1 bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            {category ? "Mettre à jour" : "Créer"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
