/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050709', surface: '#080C12', card: '#0C1220',
        border: '#111D2E', borderhi: '#1A2E48',
        accent: '#00E87A', gold: '#F5B530', cyan: '#00C8FF',
        purple: '#A78BFA', red: '#FF5757',
        text: '#E2EAF4', sub: '#8899AA', muted: '#445566',
      },
      fontFamily: {
        display: ['var(--font-cabinet)', 'sans-serif'],
        body:    ['var(--font-space)',   'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(0,232,122,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.03) 1px,transparent 1px)',
      },
      backgroundSize: { grid: '80px 80px' },
      keyframes: {
        fadeUp:  { from:{ opacity:0, transform:'translateY(24px)' }, to:{ opacity:1, transform:'translateY(0)' }},
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' }},
        marquee: { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' }},
        scan:    { '0%':{ top:'-2px' }, '100%':{ top:'100%' }},
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' }},
        pulse:   { '0%,100%':{ opacity:1, transform:'scale(1)' }, '50%':{ opacity:.4, transform:'scale(1.4)' }},
      },
      animation: {
        fadeUp:  'fadeUp .6s ease both',
        float:   'float 5s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        scan:    'scan 8s linear infinite',
        shimmer: 'shimmer 4s linear infinite',
        pulse:   'pulse 2s ease infinite',
      },
    },
  },
  plugins: [],
};
