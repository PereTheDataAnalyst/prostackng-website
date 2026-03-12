/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue:    '#2563EB',
        'blue-hi': '#3B82F6',
        bg:      '#080B14',
        s1:      '#0C0F1C',
        s2:      '#0F1220',
        card:    '#111428',
        border:  '#181C30',
        hi:      '#1E2238',
        pstext:  '#EEF0FF',
        sub:     '#7A7DA0',
        muted:   '#32365A',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
