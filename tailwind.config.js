/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue:    '#2563EB',
        'blue-hi': '#3B82F6',
        bg:      '#04050A',
        s1:      '#07080F',
        s2:      '#0B0D1A',
        card:    '#0D0F1E',
        border:  '#131526',
        hi:      '#1B1E35',
        pstext:  '#EEF0FF',
        sub:     '#636687',
        muted:   '#272A45',
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
