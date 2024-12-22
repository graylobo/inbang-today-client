import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#1a1a1a",
          text: "#e5e5e5",
          primary: "#3b82f6",
          secondary: "#64748b",
          accent: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
