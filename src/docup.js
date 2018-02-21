import Vue from 'vue'
import App from './components/App.vue'

// import 'typeface-open-sans/index.css'
// import 'typeface-source-sans-pro/index.css'

class Docup {
  constructor(options) {
    this.options = {
      indexFile: 'README.md',
      root: './',
      highlight: true,
      highlightFirstParagraph: false,
      ...options
    }

    if (this.options.customFont) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(this.options.customFont)}:300,400,600`
      document.head.appendChild(link)
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
