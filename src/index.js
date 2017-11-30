import Vue from 'vue'
import createRouter from './router'
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
    const router = createRouter(this.options)
    return new Vue({
      el,
      router,
      render: h => h(App)
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
