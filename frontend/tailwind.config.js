/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0b1020", 800: "#111a35", 700: "#182449", 600: "#223060" },
        accent: { DEFAULT: "#6366f1", soft: "#818cf8" },
      },
    },
  },
  plugins: [],
};
