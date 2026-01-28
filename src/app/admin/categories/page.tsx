"use client";

import { useState, useEffect } from "react";
import { AdminProvider, useAdmin, AdminLogin, AdminLayout, SuccessModal } from "@/components/admin/AdminComponents";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryModal } from "@/components/admin/DeleteCategoryModal";
import { useCategories } from "@/hooks/useCategories";
import { countArticlesInCategory } from "@/services/categoryService";
import type { Category, CategoryFormData } from "@/types/category";
import { getColorClasses } from "@/types/category";
import { Loader2, Plus, Pencil, Trash2, Tag, X, AlertCircle, FileText } from "lucide-react";

function CategoriesContent() {
    const { categories, loading, refreshCategories } = useCategories();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [lastAction, setLastAction] = useState<'create' | 'edit' | 'delete'>('create');

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        category: Category | null;
        articleCount: number;
    }>({
        isOpen: false,
        category: null,
        articleCount: 0
    });

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        setSubmitError(null);
    };

    const handleSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (editingCategory) {
                // Mise à jour via API sécurisée
                const response = await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Erreur lors de la mise à jour');
                }
            } else {
                // Création via API sécurisée
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Erreur lors de la création');
                }
            }

            await refreshCategories();
            setLastAction(editingCategory ? 'edit' : 'create');
            setSubmitSuccess(true);
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Error saving category:", error);
            setSubmitError(error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la catégorie");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async (category: Category) => {
        if (category.isDefault) {
            alert("Les catégories par défaut ne peuvent pas être supprimées");
            return;
        }

        const count = await countArticlesInCategory(category.key);
        setDeleteModal({
            isOpen: true,
            category,
            articleCount: count
        });
    };

    const handleDeleteConfirm = async (replacementKey?: string) => {
        if (!deleteModal.category) return;

        try {
            // Suppression via API sécurisée
            const response = await fetch(`/api/categories/${deleteModal.category.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replacementKey })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur lors de la suppression');
            }

            await refreshCategories();
            setDeleteModal({ isOpen: false, category: null, articleCount: 0 });
            setLastAction('delete');
            setSubmitSuccess(true);
        } catch (error) {
            console.error("Error deleting category:", error);
            alert(error instanceof Error ? error.message : "Erreur lors de la suppression de la catégorie");
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, category: null, articleCount: 0 });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#4CBBD5] animate-spin" />
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="max-w-2xl">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Tag className="w-5 h-5 text-[#4CBBD5]" />
                        <h2 className="text-lg font-medium">
                            {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                        </h2>
                    </div>

                    {submitError && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-300">{submitError}</span>
                            <button onClick={() => setSubmitError(null)} className="ml-auto text-red-400 hover:text-red-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                        loading={isSubmitting}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SuccessModal
                isOpen={submitSuccess}
                onClose={() => setSubmitSuccess(false)}
                title={
                    lastAction === 'delete'
                        ? "Catégorie supprimée !"
                        : lastAction === 'edit'
                            ? "Catégorie modifiée !"
                            : "Catégorie créée !"
                }
                message={
                    lastAction === 'delete'
                        ? "La catégorie a été supprimée avec succès."
                        : lastAction === 'edit'
                            ? "La catégorie a été modifiée avec succès."
                            : "La catégorie a été créée avec succès."
                }
                actions={[
                    { label: "Fermer", onClick: () => setSubmitSuccess(false), primary: true }
                ]}
            />

            <DeleteCategoryModal
                isOpen={deleteModal.isOpen}
                category={deleteModal.category}
                articleCount={deleteModal.articleCount}
                availableCategories={categories}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/40 text-sm">
                        {categories.length} catégorie{categories.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#4CBBD5] hover:bg-[#5DCCE6] text-[#020A19] font-semibold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle catégorie
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
                    <Tag className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">Aucune catégorie</p>
                    <button
                        onClick={handleCreate}
                        className="text-[#4CBBD5] hover:underline"
                    >
                        Créer une première catégorie
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CategoryCard({
    category,
    onEdit,
    onDelete
}: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}) {
    const [articleCount, setArticleCount] = useState<number | null>(null);

    useEffect(() => {
        countArticlesInCategory(category.key).then(setArticleCount);
    }, [category.key]);

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border ${getColorClasses(category.color)}`}>
                            {category.label}
                        </span>
                        {category.isDefault && (
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded">
                                Par défaut
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/40">
                        <span className="font-mono">Clé: {category.key}</span>
                        <span>•</span>
                        <span>Ordre: {category.order}</span>
                        {articleCount !== null && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {articleCount} article{articleCount > 1 ? 's' : ''}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors text-amber-400 hover:text-amber-300 flex items-center gap-2"
                        title="Modifier"
                    >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Modifier</span>
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        disabled={category.isDefault}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                        title={category.isDefault ? "Les catégories par défaut ne peuvent pas être supprimées" : "Supprimer cette catégorie"}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function CategoriesPage() {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout title="Gérer les catégories">
            <CategoriesContent />
        </AdminLayout>
    );
}

export default function CategoriesAdminPage() {
    return (
        <AdminProvider>
            <CategoriesPage />
        </AdminProvider>
    );
}
