import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// Fallback font (Glancyr sera ajouté quand disponible)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABYSSE | Musée Sous-Marin de Toulon",
  description:
    "Découvrez le premier musée sous-marin au monde. Une plongée unique dans l'histoire maritime et les profondeurs océaniques à Toulon.",
  keywords: ["musée", "sous-marin", "Toulon", "océan", "Casabianca", "plongée"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
