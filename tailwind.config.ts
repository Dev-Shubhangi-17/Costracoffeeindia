import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          yellow: "#F5B800",     // Brand Primary Yellow
          gold: "#EAA000",       // Accent Gold/Amber (Hover)
          white: "#FFFFFF",      // Crisp White
          neutral: "#F9F9FB",    // Off-White Neutral Surface
          charcoal: "#1A1A1A",   // Deep Charcoal / Espresso Black
          coffee: "#332219",     // Muted Dark Coffee
          border: "#E5E7EB",     // Subtle Neutral Border
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

