"use client";

import { useState, useRef } from "react";
import { db, storage } from "@/firebase";
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Lock, Eye, EyeOff, Send, Check, AlertCircle, Loader2, Image as ImageIcon, Calendar, Clock, FileText, Tag, Star, Upload, X, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

const ADMIN_PASSWORD = "AbysseSuperMusee2026";

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

interface ExistingArticle {
    id: string;
    titre: string;
    date_texte: string;
    categorie: ArticleCategory;
    image_url: string;
}

const categoryLabels: Record<ArticleCategory, string> = {
    evenement: "Événement",
    decouverte: "Découverte",
    musee: "Vie du musée"
};

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Existing articles
    const [existingArticles, setExistingArticles] = useState<ExistingArticle[]>([]);
    const [showArticles, setShowArticles] = useState(false);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

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

    const loadExistingArticles = async () => {
        setLoadingArticles(true);
        try {
            const articlesRef = collection(db, "articles");
            const q = query(articlesRef, orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const articles: ExistingArticle[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                articles.push({
                    id: doc.id,
                    titre: data.titre,
                    date_texte: data.date_texte,
                    categorie: data.categorie,
                    image_url: data.image_url
                });
            });
            setExistingArticles(articles);
        } catch (error) {
            console.error("Erreur chargement articles:", error);
        } finally {
            setLoadingArticles(false);
        }
    };

    const handleDeleteArticle = async (articleId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

        setDeletingId(articleId);
        try {
            await deleteDoc(doc(db, "articles", articleId));
            setExistingArticles(prev => prev.filter(a => a.id !== articleId));
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile && !form.image_url) {
            setSubmitError("Veuillez ajouter une image");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Upload image if file selected
            let imageUrl = form.image_url;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

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
            // Reset form
            setForm({
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
            removeImage();

            // Refresh articles list if visible
            if (showArticles) {
                loadExistingArticles();
            }

            // Hide success message after 3s
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            setSubmitError("Erreur lors de l'ajout de l'article. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Login Screen
    if (!isAuthenticated) {
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
                            className="w-full bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19] font-semibold py-3 rounded-xl transition-colors"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    // Admin Dashboard
    return (
        <main className="min-h-screen bg-[#041C30] text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#4CBBD5]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#006994]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <header className="relative z-20 border-b border-white/10 bg-[#041C30]/80 backdrop-blur-sm sticky top-0">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4CBBD5]/20 rounded-xl flex items-center justify-center border border-[#4CBBD5]/30">
                            <Lock className="w-5 h-5 text-[#4CBBD5]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">Administration ABYSSE</h1>
                            <p className="text-xs text-white/40">Gestion des articles</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 md:px-6 py-8">
                {/* Success/Error Messages */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-300">Article ajouté avec succès !</span>
                    </div>
                )}
                {submitError && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-300">{submitError}</span>
                    </div>
                )}

                {/* Existing Articles Toggle */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            setShowArticles(!showArticles);
                            if (!showArticles && existingArticles.length === 0) {
                                loadExistingArticles();
                            }
                        }}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between transition-colors"
                    >
                        <span className="text-white/80 font-medium">Articles existants ({existingArticles.length})</span>
                        {showArticles ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
                    </button>

                    {showArticles && (
                        <div className="mt-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            {loadingArticles ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="w-6 h-6 text-[#4CBBD5] animate-spin mx-auto" />
                                </div>
                            ) : existingArticles.length === 0 ? (
                                <div className="p-8 text-center text-white/40">
                                    Aucun article
                                </div>
                            ) : (
                                <div className="max-h-64 overflow-y-auto">
                                    {existingArticles.map((article) => (
                                        <div key={article.id} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
                                                {article.image_url && (
                                                    <Image src={article.image_url} alt="" fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{article.titre}</p>
                                                <p className="text-xs text-white/40">{article.date_texte} • {categoryLabels[article.categorie]}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteArticle(article.id)}
                                                disabled={deletingId === article.id}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === article.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Section */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#4CBBD5]" />
                            <h2 className="text-lg font-medium">Nouvel Article</h2>
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
                                placeholder="Court résumé affiché dans la liste des articles"
                            />
                        </div>

                        {/* Contenu */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Contenu *</label>
                            <textarea
                                value={form.contenu}
                                onChange={(e) => setForm(prev => ({ ...prev, contenu: e.target.value }))}
                                required
                                rows={8}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#4CBBD5] focus:outline-none transition-colors resize-none"
                                placeholder="Contenu complet de l'article. Utilisez des lignes vides pour séparer les paragraphes."
                            />
                            <p className="text-xs text-white/30 mt-1">Utilisez des lignes vides pour créer des paragraphes séparés.</p>
                        </div>
                    </div>

                    {/* Category & Image */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-5 h-5 text-[#4CBBD5]" />
                                <h2 className="text-lg font-medium">Catégorie</h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(Object.entries(categoryLabels) as [ArticleCategory, string][]).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleCategoryChange(key)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.categorie === key
                                            ? 'bg-[#4CBBD5] text-[#020A19]'
                                            : 'bg-white/5 text-white/60 border border-white/20 hover:border-[#4CBBD5]/50'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="w-5 h-5 text-[#4CBBD5]" />
                                <h2 className="text-lg font-medium">Image *</h2>
                            </div>

                            {imagePreview ? (
                                <div className="relative">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-white/10">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                    <p className="text-xs text-white/40 mt-2 truncate">{imageFile?.name}</p>
                                </div>
                            ) : (
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-white/20 hover:border-[#4CBBD5]/50 rounded-xl p-8 text-center transition-colors">
                                        <Upload className="w-8 h-8 text-white/40 mx-auto mb-3" />
                                        <p className="text-white/60 text-sm mb-1">Cliquez pour importer une image</p>
                                        <p className="text-white/30 text-xs">JPG, PNG, WebP (max 5MB)</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#4CBBD5]" />
                            <h2 className="text-lg font-medium">Détails événement</h2>
                            <span className="text-xs text-white/30">(optionnel)</span>
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
                                    className="sr-only"
                                />
                                <div className={`w-12 h-7 rounded-full transition-colors ${form.mis_en_avant ? 'bg-[#4CBBD5]' : 'bg-white/10'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${form.mis_en_avant ? 'translate-x-5' : ''}`} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className={`w-5 h-5 ${form.mis_en_avant ? 'text-[#4CBBD5]' : 'text-white/40'}`} />
                                <span className="text-white/80">Mettre en avant (section &quot;À la Une&quot;)</span>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadProgress}
                        className="w-full bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting || uploadProgress ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {uploadProgress ? "Upload de l'image..." : "Ajout en cours..."}
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Publier l&apos;article
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
