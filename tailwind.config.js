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
        neon: '0 0 30px rgba(139, 114, 255, 0.3), 0 0 60px rgba(139, 114, 255, 0.1)',
        'neon-lg': '0 0 40px rgba(139, 114, 255, 0.35), 0 0 80px rgba(86, 70, 224, 0.15)',
        glow: '0 0 20px rgba(139, 114, 255, 0.4)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
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
