/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./vip-streamdeck/ui/index.html",
    "./vip-streamdeck/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          bg: "#0a0a0c",
          card: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
          accent: "#3b82f6",
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
