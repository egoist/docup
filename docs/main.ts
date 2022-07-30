import { init } from '../src/docup'

export * from '../src/docup'

init({
  title: 'Docup',
  highlightLanguages: ['nginx'],
  props: {
    langs: PRISM_LANGUAGES,
  },
  beforeSidebar: `<div style="background:#f9f9f9;padding: 20px;">
    <div>
      <strong style="font-size: 0.8rem;color:#ccc;">SPONSOR</strong>
    </div>
    <a href="https://browserku.com" rel="nofollow noopener" target="_blank"
      title="API for web scraping, screenshots, PDF generation and more"
      ><img src="https://cdn.jsdelivr.net/gh/egoist-bot/images@main/upic/b38Wz1.png"
    /></a>
  </div>`,
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
