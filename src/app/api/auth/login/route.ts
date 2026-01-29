/**
 * API Route : Authentification administrateur
 *
 * Endpoint : POST /api/auth/login
 *
 * FONCTIONNEMENT :
 * Cette API permet de vérifier le mot de passe admin pour accéder à l'interface d'administration.
 * Le mot de passe est stocké dans la variable d'environnement ADMIN_PASSWORD côté serveur.
 *
 * IMPORTANT - SÉCURITÉ :
 * - Le mot de passe n'est jamais exposé côté client
 * - La comparaison se fait uniquement côté serveur (Next.js API Route)
 * - Aucun JWT ou session serveur n'est créé (gestion via sessionStorage côté client)
 * - Pour la production, il est recommandé d'ajouter un rate limiting (ex: 5 tentatives max par IP)
 *
 * BODY REQUIS :
 * {
 *   "password": string  // Mot de passe saisi par l'admin
 * }
 *
 * RÉPONSES :
 * - 200 : { success: true } - Authentification réussie
 * - 401 : { success: false, error: "..." } - Mot de passe incorrect
 * - 500 : { success: false, error: "..." } - Erreur serveur ou config manquante
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Récupérer le mot de passe envoyé par le client
        const { password } = await request.json();

        // Le mot de passe admin est stocké dans une variable d'environnement serveur
        // Il n'est jamais exposé côté client
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Vérifier que la variable d'environnement est bien configurée
        if (!adminPassword) {
            console.error("ADMIN_PASSWORD non configuré");
            return NextResponse.json(
                { success: false, error: "Configuration serveur manquante" },
                { status: 500 }
            );
        }

        // Comparer le mot de passe (en texte brut pour simplifier)
        // Pour la production, il est recommandé d'utiliser bcrypt ou argon2
        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        }

        // Mot de passe incorrect
        return NextResponse.json(
            { success: false, error: "Mot de passe incorrect" },
            { status: 401 }
        );
    } catch {
        // Erreur lors du parsing du JSON ou autre erreur serveur
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
