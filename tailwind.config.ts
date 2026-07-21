import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
  colors: {
    paper: "#F6F4EE",
    ink: "#12211C",
    muted: "#5C6660",
    border: "#DCD6C4",
    brand: {
      DEFAULT: "#0E6E52",
      dark: "#0A5A42",
      light: "#E3EFE9",
    },
    gold: {
      DEFAULT: "#D9A441",
      dark: "#B8862E",
      light: "#FBF1DD",
    },
    brick: {
      DEFAULT: "#B0432E",
      light: "#F6E4DF",
    },
  },

  fontFamily: {
    display: ["var(--font-display)"],
    sans: ["var(--font-sans)"],
    mono: ["var(--font-mono)"],
  },

  borderRadius: {
    card: "10px",
  },

  keyframes: {
  shimmer: {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },
},

  animation: {
    shimmer: "shimmer 1.6s infinite",
  },
},
},
  plugins: [],
};
export default config;
