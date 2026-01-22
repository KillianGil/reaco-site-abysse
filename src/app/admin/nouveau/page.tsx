"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminProvider, useAdmin, AdminLogin, AdminLayout } from "@/components/admin/AdminComponents";
import { db, storage } from "@/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, X, Check, AlertCircle, Calendar, Clock, FileText, Tag, Star, Send } from "lucide-react";

type ArticleCategory = "evenement" | "decouverte" | "musee";

interface ArticleForm {
    titre: string;
    resume: string;
    contenu: string;
    categorie: ArticleCategory;
    label_categorie: string;
    mis_en_avant: boolean;
    date_evenement: string;
    heure_evenement: string;
}

const categoryLabels: Record<ArticleCategory, string> = {
    evenement: "Événement",
    decouverte: "Découverte",
    musee: "Vie du musée"
};

function NewArticleContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ArticleForm>({
        titre: "",
        resume: "",
        contenu: "",
        categorie: "musee",
        label_categorie: "Vie du musée",
        mis_en_avant: false,
        date_evenement: "",
        heure_evenement: ""
    });

    const handleCategoryChange = (cat: ArticleCategory) => {
        setForm(prev => ({
            ...prev,
            categorie: cat,
            label_categorie: categoryLabels[cat]
        }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSubmitError("L'image est trop grande (max 5MB)");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const uploadImage = async (): Promise<string> => {
        if (!imageFile) throw new Error("Aucune image sélectionnée");

        setUploadProgress(true);

        // Create unique filename
        const timestamp = Date.now();
        const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filename = `articles/${timestamp}_${sanitizedName}`;

        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        setUploadProgress(false);
        return downloadURL;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            setSubmitError("Veuillez ajouter une image");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Upload image
            const imageUrl = await uploadImage();

            // Format de la date texte
            const now = new Date();
            const dateTexte = now.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            const articleData = {
                titre: form.titre,
                resume: form.resume,
                contenu: form.contenu,
                categorie: form.categorie,
                label_categorie: form.label_categorie,
                image_url: imageUrl,
                mis_en_avant: form.mis_en_avant,
                date_evenement: form.date_evenement || null,
                heure_evenement: form.heure_evenement || null,
                date_texte: dateTexte,
                date: Timestamp.now()
            };

            await addDoc(collection(db, "articles"), articleData);

            setSubmitSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/admin/articles");
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            setSubmitError("Erreur lors de l'ajout de l'article. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Success/Error Messages */}
            {submitSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">Article ajouté avec succès ! Redirection...</span>
                </div>
            )}
            {submitError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">{submitError}</span>
                    <button onClick={() => setSubmitError(null)} className="ml-auto text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Section */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">Contenu de l&apos;article</h2>
                    </div>

                    {/* Titre */}
                    <div className="mb-4">
                        <label className="block text-sm text-white/60 mb-2">Titre *</label>
                        <input
                            type="text"
                            value={form.titre}
                            onChange={(e) => setForm(prev => ({ ...prev, titre: e.target.value }))}
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors"
                            placeholder="Titre de l'article"
                        />
                    </div>

                    {/* Résumé */}
                    <div className="mb-4">
                        <label className="block text-sm text-white/60 mb-2">Résumé * <span className="text-white/30">(affiché dans la liste)</span></label>
                        <textarea
                            value={form.resume}
                            onChange={(e) => setForm(prev => ({ ...prev, resume: e.target.value }))}
                            required
                            rows={2}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors resize-none"
                            placeholder="Court résumé de l'article (1-2 phrases)"
                        />
                    </div>

                    {/* Contenu */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">Contenu *</label>
                        <textarea
                            value={form.contenu}
                            onChange={(e) => setForm(prev => ({ ...prev, contenu: e.target.value }))}
                            required
                            rows={12}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors resize-none font-mono text-sm"
                            placeholder="Contenu complet de l'article...&#10;&#10;Utilisez des lignes vides pour séparer les paragraphes."
                        />
                        <p className="text-xs text-white/30 mt-1">💡 Astuce : Sautez une ligne pour créer un nouveau paragraphe</p>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">Image de couverture *</h2>
                    </div>

                    {imagePreview ? (
                        <div className="relative">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/10">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-3 right-3 w-10 h-10 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <p className="text-xs text-white/40 mt-3">{imageFile?.name}</p>
                        </div>
                    ) : (
                        <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-white/20 hover:border-[#4CBBD5]/50 rounded-xl p-12 text-center transition-colors">
                                <Upload className="w-10 h-10 text-white/40 mx-auto mb-3" />
                                <p className="text-white/60 mb-1">Cliquez pour importer une image</p>
                                <p className="text-white/30 text-sm">JPG, PNG, WebP • Max 5MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Category */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">Catégorie</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {(Object.entries(categoryLabels) as [ArticleCategory, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleCategoryChange(key)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${form.categorie === key
                                    ? 'bg-[#4CBBD5] text-[#020A19]'
                                    : 'bg-white/5 text-white/60 border border-white/20 hover:border-[#4CBBD5]/50 hover:text-white'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event Details */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">Détails événement</h2>
                        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">optionnel</span>
                    </div>
                    <p className="text-white/40 text-sm mb-4">Remplissez ces champs uniquement si l&apos;article concerne un événement à venir.</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Date de l&apos;événement</label>
                            <input
                                type="text"
                                value={form.date_evenement}
                                onChange={(e) => setForm(prev => ({ ...prev, date_evenement: e.target.value }))}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors"
                                placeholder="ex: 15 février 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Heure
                            </label>
                            <input
                                type="text"
                                value={form.heure_evenement}
                                onChange={(e) => setForm(prev => ({ ...prev, heure_evenement: e.target.value }))}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors"
                                placeholder="ex: 14h00"
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Toggle */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <label className="flex items-center gap-4 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={form.mis_en_avant}
                                onChange={(e) => setForm(prev => ({ ...prev, mis_en_avant: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 rounded-full bg-white/10 peer-checked:bg-[#4CBBD5] transition-colors" />
                            <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className={`w-5 h-5 ${form.mis_en_avant ? 'text-[#4CBBD5]' : 'text-white/40'} transition-colors`} />
                            <div>
                                <span className="text-white/80 font-medium">Mettre en avant</span>
                                <p className="text-white/40 text-sm">L&apos;article apparaîtra dans la section &quot;À la Une&quot;</p>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/articles")}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-medium rounded-xl transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadProgress || submitSuccess}
                        className="flex-1 bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting || uploadProgress ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {uploadProgress ? "Upload de l'image..." : "Publication..."}
                            </>
                        ) : submitSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                Publié !
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Publier l&apos;article
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

function NewArticlePage() {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout title="Nouvel article">
            <NewArticleContent />
        </AdminLayout>
    );
}

export default function NouveauArticlePage() {
    return (
        <AdminProvider>
            <NewArticlePage />
        </AdminProvider>
    );
}
