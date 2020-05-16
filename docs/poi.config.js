const fs = require('fs')
const express = require('express')
const pkg = require('../package')

module.exports = {
  entry: ['docs/main.js'],
  output: {
    dir: 'docs/dist',
    html: {
      title: 'Docup',
    },
  },
  publicFolder: 'docs',
  envs: {
    DOCUP_VERSION: pkg.version,
    PRISM_VERSION: require('prismjs/package').version,
    PRISM_LANGUAGES: getPrismLanguages(),
  },
  babel: {
    jsx: 'preact',
  },
  devServer: {
    after(app) {
      app.use(express.static('docs'))
    },
  },
}

function getPrismLanguages() {
  const files = fs.readdirSync('node_modules/prismjs/components')
  return files
    .filter((file) => file.endsWith('.min.js'))
    .map((file) => {
      const [, name] = /\-([^\.]+)/.exec(file)
      return name
    })
}
