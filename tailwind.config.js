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
        'gentle-float': 'gentleFloat 4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
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
      },
    },
  },
  plugins: [],
};
