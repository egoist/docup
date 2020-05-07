import './css/prism.css'
import Vue from 'vue'
import App from './components/App.vue'

export class Docup {
  constructor(options) {
    this.options = {
      indexFile: 'README.md',
      root: './',
      highlight: true,
      ...options
    }

    if (this.options.customFont) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
        this.options.customFont
      )}:300,400,600`
      document.head.appendChild(link)
    }

    if (this.options.target) {
      this.start(this.options.target)
    }
  }

  start(el) {
    return new Vue({
      el,
      render: h => h(App, { props: { opts: this.options } })
    })
  }
}

export function init(options) {
  return new Docup(options)
}

export const version = process.env.DOCUP_VERSION
