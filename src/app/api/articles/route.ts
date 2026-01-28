import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET - Récupérer tous les articles
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

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
    try {
        const adminDb = getAdminDb();
        const data = await request.json();

        // Valider les données obligatoires
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
