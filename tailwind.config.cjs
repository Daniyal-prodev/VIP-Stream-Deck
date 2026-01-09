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
          bg: "#0a0e1a",
          card: "rgba(10, 20, 40, 0.6)",
          border: "rgba(59, 130, 246, 0.2)",
          accent: "#3b82f6",
        },
        deck: {
          dark: "#0a1628",
          medium: "#0f172a",
          light: "#1a1a2e",
          blue: {
            DEFAULT: "#3b82f6",
            glow: "rgba(59, 130, 246, 0.5)",
            muted: "rgba(59, 130, 246, 0.2)",
          },
          orange: {
            DEFAULT: "#f97316",
            glow: "rgba(249, 115, 22, 0.5)",
            muted: "rgba(249, 115, 22, 0.2)",
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'twinkle': 'twinkle 8s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
