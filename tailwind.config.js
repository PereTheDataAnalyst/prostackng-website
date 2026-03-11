/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#050507',
        surface:  '#08080C',
        card:     '#0D0D14',
        border:   '#16162A',
        borderhi: '#1E1E38',
        accent:   '#8B5CF6',
        'accent-hi': '#A78BFA',
        'accent2': '#EC4899',
        text:     '#F0EEF8',
        sub:      '#7A758E',
        muted:    '#3A3550',
        // product colours
        green:    '#00E87A',
        cyan:     '#00C8FF',
        purple:   '#A78BFA',
        pink:     '#EC4899',
        gold:     '#F5B530',
        red:      '#FF5757',
        orange:   '#FF9500',
      },
      fontFamily: {
        display: ['Syne',            'sans-serif'],
        body:    ['Instrument Sans', 'sans-serif'],
        mono:    ['JetBrains Mono',  'monospace'],
      },
      keyframes: {
        fadeUp:  { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' }},
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' }},
        marquee: { from:{ transform:'translateX(0)' }, to:{ transform:'translateX(-50%)' }},
        scan:    { '0%':{ top:'-2px', opacity:0 }, '10%':{ opacity:1 }, '90%':{ opacity:1 }, '100%':{ top:'100%', opacity:0 }},
        shimmer: { from:{ backgroundPosition:'200% center' }, to:{ backgroundPosition:'-200% center' }},
        pulse:   { '0%,100%':{ opacity:1 }, '50%':{ opacity:.35 }},
        blink:   { '0%,100%':{ opacity:1 }, '50%':{ opacity:.2 }},
      },
      animation: {
        fadeUp:  'fadeUp .7s ease forwards',
        float:   'float 6s ease-in-out infinite',
        marquee: 'marquee 35s linear infinite',
        scan:    'scan 6s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite',
        pulse:   'pulse 2s ease infinite',
        blink:   'blink 1.4s ease infinite',
      },
    },
  },
  plugins: [],
};
