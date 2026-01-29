/**
 * API Route : Gestion d'une catégorie spécifique (CRUD individuel)
 *
 * Endpoints disponibles :
 * - PUT /api/categories/[id] : Modifier une catégorie existante
 * - DELETE /api/categories/[id] : Supprimer une catégorie (avec réassignation optionnelle)
 *
 * PARAMÈTRE DE ROUTE :
 * - id : ID du document Firestore de la catégorie
 *
 * FONCTIONNALITÉ IMPORTANTE : RÉASSIGNATION DES ARTICLES
 * Lors de la suppression d'une catégorie, tous les articles associés peuvent être automatiquement
 * réassignés à une autre catégorie. Cela évite les articles "orphelins" sans catégorie.
 *
 * PROTECTION DES CATÉGORIES PAR DÉFAUT :
 * Les catégories avec isDefault: true ne peuvent pas être supprimées.
 * Cette vérification doit être faite côté client (interface admin).
 *
 * SÉCURITÉ :
 * - Utilise Firebase Admin SDK (privilèges élevés)
 * - Opérations en batch pour les mises à jour multiples (réassignation)
 * - Vérifie l'existence avant suppression
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * PUT /api/categories/[id]
 *
 * Met à jour une catégorie existante (nom, couleur, ordre uniquement)
 *
 * PARAMÈTRES :
 * - id : ID de la catégorie dans l'URL (ex: /api/categories/abc123)
 *
 * BODY REQUIS :
 * {
 *   label: string,    // Nouveau nom de la catégorie
 *   color: string,    // Nouvelle couleur Tailwind
 *   order: number     // Nouvel ordre d'affichage
 * }
 *
 * CHAMPS NON MODIFIABLES :
 * - key : La clé ne peut jamais être modifiée après création (intégrité référentielle)
 * - isDefault : Ce flag ne peut pas être changé manuellement
 * - createdAt : Conservé tel quel
 *
 * IMPORTANT :
 * Si vous modifiez le label, les articles existants conservent leur ancien label_categorie.
 * Pour mettre à jour les articles, il faudrait une opération batch séparée (non implémentée).
 *
 * RÉPONSES :
 * - 200 : { message: string } - Catégorie mise à jour avec succès
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
        const categoryId = params.id;

        // Valider que tous les champs obligatoires sont présents
        if (!data.label || !data.color) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Mettre à jour la catégorie (sans modifier la clé ni isDefault)
        await adminDb.collection('categories').doc(categoryId).update({
            label: data.label,
            color: data.color,
            order: data.order,
            updatedAt: FieldValue.serverTimestamp()  // Horodatage serveur automatique
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

/**
 * DELETE /api/categories/[id]
 *
 * Supprime une catégorie avec réassignation optionnelle des articles associés
 *
 * PARAMÈTRES :
 * - id : ID de la catégorie dans l'URL (ex: /api/categories/abc123)
 *
 * BODY OPTIONNEL :
 * {
 *   replacementKey?: string  // Clé de la catégorie de remplacement pour les articles
 * }
 *
 * WORKFLOW DE SUPPRESSION :
 * 1. Vérifier que la catégorie existe (404 si introuvable)
 * 2. Si replacementKey fourni :
 *    - Trouver tous les articles avec cette catégorie
 *    - Les réassigner en batch à la nouvelle catégorie
 * 3. Supprimer la catégorie de la base
 *
 * BATCH OPERATION :
 * La réassignation utilise un batch write pour garantir l'atomicité.
 * Soit tous les articles sont mis à jour, soit aucun (transaction-like behavior).
 *
 * ATTENTION :
 * La suppression est définitive et irréversible !
 * Si aucun replacementKey n'est fourni et que des articles utilisent cette catégorie,
 * ces articles auront une catégorie invalide (catégorie "fantôme").
 *
 * PROTECTION RECOMMANDÉE :
 * Avant d'appeler cette API, vérifiez côté client :
 * - Que la catégorie n'est pas isDefault (non supprimable)
 * - Compter les articles associés avec countArticlesInCategory()
 * - Forcer l'utilisateur à choisir une catégorie de remplacement si des articles existent
 *
 * RÉPONSES :
 * - 200 : { message: string } - Catégorie supprimée avec succès
 * - 404 : { error: string } - Catégorie introuvable
 * - 500 : { error: string } - Erreur serveur
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Récupérer l'instance Firestore Admin
        const adminDb = getAdminDb();
        const categoryId = params.id;
        const { replacementKey } = await request.json();

        // Récupérer la catégorie à supprimer pour obtenir sa clé
        const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();

        if (!categoryDoc.exists) {
            return NextResponse.json(
                { error: 'Catégorie introuvable' },
                { status: 404 }
            );
        }

        const categoryData = categoryDoc.data();
        const keyToDelete = categoryData?.key;

        // Si une clé de remplacement est fournie, réassigner tous les articles
        // Cette opération est critique pour éviter les articles orphelins
        if (replacementKey) {
            // Trouver tous les articles qui utilisent la catégorie à supprimer
            const articlesSnapshot = await adminDb
                .collection('articles')
                .where('categorie', '==', keyToDelete)
                .get();

            // Utiliser un batch write pour garantir l'atomicité
            // Soit tous les articles sont mis à jour, soit aucun
            const batch = adminDb.batch();
            articlesSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { categorie: replacementKey });
            });

            // Exécuter toutes les mises à jour en une seule transaction
            await batch.commit();
        }

        // Supprimer la catégorie définitivement
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
