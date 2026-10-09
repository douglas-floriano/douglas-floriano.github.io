/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#121110',
        surface: '#1a1916',
        surface2: '#22201c',
        line: '#2f2c26',
        ink: '#eeeae2',
        soft: '#c9c2b5',
        muted: '#9a9286',
        amber: '#e9a23b',
        leaf: '#9bcb8e',
      },
    },
  },
  plugins: [],
}
