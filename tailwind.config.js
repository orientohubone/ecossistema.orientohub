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
      colors: {
        primary: {
          DEFAULT: '#FFD700',
          50: '#FFFDF0',
          100: '#FFFBE0',
          200: '#FFF7C2',
          300: '#FFF3A3',
          400: '#FFEF85',
          500: '#FFD700',
          600: '#CCAC00',
          700: '#998100',
          800: '#665600',
          900: '#332B00',
          950: '#1A1500',
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
        'card-border': 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};