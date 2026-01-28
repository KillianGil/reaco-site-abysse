import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET - Récupérer toutes les catégories
export async function GET() {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb.collection('categories').orderBy('order').get();

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

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
    try {
        const adminDb = getAdminDb();
        const data = await request.json();

        // Valider les données
        if (!data.key || !data.label || !data.color) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Vérifier l'unicité de la clé
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

        // Créer la catégorie
        const docRef = await adminDb.collection('categories').add({
            key: data.key,
            label: data.label,
            color: data.color,
            order: data.order || 99,
            isDefault: false,
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
