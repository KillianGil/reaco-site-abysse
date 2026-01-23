import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Vérifier que les credentials sont configurés
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

        // Configurer Cloudinary à chaque requête (pour s'assurer que les env vars sont chargées)
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier fourni" },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: "abysse/articles",
            resource_type: "image",
            transformation: [
                { width: 1920, height: 1080, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur upload Cloudinary:", errorMessage, error);
        return NextResponse.json(
            { error: `Erreur lors de l'upload: ${errorMessage}` },
            { status: 500 }
        );
    }
}
