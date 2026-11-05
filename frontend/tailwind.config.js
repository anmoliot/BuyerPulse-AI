/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"EB Garamond"', "Georgia", "serif"],
        serif: ['"EB Garamond"', "Georgia", "serif"],
        reading: ['"Instrument Sans"', "sans-serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        botanical: {
          ground: "#f5efdf",
          ink: "#1e382c",
          panel: "#e0e5d3",       // Sage
          clay: "#e6cbb8",        // Warm-field
          accent: "#895440",      // Terracotta
          rule: "#d4d0bd",        // Hairline rule
          ornament: "#b5baa4",    // Ornament line
          field: "#697961",       // Field line
        },
        // Semantic aliases
        ground: "#f5efdf",
        ink: {
          DEFAULT: "#1e382c",
          muted: "#3d5446",
          faint: "#697961",
        },
        sage: {
          DEFAULT: "#e0e5d3",
          light: "#ecf0e4",
          dark: "#cbd3bc",
        },
        clay: {
          DEFAULT: "#e6cbb8",
          light: "#f0ded0",
          dark: "#d8b69f",
        },
        terracotta: {
          DEFAULT: "#895440",
          light: "#a36852",
          dark: "#6f4230",
        },
        rule: "#d4d0bd",
        // Backward-compatibility
        accent: {
          DEFAULT: "#895440",
          light: "#a36852",
          soft: "#d8b69f",
        },
        surface: {
          950: "#f5efdf",
          900: "#fbf8f0",
          850: "#ffffff",
          800: "#e0e5d3",
          750: "#e6cbb8",
          700: "#d4d0bd",
        },
        paper: {
          DEFAULT: "#f5efdf",
          light: "#fbf8f0",
          dark: "#e0e5d3",
        },
      },
      borderRadius: {
        panel: "34px",
        "panel-narrow": "27px",
        "panel-sm": "20px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(30, 56, 44, 0.04), 0 4px 12px rgba(30, 56, 44, 0.02)",
        panel: "0 2px 8px rgba(30, 56, 44, 0.04)",
        card: "0 1px 2px rgba(30, 56, 44, 0.03)",
        focus: "0 0 0 3px rgba(30, 56, 44, 0.15)",
      },
      transitionDuration: {
        interaction: "350ms",
      },
    },
  },
  plugins: [],
};
