/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f9ebe5',
          200: '#f4d7cc',
          300: '#eec3b2',
          400: '#e8af99',
          500: '#e29b7f',
          600: '#b57c66',
          700: '#885d4c',
          800: '#5b3e33',
          900: '#2d1f19',
        },
        secondary: {
          50: '#f7f4f1',
          100: '#efe9e3',
          200: '#dfd3c7',
          300: '#cfbdab',
          400: '#bfa78f',
          500: '#af9173',
          600: '#8c745c',
          700: '#695745',
          800: '#463a2e',
          900: '#231d17',
        },
        accent: {
          50: '#f6f4f1',
          100: '#ede9e3',
          200: '#dbd3c7',
          300: '#c9bdab',
          400: '#b7a78f',
          500: '#a59173',
          600: '#84745c',
          700: '#635745',
          800: '#423a2e',
          900: '#211d17',
        },
        neutral: {
          50: '#faf6f1',
          100: '#f5ede3',
          200: '#ebdbc7',
          300: '#e1c9ab',
          400: '#d7b78f',
          500: '#cda573',
          600: '#a4845c',
          700: '#7b6345',
          800: '#52422e',
          900: '#292117',
        },
        success: {
          50: '#f3f6f4',
          500: '#8a9f8d',
          600: '#6e7f71',
        },
        warning: {
          50: '#faf6f1',
          500: '#d4b485',
          600: '#aa906a',
        },
        error: {
          50: '#f9f2f2',
          500: '#c49a9a',
          600: '#9d7b7b',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};