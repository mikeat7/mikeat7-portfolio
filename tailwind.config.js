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
      },
    },
  },
  plugins: [],
};
