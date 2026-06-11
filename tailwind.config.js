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
          bg: "#141814",
          panel: "#1c211c",
          deep: "#111511",
          line: "#2e3e2e",
          soft: "#3a4e3a",
          gold: "#c8a84b",
          goldbright: "#e0c068",
          teal: "#4bc8c0",
          text: "#e0e8e0",
          dim: "#9cb29c",
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
