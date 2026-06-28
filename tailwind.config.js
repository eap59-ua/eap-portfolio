/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        ink: {
          950: '#070a12',
          900: '#0a0e1a',
          850: '#0e1322',
          800: '#131a2c',
          700: '#1b2237',
        },
        accent: {
          DEFAULT: '#818cf8',
          strong: '#6366f1',
          violet: '#a78bfa',
          pink: '#f0abfc',
        },
        line: 'rgba(255,255,255,0.08)',
        'line-strong': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { tightest: '-0.03em' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(52,211,153,0.55)' },
          '70%': { boxShadow: '0 0 0 9px rgba(52,211,153,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(52,211,153,0)' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 34s linear infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        blink: 'blink 1.1s step-end infinite',
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: { grid: '44px 44px' },
      boxShadow: {
        glow: '0 0 70px -16px rgba(99,102,241,0.5)',
        card: 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 24px 48px -28px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
