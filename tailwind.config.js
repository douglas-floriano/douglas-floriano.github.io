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
        night: '#0B0E14',
        deep: '#11151D',
        deep2: '#161B26',
        line: '#1E2430',
        text: '#F2F5FA',
        soft: '#C9D1DE',
        muted: '#8A94A6',
        signal: '#2E8BFF',
        spark: '#7DB6FF',
        mint: '#7FE0C2',
      },
    },
  },
  plugins: [],
}
