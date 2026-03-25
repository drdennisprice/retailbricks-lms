import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#32E6E2",
          dark:    "#1BB8B4",
          light:   "#7FF3F1",
        },
        accent: "#6366F1",
        dark: {
          base: "#0F172A",
          mid:  "#1E293B",
          card: "#334155",
        },
      },
      fontFamily: {
        heading: ['"Archivo Black"', "sans-serif"],
        sans:    ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
