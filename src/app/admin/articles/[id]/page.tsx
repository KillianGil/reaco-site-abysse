"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { AdminProvider, useAdmin, AdminLogin, AdminLayout } from "@/components/admin/AdminComponents";
import { db, storage } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, X, Check, AlertCircle, Calendar, Clock, FileText, Tag, Star, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ArticleCategory = "evenement" | "decouverte" | "musee";

interface ArticleForm {
    titre: string;
    resume: string;
    contenu: string;
    categorie: ArticleCategory;
    label_categorie: string;
    image_url: string;
    mis_en_avant: boolean;
    date_evenement: string;
    heure_evenement: string;
}

const categoryLabels: Record<ArticleCategory, string> = {
    evenement: "Événement",
    decouverte: "Découverte",
    musee: "Vie du musée"
};

function EditArticleContent() {
    const router = useRouter();
    const params = useParams();
    const articleId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ArticleForm>({
        titre: "",
        resume: "",
        contenu: "",
        categorie: "musee",
        label_categorie: "Vie du musée",
        image_url: "",
        mis_en_avant: false,
        date_evenement: "",
        heure_evenement: ""
    });

    // Load article data
    useEffect(() => {
        async function loadArticle() {
            try {
                const docRef = doc(db, "articles", articleId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setForm({
                        titre: data.titre || "",
                        resume: data.resume || "",
                        contenu: data.contenu || "",
                        categorie: data.categorie || "musee",
                        label_categorie: data.label_categorie || categoryLabels[data.categorie as ArticleCategory] || "Vie du musée",
                        image_url: data.image_url || "",
                        mis_en_avant: data.mis_en_avant || false,
                        date_evenement: data.date_evenement || "",
                        heure_evenement: data.heure_evenement || ""
                    });
                    setOriginalImageUrl(data.image_url || "");
                    setImagePreview(data.image_url || null);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Erreur chargement article:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (articleId) {
            loadArticle();
        }
    }, [articleId]);

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
        setImagePreview(originalImageUrl || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const uploadImage = async (): Promise<string> => {
        if (!imageFile) return originalImageUrl;

        setUploadProgress(true);

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

        if (!imagePreview && !originalImageUrl) {
            setSubmitError("Veuillez ajouter une image");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Upload new image if selected
            let imageUrl = originalImageUrl;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const articleData = {
                titre: form.titre,
                resume: form.resume,
                contenu: form.contenu,
                categorie: form.categorie,
                label_categorie: form.label_categorie,
                image_url: imageUrl,
                mis_en_avant: form.mis_en_avant,
                date_evenement: form.date_evenement || null,
                heure_evenement: form.heure_evenement || null
            };

            await updateDoc(doc(db, "articles", articleId), articleData);

            setSubmitSuccess(true);

            setTimeout(() => {
                router.push("/admin/articles");
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            setSubmitError("Erreur lors de la modification. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="text-center py-20">
                <p className="text-white/50 mb-4">Article non trouvé</p>
                <Link href="/admin/articles" className="text-[#4CBBD5] hover:underline">
                    Retour aux articles
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            {/* Back link */}
            <Link
                href="/admin/articles"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux articles
            </Link>

            {/* Success/Error Messages */}
            {submitSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">Article modifié avec succès ! Redirection...</span>
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
                        <label className="block text-sm text-white/60 mb-2">Résumé *</label>
                        <textarea
                            value={form.resume}
                            onChange={(e) => setForm(prev => ({ ...prev, resume: e.target.value }))}
                            required
                            rows={2}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors resize-none"
                            placeholder="Court résumé de l'article"
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
                            placeholder="Contenu complet de l'article..."
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">Image de couverture</h2>
                    </div>

                    {imagePreview ? (
                        <div className="relative">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/10">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 w-10 h-10 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            )}
                            <div className="mt-3 flex items-center gap-3">
                                <label className="cursor-pointer text-[#4CBBD5] text-sm hover:underline">
                                    Changer l&apos;image
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </label>
                                {imageFile && (
                                    <span className="text-white/40 text-sm">Nouvelle: {imageFile.name}</span>
                                )}
                            </div>
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
                    <Link
                        href="/admin/articles"
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-medium rounded-xl transition-colors text-center"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadProgress || submitSuccess}
                        className="flex-1 bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting || uploadProgress ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {uploadProgress ? "Upload de l'image..." : "Enregistrement..."}
                            </>
                        ) : submitSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                Enregistré !
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Enregistrer les modifications
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

function EditArticlePage() {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout title="Modifier l'article">
            <EditArticleContent />
        </AdminLayout>
    );
}

export default function EditPage() {
    return (
        <AdminProvider>
            <EditArticlePage />
        </AdminProvider>
    );
}
