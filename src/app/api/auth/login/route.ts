import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Le mot de passe est stocké dans une variable d'environnement
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error("ADMIN_PASSWORD non configuré");
            return NextResponse.json(
                { success: false, error: "Configuration serveur manquante" },
                { status: 500 }
            );
        }

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, error: "Mot de passe incorrect" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
