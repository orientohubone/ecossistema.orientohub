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
          DEFAULT: '#eab308',
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
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
        'card-border': 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};