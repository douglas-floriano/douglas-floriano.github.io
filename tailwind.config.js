/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#05060a',
          800: '#0a0b12',
          700: '#10121c',
          600: '#1a1d2b',
          500: '#272a3a',
        },
        brand: {
          cyan: '#22d3ee',
          violet: '#a855f7',
          pink: '#ec4899',
          lime: '#a3e635',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow': {
          '0%': { 'box-shadow': '0 0 20px rgba(168,85,247,0.25)' },
          '100%': { 'box-shadow': '0 0 40px rgba(34,211,238,0.45)' },
        },
      },
    },
  },
  plugins: [],
}
