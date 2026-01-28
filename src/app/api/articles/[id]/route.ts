import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// PUT - Modifier un article
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminDb = getAdminDb();
        const data = await request.json();
        const articleId = params.id;

        // Valider les données obligatoires
        if (!data.titre || !data.resume || !data.contenu || !data.categorie || !data.image_url) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Mettre à jour l'article
        await adminDb.collection('articles').doc(articleId).update({
            titre: data.titre,
            resume: data.resume,
            contenu: data.contenu,
            categorie: data.categorie,
            label_categorie: data.label_categorie,
            image_url: data.image_url,
            mis_en_avant: data.mis_en_avant || false,
            date_evenement: data.date_evenement || null,
            heure_evenement: data.heure_evenement || null,
            date_texte: data.date_texte,
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            message: 'Article mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur PUT article:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'article' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un article
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminDb = getAdminDb();
        const articleId = params.id;

        // Vérifier que l'article existe
        const articleDoc = await adminDb.collection('articles').doc(articleId).get();

        if (!articleDoc.exists) {
            return NextResponse.json(
                { error: 'Article introuvable' },
                { status: 404 }
            );
        }

        // Supprimer l'article
        await adminDb.collection('articles').doc(articleId).delete();

        return NextResponse.json({
            message: 'Article supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur DELETE article:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de l\'article' },
            { status: 500 }
        );
    }
}
