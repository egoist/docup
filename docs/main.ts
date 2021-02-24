import { init } from '../src/docup'

init({
  title: 'Docup',
  highlightLanguages: ['nginx'],
  props: {
    langs: PRISM_LANGUAGES,
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
      link: 'https://github.com/sponsors/egoist',
    },
  ],
})
