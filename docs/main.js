import { init } from '../src/docup'

init({
  title: 'Docup',
  logo: '<img src="logo.svg" width="60">',
  description: 'Simply beautiful documentation.',
  highlightLanguages: ['nginx'],
  props: {
    langs: process.env.PRISM_LANGUAGES,
  },
  navLinks: [
    {
      text: 'Guide',
      link: '#guide',
    },
    {
      text: 'API',
      link: '#api',
    },
    {
      text: 'Resources',
      link: '#resources',
    },
    {
      text: 'GitHub',
      link: 'https://github.com/egoist/docup',
    },
    {
      text: 'Donate',
      link: 'https://github.com/sponsors/egoist'
    }
  ],
})
