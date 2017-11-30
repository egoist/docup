import Vue from 'vue'
import App from './components/App.vue'

class Docup {
  constructor({
    indexFile = 'README.md',
    root = './',
    highlight = true
  } = {}) {
    this.options = {
      indexFile,
      root,
      highlight
    }
  }

  start(el) {
    return new Vue({
      el,
      render: h => h(App, { props: { opts: this.options } })
    })
  }
}

export default function docup(options) {
  return new Docup(options)
}

if (process.env.NODE_ENV === 'development') {
  window.Docup = docup
}

window.DOCUP_VERSION = process.env.DOCUP_VERSION
