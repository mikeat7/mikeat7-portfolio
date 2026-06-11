// File: tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        input: "#F3F4F6",
        background: "#FFFFFF",
        ring: "#93C5FD",
        // Precision Instrument palette (Option 4 redesign)
        ins: {
          bg: "#0a0c10",
          panel: "#111318",
          deep: "#0e1116",
          line: "#1e2530",
          soft: "#2a3342",
          gold: "#c8a84b",
          goldbright: "#e0c068",
          teal: "#4bc8c0",
          text: "#e2e4e8",
          dim: "#9aa3b2",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        techmono: ["'Share Tech Mono'", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
