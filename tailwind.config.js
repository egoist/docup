const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  variants: {},
  plugins: [],
}
