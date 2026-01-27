import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Couleurs dynamiques pour les catégories
    'bg-emerald-500/20',
    'text-emerald-400',
    'border-emerald-500/30',
    'bg-amber-500/20',
    'text-amber-400',
    'border-amber-500/30',
    'bg-purple-500/20',
    'text-purple-400',
    'border-purple-500/30',
    'bg-rose-500/20',
    'text-rose-400',
    'border-rose-500/30',
    'bg-blue-500/20',
    'text-blue-400',
    'border-blue-500/30',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        abyss: {
          surface: "#006994",
          deep: "#003366",
          midnight: "#001a33",
          void: "#000510",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "system-ui", "sans-serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
