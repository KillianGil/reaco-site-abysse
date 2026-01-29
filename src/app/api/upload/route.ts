/**
 * API Route : Upload d'images vers Cloudinary
 *
 * Endpoint : POST /api/upload
 *
 * FONCTIONNEMENT :
 * Cette API gère l'upload des images d'articles vers Cloudinary (service d'hébergement d'images).
 * Elle est appelée depuis le formulaire de création/édition d'article lorsqu'un utilisateur
 * sélectionne une image via l'input file.
 *
 * POURQUOI CLOUDINARY ?
 * - Hébergement gratuit jusqu'à 25GB et 25k transformations/mois
 * - Optimisation automatique des images (compression, format WebP, etc.)
 * - CDN intégré pour un chargement rapide partout dans le monde
 * - Transformation d'images à la volée (resize, crop, qualité)
 *
 * SÉCURITÉ :
 * - Les credentials API ne sont jamais exposés côté client
 * - Seule cette route serveur peut uploader des images
 * - Les images sont limitées à 1920x1080px max pour éviter les abus
 *
 * OPTIMISATIONS APPLIQUÉES :
 * - Limite de taille : 1920x1080 max (crop: "limit" conserve le ratio)
 * - Qualité automatique (Cloudinary choisit la meilleure compression)
 * - Format automatique (WebP pour les navigateurs modernes, fallback sinon)
 *
 * VARIABLES D'ENVIRONNEMENT REQUISES :
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : Nom du compte Cloudinary (ex: "abysse")
 * - CLOUDINARY_API_KEY : Clé API (secret côté serveur uniquement)
 * - CLOUDINARY_API_SECRET : Secret API (ne JAMAIS exposer côté client)
 *
 * RÉPONSES :
 * - 200 : { url: string, public_id: string } - Upload réussi
 * - 400 : { error: string } - Aucun fichier fourni
 * - 500 : { error: string } - Erreur d'upload ou config manquante
 */
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Vérifier que toutes les variables d'environnement Cloudinary sont configurées
        // Sans ces credentials, l'upload ne peut pas fonctionner
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary credentials manquants:", {
                cloud_name: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                api_key: !!process.env.CLOUDINARY_API_KEY,
                api_secret: !!process.env.CLOUDINARY_API_SECRET,
            });
            return NextResponse.json(
                { error: "Configuration Cloudinary manquante" },
                { status: 500 }
            );
        }

        // Configurer Cloudinary à chaque requête
        // Cela garantit que les variables d'environnement sont chargées
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Récupérer le fichier depuis le FormData envoyé par le client
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier fourni" },
                { status: 400 }
            );
        }

        // Convertir le fichier en base64 pour l'upload vers Cloudinary
        // Cloudinary accepte les uploads en base64 ou en URL
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload vers Cloudinary avec transformations automatiques
        const result = await cloudinary.uploader.upload(base64, {
            folder: "abysse/articles",           // Dossier de destination sur Cloudinary
            resource_type: "image",              // Type de ressource (image uniquement)
            transformation: [
                { width: 1920, height: 1080, crop: "limit" },  // Limiter la taille max (conserve ratio)
                { quality: "auto" },                            // Optimisation automatique de la qualité
                { fetch_format: "auto" },                       // Format automatique (WebP si supporté)
            ],
        });

        // Retourner l'URL sécurisée (HTTPS) et l'ID public pour référence future
        // L'URL peut être utilisée directement dans les balises <img>
        return NextResponse.json({
            url: result.secure_url,      // URL HTTPS de l'image uploadée
            public_id: result.public_id, // ID unique pour suppression future (non utilisé actuellement)
        });
    } catch (error) {
        // Gérer les erreurs d'upload (quota dépassé, format invalide, etc.)
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur upload Cloudinary:", errorMessage, error);
        return NextResponse.json(
            { error: `Erreur lors de l'upload: ${errorMessage}` },
            { status: 500 }
        );
    }
}
