import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "./globals.css";

// Custom font Glancyr
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
});

// Fallback font
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
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
    <html lang="fr" className={`${glancyr.variable} ${manrope.variable}`}>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
