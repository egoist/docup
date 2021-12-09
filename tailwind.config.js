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
      borderColor: {
        border: 'var(--border-fg)',
      },
    },
  },
  variants: {},
  plugins: [],
}
