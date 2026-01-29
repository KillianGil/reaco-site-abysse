/**
 * API Route : Gestion des articles (Collection complète)
 *
 * Endpoints disponibles :
 * - GET /api/articles : Récupérer tous les articles
 * - POST /api/articles : Créer un nouvel article
 *
 * IMPORTANT - FIREBASE ADMIN SDK :
 * Ces endpoints utilisent Firebase Admin SDK (privilèges élevés) au lieu du client SDK.
 * Cela permet de :
 * - Contourner les règles de sécurité Firestore
 * - Effectuer des opérations en masse (batch operations)
 * - Utiliser FieldValue.serverTimestamp() pour des timestamps précis côté serveur
 *
 * SÉCURITÉ :
 * - Ces endpoints sont appelés uniquement depuis l'interface admin (après authentification)
 * - En production, ajoutez un middleware pour vérifier le token admin
 * - Les données sont validées avant insertion
 *
 * STRUCTURE D'UN ARTICLE FIRESTORE :
 * {
 *   titre: string,
 *   resume: string,
 *   contenu: string (HTML via TipTap),
 *   categorie: string (clé de catégorie ex: "evenement"),
 *   label_categorie: string (ex: "Événement"),
 *   image_url: string (URL Cloudinary),
 *   mis_en_avant: boolean,
 *   date_evenement: string | null,
 *   heure_evenement: string | null,
 *   date_texte: string (ex: "15 janvier 2024"),
 *   date: Timestamp (pour tri),
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/articles
 *
 * Récupère tous les articles de la base de données, triés par date décroissante
 * (articles les plus récents en premier)
 *
 * RÉPONSE :
 * - 200 : Array<Article> - Liste de tous les articles avec leur ID
 * - 500 : { error: string } - Erreur serveur
 */
export async function GET() {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb
            .collection('articles')
            .orderBy('date', 'desc')
            .get();

        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(articles);
    } catch (error) {
        console.error('Erreur GET articles:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des articles' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/articles
 *
 * Crée un nouvel article dans Firestore avec tous les champs nécessaires
 *
 * BODY REQUIS :
 * {
 *   titre: string,              // Titre de l'article
 *   resume: string,             // Résumé (affiché sur la page liste)
 *   contenu: string,            // Contenu HTML généré par TipTap
 *   categorie: string,          // Clé de catégorie (ex: "evenement")
 *   label_categorie: string,    // Label de catégorie (ex: "Événement")
 *   image_url: string,          // URL de l'image (Cloudinary)
 *   date_texte: string,         // Date formatée (ex: "15 janvier 2024")
 *   mis_en_avant?: boolean,     // Épingler en haut de la page actualités
 *   date_evenement?: string,    // Date événement si catégorie = "evenement"
 *   heure_evenement?: string    // Heure événement si catégorie = "evenement"
 * }
 *
 * VALIDATION :
 * - Vérifie que tous les champs obligatoires sont présents
 * - Les champs optionnels reçoivent des valeurs par défaut (false, null)
 *
 * TIMESTAMPS :
 * - date : Timestamp serveur (utilisé pour le tri)
 * - createdAt : Timestamp de création
 * - updatedAt : Timestamp de dernière modification
 *
 * RÉPONSES :
 * - 201 : { id: string, message: string } - Article créé avec succès
 * - 400 : { error: string } - Données manquantes
 * - 500 : { error: string } - Erreur serveur
 */
export async function POST(request: NextRequest) {
    try {
        // Récupérer l'instance Firestore Admin (privilèges élevés)
        const adminDb = getAdminDb();
        const data = await request.json();

        // Valider que tous les champs obligatoires sont présents
        if (!data.titre || !data.resume || !data.contenu || !data.categorie || !data.image_url) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Créer l'article
        const docRef = await adminDb.collection('articles').add({
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
            date: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            id: docRef.id,
            message: 'Article créé avec succès'
        }, { status: 201 });
    } catch (error) {
        console.error('Erreur POST articles:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'article' },
            { status: 500 }
        );
    }
}
