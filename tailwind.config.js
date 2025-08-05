/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "#2a2a2a",
        ring: "#00ff88",
        background: "#0a0a0a",
        foreground: "#fafafa",
        primary: {
          DEFAULT: "#00ff88",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#2a2a2a",
          foreground: "#fafafa",
        },
        destructive: {
          DEFAULT: "#ff4444",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#2a2a2a",
          foreground: "#888888",
        },
        accent: {
          DEFAULT: "#00ff88",
          foreground: "#0a0a0a",
        },
        popover: {
          DEFAULT: "#1a1a1a",
          foreground: "#fafafa",
        },
        card: {
          DEFAULT: "rgba(26, 26, 26, 0.7)",
          foreground: "#fafafa",
        },
        surface: "#1a1a1a",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}