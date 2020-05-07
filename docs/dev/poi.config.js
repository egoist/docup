const express = require('express')
const pkg = require('../../package')

module.exports = {
  entry: ['src/index.js', 'docs/dev/main.js'],
  envs: {
    DOCUP_VERSION: pkg.version
  },
  devServer: {
    after(app) {
      app.use(express.static('docs'))
    }
  }
}
