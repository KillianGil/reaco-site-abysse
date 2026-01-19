import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Custom font Glancyr (local - no external requests)
const glancyr = localFont({
  src: [
    {
      path: "../../public/fonts/Glancyr-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Glancyr-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Glancyr-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Glancyr-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Glancyr-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-glancyr",
  display: "swap",
  // Fallback to system fonts - no external Google Fonts request
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: "ABYSSE | Musée Sous-Marin de Toulon",
  description:
    "ABYSSE : Explorez l'ultime frontière. Une plongée unique dans l'histoire maritime et les profondeurs océaniques à Toulon.",
  keywords: ["musée", "sous-marin", "Toulon", "océan", "Casabianca", "plongée"],
};

import { LenisProvider } from "@/providers/LenisProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={glancyr.variable}>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
