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
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};
