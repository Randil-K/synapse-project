/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "#0a1d1f",
        bg1: "#0f2a2e",
        panel: "#12343b",
        panelEdge: "#2a5158",
        amber: "#e8a33d",
        coral: "#f26d5b",
        violet: "#8aa6ff",
        mint: "#4fd1c5",
        ink: "#f4ede4",
        muted: "#9fb8b8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl2: "24px",
      },
    },
  },
  plugins: [],
}

