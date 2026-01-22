/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Beige/Brown/Sand color palette
        sand: {
          50: '#fdfbf7',
          100: '#f8f4ed',
          200: '#f0e6d6',
          300: '#e8d8bf',
          400: '#d9c4a0',
          500: '#c9af81',
          600: '#b89a62',
          700: '#9a7f4d',
          800: '#7c653e',
          900: '#5e4b2f',
        },
        cream: {
          50: '#fffef9',
          100: '#fffcf0',
          200: '#fef8de',
          300: '#fdf4cc',
          400: '#fcedb3',
          500: '#fbe599',
          600: '#e6d08a',
          700: '#c0ad72',
          800: '#9a8a5a',
          900: '#746742',
        },
        brown: {
          50: '#fdf8f3',
          100: '#f6e8da',
          200: '#e8cfb2',
          300: '#d6b184',
          400: '#c08a55',
          500: '#a66a3a',
          600: '#8b522c',
          700: '#6f3f22',
          800: '#4a2916',
          900: '#2f180c',
          950: '#1a0c05',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
