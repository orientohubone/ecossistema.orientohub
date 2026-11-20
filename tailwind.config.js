/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.css'  // Added to scan CSS files for class usage
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: {
          DEFAULT: '#FFF200',
          50: '#FFFDE6',
          100: '#FFFACC',
          200: '#FFF599',
          300: '#FFF066',
          400: '#FFEB33',
          500: '#FFF200',
          600: '#E6DA00',
          700: '#CCB800',
          800: '#998A00',
          900: '#665C00',
          950: '#332E00',
        },
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        borderFlow: {
          '0%': {
            'background-position': '0% 0%',
          },
          '100%': {
            'background-position': '200% 0%',
          },
        }
      },
      backgroundImage: {
        'card-border': 'linear-gradient(90deg, transparent, rgba(255, 242, 0, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};