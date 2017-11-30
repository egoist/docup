const path = require('path')
const pkg = require('../../package')

module.exports = {
  entry: 'src/index.js',
  html: {
    template: path.join(__dirname, 'index.ejs'),
    inject: false
  },
  vendor: false,
  presets: [
    require('poi-preset-bundle-report')()
  ],
  env: {
    DOCUP_VERSION: pkg.version
  }
}
