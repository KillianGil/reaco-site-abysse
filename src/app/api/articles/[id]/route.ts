/**
 * API Route : Gestion d'un article spécifique (CRUD individuel)
 *
 * Endpoints disponibles :
 * - PUT /api/articles/[id] : Modifier un article existant
 * - DELETE /api/articles/[id] : Supprimer un article
 *
 * PARAMÈTRE DE ROUTE :
 * - id : ID du document Firestore de l'article
 *
 * SÉCURITÉ :
 * - Utilise Firebase Admin SDK (privilèges élevés)
 * - Vérifie l'existence de l'article avant suppression (404 si introuvable)
 * - Validation des données avant mise à jour
 *
 * NOTE IMPORTANTE :
 * La route GET n'est pas nécessaire ici car :
 * - La lecture côté client utilise le hook useArticle() avec Firebase client SDK
 * - Seules les opérations d'écriture (PUT/DELETE) nécessitent l'Admin SDK
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * PUT /api/articles/[id]
 *
 * Met à jour un article existant avec de nouvelles données
 *
 * PARAMÈTRES :
 * - id : ID de l'article dans l'URL (ex: /api/articles/abc123)
 *
 * BODY REQUIS :
 * Mêmes champs que POST (voir /api/articles/route.ts)
 * La validation vérifie tous les champs obligatoires
 *
 * CHAMPS MIS À JOUR :
 * - Tous les champs de l'article SAUF "date" et "createdAt" (conservés)
 * - updatedAt : Mis à jour automatiquement avec timestamp serveur
 *
 * RÉPONSES :
 * - 200 : { message: string } - Article mis à jour avec succès
 * - 400 : { error: string } - Données manquantes
 * - 500 : { error: string } - Erreur serveur
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Récupérer l'instance Firestore Admin
        const adminDb = getAdminDb();
        const data = await request.json();
        const articleId = params.id;

        // Valider que tous les champs obligatoires sont présents
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

/**
 * DELETE /api/articles/[id]
 *
 * Supprime définitivement un article de la base de données
 *
 * PARAMÈTRES :
 * - id : ID de l'article dans l'URL (ex: /api/articles/abc123)
 *
 * SÉCURITÉ :
 * - Vérifie l'existence de l'article avant suppression (évite les erreurs silencieuses)
 * - Retourne 404 si l'article n'existe pas
 *
 * ATTENTION :
 * La suppression est définitive et irréversible !
 * Les images Cloudinary associées ne sont PAS supprimées automatiquement.
 * Si nécessaire, ajoutez une suppression Cloudinary via leur API :
 * await cloudinary.uploader.destroy(public_id)
 *
 * RÉPONSES :
 * - 200 : { message: string } - Article supprimé avec succès
 * - 404 : { error: string } - Article introuvable
 * - 500 : { error: string } - Erreur serveur
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Récupérer l'instance Firestore Admin
        const adminDb = getAdminDb();
        const articleId = params.id;

        // Vérifier que l'article existe avant de le supprimer
        // Cela évite les erreurs silencieuses et informe l'utilisateur
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
