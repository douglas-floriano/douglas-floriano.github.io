/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui'],
        serif:   ['Fraunces', 'Times New Roman', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper:   '#F2EDE3',
        paper2:  '#ECE5D5',
        ink:     '#0F0E0C',
        ink2:    '#2A2823',
        muted:   '#6B6759',
        rule:    '#D9D1BE',
        accent:  '#E2410E',
        moss:    '#1F3D2D',
        warn:    '#C8A23F',
      },
    },
  },
  plugins: [],
}
