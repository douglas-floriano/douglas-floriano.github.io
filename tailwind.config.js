/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        display: ['Archivo', 'ui-sans-serif', 'sans-serif'],
        serif:   ['Fraunces', 'Times New Roman', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg:      '#07090E',
        bg2:     '#0B1220',
        bg3:     '#111827',
        surface: '#0F172A',
        ink:     '#F8FAFC',
        ink2:    '#CBD5E1',
        muted:   '#64748B',
        line:    '#1E293B',
        rule:    '#1E293B',
        accent:  '#22C55E',
        accent2: '#16A34A',
        hot:     '#F97316',
        warn:    '#EAB308',
        info:    '#38BDF8',
      },
    },
  },
  plugins: [],
}
