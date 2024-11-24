/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4B91',
          dark: '#E6447F',
          light: '#FF6FA3',
          50: '#FFF1F6',
          100: '#FFE4ED',
          200: '#FFC9DB',
          300: '#FF9EBD',
          400: '#FF739F',
          500: '#FF4B91',
          600: '#FF1A73',
          700: '#E6005C',
          800: '#B30047',
          900: '#800033'
        }
      }
    },
  },
  plugins: [],
};
