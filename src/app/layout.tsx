import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configuration des fichiers séparés
const glancyr = localFont({
  src: [
    {
      path: "../../public/fonts/Glancyr-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Glancyr-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
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

export const metadata: Metadata = {
  title: "Musée Abysse | Toulon",
  description: "Le premier musée dédié à l'exploration des grands fonds marins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${glancyr.variable} font-sans bg-[#020A19] text-[#E3F3F7] antialiased`}>
        {children}
      </body>
    </html>
  );
}