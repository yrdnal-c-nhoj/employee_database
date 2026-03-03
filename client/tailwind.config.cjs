/** @type {import('tailwindcss').Config} */
const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oxanium', 'sans-serif'],
        label: ['Roboto', 'sans-serif'],
        navigation: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    forms,
    typography,
    function({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded text-sm transition-colors' : '',
        },
        '.btn-primary': {
          '@apply bg-gray-50 hover:bg-blue-200 text-blue-700 hover:text-orange-800 font-label' : '',
        },
      })
    },
  ],
}