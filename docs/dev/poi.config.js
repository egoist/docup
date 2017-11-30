const path = require('path')

module.exports = {
  entry: 'src/index.js',
  jsx: 'h',
  html: {
    template: path.join(__dirname, 'index.ejs'),
    inject: false
  },
  vendor: false,
  presets: [
    require('poi-preset-bundle-report')()
  ]
}
