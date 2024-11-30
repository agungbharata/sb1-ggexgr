/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4B996', // Champagne Gold
          dark: '#C4A576',    // Dark Champagne
          light: '#E5D4B7',   // Light Champagne
          50: '#FAF7F2',
          100: '#F5EFE5',
          200: '#EBE0CC',
          300: '#E1D1B3',
          400: '#D4B996', // Same as DEFAULT
          500: '#C4A576',
          600: '#B49156',
          700: '#997B3D',
          800: '#7D6431',
          900: '#614D26'
        },
        secondary: {
          DEFAULT: '#DABDAD', // Dusty Rose
          dark: '#C69C98',    // Dark Dusty Rose
          light: '#E8D3CD',   // Light Dusty Rose
          50: '#FAF6F5',
          100: '#F5EDEB',
          200: '#EBD9D6',
          300: '#E1C5C1',
          400: '#DABDAD', // Same as DEFAULT
          500: '#C69C98',
          600: '#B27B76',
          700: '#995A54',
          800: '#7D4943',
          900: '#613833'
        },
        neutral: {
          cream: '#FAF3E0',   // Warm Cream
          beige: '#F5E6D3',   // Beige
          gray: '#E2D5C7',    // Warm Gray
          darkGray: '#6B5B4E' // Dark Warm Gray
        }
      }
    },
  },
  plugins: [],
};
