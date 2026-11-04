/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        surface: {
          950: "#080c14", // Deepest background
          900: "#0d1320", // Sidebar & sticky headers
          850: "#121a2c", // Elevated cards
          800: "#18233c", // Nested cards, inputs
          750: "#1f2c4c", // Card hover, active rows
          700: "#27375f", // Borders
        },
        ink: {
          900: "#080c14",
          850: "#0d1320",
          800: "#121a2c",
          750: "#18233c",
          700: "#233050",
          600: "#2e3f68",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          glow: "rgba(99, 102, 241, 0.15)",
        },
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
        elevated: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.25)",
        "glow-hot": "0 0 25px -5px rgba(239, 68, 68, 0.25)",
      },
    },
  },
  plugins: [],
};
