import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fff7f1",
        blush: "#f9d9de",
        rose: "#efb8c8",
        cocoa: "#5a3423",
        truffle: "#2d1710",
        gold: "#caa56a",
        mocha: "#9f7157"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(90, 52, 35, 0.12)",
        glow: "0 30px 80px rgba(202, 165, 106, 0.18)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      backgroundImage: {
        "hero-fade":
          "radial-gradient(circle at top left, rgba(249,217,222,0.9), transparent 42%), radial-gradient(circle at bottom right, rgba(202,165,106,0.18), transparent 38%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        rise: "rise 0.8s ease-out both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" }
        },
        rise: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
