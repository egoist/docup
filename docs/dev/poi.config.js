const fs = require('fs')
const express = require('express')
const pkg = require('../../package')

module.exports = {
  entry: ['docs/dev/main.js'],
  envs: {
    DOCUP_VERSION: pkg.version,
    PRISM_VERSION: require('prismjs/package').version,
    PRISM_LANGUAGES: getPrismLanguages()
  },
  devServer: {
    after(app) {
      app.use(express.static('docs'))
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm-bundler.js')

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader(require.resolve('vue-loader'))
      .options({})

    config.plugin('vue').use(require('vue-loader').VueLoaderPlugin)
  }
}

function getPrismLanguages() {
  const files = fs.readdirSync('node_modules/prismjs/components')
  return files
    .filter(file => file.endsWith('.min.js'))
    .map(file => {
      const [, name] = /\-([^\.]+)/.exec(file)
      return name
    })
}
