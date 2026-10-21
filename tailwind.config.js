/** @type {import('tailwindcss').Config} */
// "Línea Backend" design system. Every colour is a CSS variable defined in
// src/index.css, so the night map only swaps tokens ([data-theme="night"]).
const v = (name) => `var(--${name})`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '4rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        paper: { DEFAULT: v('paper'), 2: v('paper-2'), card: v('card') },
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), 3: v('ink-3') },
        rule: v('rule'),
        // network lines: one colour, one meaning (see docs/design-rationale.md)
        l1: v('l1'),
        eco: v('eco'),
        hydro: v('hydro'),
        donation: v('donation'),
        studysync: v('studysync'),
        easycab: v('easycab'),
        chaos: v('chaos'),
        cer: v('cer'),
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        sign: ['"Barlow Condensed"', 'Barlow', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
}
