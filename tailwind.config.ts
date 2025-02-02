import type { Config } from "tailwindcss";

export default {
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
        midnight  : "#020617",
        midlight  : "#04071D",
        midlighter: "#0A1A34",
        purple    : "#CBACF9", 
        deepnavy  : "#0A122A",
        steelblue : "#1B2950",
        lavender  : "#E2D5FA",
        blushpink : "#F9CADA",
        teal      : "#0D595E",
        gold      : "#F9D78E",
        white     : "#FFFFFF",
        black     : "#000000",
        gunmetal  : "#1D2A39",
      },
    },
  },
  plugins: [],
} satisfies Config;
