/**
 * API Route : Gestion des catégories (Collection complète)
 *
 * Endpoints disponibles :
 * - GET /api/categories : Récupérer toutes les catégories
 * - POST /api/categories : Créer une nouvelle catégorie
 *
 * CONTEXTE :
 * Les catégories permettent de classer les articles (Événement, Découverte, Vie du musée, etc.)
 * Elles sont gérées dynamiquement par les administrateurs via /admin/categories
 *
 * STRUCTURE D'UNE CATÉGORIE FIRESTORE :
 * {
 *   key: string,            // Identifiant unique (ex: "evenement")
 *   label: string,          // Nom affiché (ex: "Événement")
 *   color: string,          // Couleur Tailwind (ex: "cyan", "emerald")
 *   order: number,          // Ordre d'affichage (1, 2, 3...)
 *   isDefault: boolean,     // Catégorie par défaut (non supprimable)
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp
 * }
 *
 * CATÉGORIES PAR DÉFAUT :
 * Les 3 catégories de base (Événement, Découverte, Vie du musée) sont créées automatiquement
 * au premier lancement via initializeCategories() dans categoryService.ts
 *
 * SÉCURITÉ :
 * - Utilise Firebase Admin SDK (contourne les règles Firestore)
 * - Vérifie l'unicité des clés avant création
 * - Validation des données obligatoires
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/categories
 *
 * Récupère toutes les catégories triées par ordre croissant (order field)
 *
 * RÉPONSE :
 * - 200 : Array<Category> - Liste de toutes les catégories avec leur ID
 * - 500 : { error: string } - Erreur serveur
 */
export async function GET() {
    try {
        // Récupérer l'instance Firestore Admin
        const adminDb = getAdminDb();

        // Récupérer toutes les catégories triées par le champ "order"
        // Les catégories avec order le plus petit apparaissent en premier
        const snapshot = await adminDb.collection('categories').orderBy('order').get();

        // Transformer les documents Firestore en objets JSON avec leur ID
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Erreur GET categories:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des catégories' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/categories
 *
 * Crée une nouvelle catégorie personnalisée
 *
 * BODY REQUIS :
 * {
 *   key: string,      // Clé unique (format: lowercase-hyphen, ex: "nouvelle-categorie")
 *   label: string,    // Nom affiché (ex: "Nouvelle Catégorie")
 *   color: string,    // Couleur Tailwind (ex: "purple", "rose")
 *   order?: number    // Ordre d'affichage (par défaut: 99)
 * }
 *
 * VALIDATION :
 * - Tous les champs sont obligatoires (sauf order)
 * - La clé doit être unique (409 Conflict si existe déjà)
 * - Format de la clé validé côté client (lowercase, hyphens only)
 *
 * NOTES :
 * - isDefault est toujours false pour les catégories créées manuellement
 * - Seules les catégories avec isDefault: false peuvent être supprimées
 *
 * RÉPONSES :
 * - 201 : { id: string, message: string } - Catégorie créée avec succès
 * - 400 : { error: string } - Données manquantes
 * - 409 : { error: string } - Clé déjà utilisée
 * - 500 : { error: string } - Erreur serveur
 */
export async function POST(request: NextRequest) {
    try {
        // Récupérer l'instance Firestore Admin
        const adminDb = getAdminDb();
        const data = await request.json();

        // Valider que tous les champs obligatoires sont présents
        if (!data.key || !data.label || !data.color) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Vérifier que la clé n'existe pas déjà (unicité)
        // Cela évite les conflits et les doublons
        const existingSnapshot = await adminDb
            .collection('categories')
            .where('key', '==', data.key)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json(
                { error: 'Cette clé existe déjà' },
                { status: 409 }
            );
        }

        // Créer la nouvelle catégorie
        const docRef = await adminDb.collection('categories').add({
            key: data.key,
            label: data.label,
            color: data.color,
            order: data.order || 99,  // Par défaut, mettre à la fin
            isDefault: false,         // Les catégories créées manuellement ne sont jamais par défaut
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            id: docRef.id,
            message: 'Catégorie créée avec succès'
        }, { status: 201 });
    } catch (error) {
        console.error('Erreur POST categories:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la catégorie' },
            { status: 500 }
        );
    }
}
