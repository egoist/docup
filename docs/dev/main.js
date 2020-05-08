
import {init} from '../../src'

init({
  target: '#app',
  logo: '<img src="logo.svg" width="60">',
  description: 'Simply beautiful documentation.',
  data() {
    return {
      prismLanguages: process.env.PRISM_LANGUAGES
    }
  }
})
