import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// PUT - Modifier une catégorie
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminDb = getAdminDb();
        const data = await request.json();
        const categoryId = params.id;

        // Valider les données
        if (!data.label || !data.color) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Mettre à jour (sans modifier la clé)
        await adminDb.collection('categories').doc(categoryId).update({
            label: data.label,
            color: data.color,
            order: data.order,
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            message: 'Catégorie mise à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur PUT category:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la catégorie' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminDb = getAdminDb();
        const categoryId = params.id;
        const { replacementKey } = await request.json();

        // Récupérer la catégorie à supprimer
        const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();

        if (!categoryDoc.exists) {
            return NextResponse.json(
                { error: 'Catégorie introuvable' },
                { status: 404 }
            );
        }

        const categoryData = categoryDoc.data();
        const keyToDelete = categoryData?.key;

        // Si une clé de remplacement est fournie, réassigner les articles
        if (replacementKey) {
            const articlesSnapshot = await adminDb
                .collection('articles')
                .where('categorie', '==', keyToDelete)
                .get();

            // Mettre à jour tous les articles en batch
            const batch = adminDb.batch();
            articlesSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { categorie: replacementKey });
            });
            await batch.commit();
        }

        // Supprimer la catégorie
        await adminDb.collection('categories').doc(categoryId).delete();

        return NextResponse.json({
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur DELETE category:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de la catégorie' },
            { status: 500 }
        );
    }
}
