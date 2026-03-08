/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dota: {
          gold: '#c89b3c',
          'gold-light': '#f0c960',
          dark: '#0a0a0f',
          panel: '#12121a',
          border: '#2a2a3a',
          str: '#e74c3c',
          agi: '#2ecc71',
          int: '#3498db',
          uni: '#9b59b6',
          green: '#27ae60',
          yellow: '#f39c12',
          red: '#e74c3c',
        }
      },
      fontFamily: {
        dota: ['Cinzel', 'Georgia', 'serif'],
        body: ['Nunito', 'sans-serif'],
        heading: ['Cinzel', 'serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'reveal': 'reveal 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-gold': 'pulseGold 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #c89b3c, 0 0 10px #c89b3c' },
          '100%': { boxShadow: '0 0 20px #c89b3c, 0 0 40px #c89b3c, 0 0 60px #c89b3c' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { borderColor: '#c89b3c' },
          '50%': { borderColor: '#f0c960' },
        },
      },
      backgroundImage: {
        'dota-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      }
    },
  },
  plugins: [],
};
