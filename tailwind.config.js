/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sphere: {
          50: '#F3F1FF',
          100: '#E6E1FF',
          200: '#C9BEFF',
          300: '#A996FF',
          400: '#8B72FF',
          500: '#6D5DF6',
          600: '#5646E0',
          700: '#4335B3',
          800: '#312786',
          900: '#1E1959',
        },
        ink: {
          950: '#0B0B14',
          900: '#12121F',
          800: '#191929',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 24, 74, 0.25)',
        soft: '0 4px 24px 0 rgba(139, 114, 255, 0.08)',
        glow: '0 0 20px rgba(139, 114, 255, 0.15)',
        'glow-sm': '0 0 12px rgba(139, 114, 255, 0.1)',
        card: '0 8px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 114, 255, 0.06)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-up-sm': 'slideUpSm 0.5s ease-out forwards',
        'gentle-float': 'gentleFloat 4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'wave-flow': 'waveFlow 8s ease-in-out infinite alternate',
        'wave-flow-slow': 'waveFlow 12s ease-in-out infinite alternate',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'drift-reverse': 'driftReverse 25s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpSm: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        waveFlow: {
          '0%': { d: 'path("M 0 800 Q 150 600 300 700 Q 450 800 600 650 Q 750 500 900 650 Q 1050 800 1200 700 L 1200 800 L 0 800 Z")' },
          '50%': { d: 'path("M 0 800 Q 150 500 300 650 Q 450 800 600 550 Q 750 300 900 600 Q 1050 900 1200 650 L 1200 800 L 0 800 Z")' },
          '100%': { d: 'path("M 0 800 Q 150 700 300 600 Q 450 500 600 700 Q 750 900 900 600 Q 1050 400 1200 650 L 1200 800 L 0 800 Z")' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(5px) translateX(-5px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(30px, -20px)' },
          '50%': { transform: 'translate(-20px, 10px)' },
          '75%': { transform: 'translate(15px, -30px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        driftReverse: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-25px, 15px)' },
          '50%': { transform: 'translate(20px, -15px)' },
          '75%': { transform: 'translate(-10px, 25px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
    },
  },
  plugins: [],
};
