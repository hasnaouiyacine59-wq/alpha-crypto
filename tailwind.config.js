/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#08070f',
          secondary: '#0e0c1a',
          tertiary:  '#141228',
          card:      '#1a1730',
          hover:     '#221f3a',
        },
        accent: {
          purple:  '#a855f7',
          violet:  '#8b5cf6',
          indigo:  '#6366f1',
          pink:    '#ec4899',
          cyan:    '#06b6d4',
          green:   '#22c55e',
          red:     '#ef4444',
          yellow:  '#f59e0b',
          orange:  '#f97316',
        },
        border: {
          DEFAULT: '#2d2650',
          light:   '#3d3568',
        },
        text: {
          primary:   '#f1eeff',
          secondary: '#a89ec9',
          muted:     '#6b6190',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #a855f7, #6366f1)',
        'gradient-card':   'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(99,102,241,0.04))',
        'gradient-hero':   'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.25), transparent)',
        'gradient-glow':   'radial-gradient(circle at center, rgba(168,85,247,0.15), transparent 70%)',
      },
      boxShadow: {
        'purple-sm': '0 0 12px rgba(168,85,247,0.2)',
        'purple-md': '0 0 24px rgba(168,85,247,0.25)',
        'purple-lg': '0 0 48px rgba(168,85,247,0.3)',
        'card':      '0 4px 24px rgba(0,0,0,0.4)',
        'glow-green':'0 0 12px rgba(34,197,94,0.3)',
        'glow-red':  '0 0 12px rgba(239,68,68,0.3)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-in':    'slideIn 0.18s ease-out',
        'fade-in':     'fadeIn 0.25s ease-out',
        'ticker':      'ticker 40s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        slideIn:   { from: { transform: 'translateY(-6px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glowPulse: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
