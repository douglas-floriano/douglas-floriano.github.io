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
        night: '#0A0F1E',
        deep: '#111733',
        deep2: '#161D3D',
        line: '#222A4A',
        text: '#ECEAF5',
        soft: '#B9BDD6',
        muted: '#8187A8',
        signal: '#7C9CFF',
        spark: '#FFC27A',
        mint: '#7FE0C2',
      },
    },
  },
  plugins: [],
}
