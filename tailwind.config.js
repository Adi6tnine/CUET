/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#09090b',
        'cyber-text': '#e4e4e7',
        'cyber-green': '#22c55e',
        'cyber-red': '#ef4444',
        'cyber-purple': '#a855f7',
        'cyber-border': '#27272a',
        'cyber-card': '#18181b'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #22c55e' },
          '50%': { boxShadow: '0 0 20px #22c55e, 0 0 30px #22c55e' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}