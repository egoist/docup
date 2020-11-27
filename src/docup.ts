import './css/tailwind.css'
import './css/prism.css'
import './css/main.css'
import './css/content.css'
import { SetRequired } from 'type-fest'
import { h, render } from 'preact'
import { App } from './components/App'

export interface NavLink {
  text: string
  link: string
}

export interface Options {
  title?: string
  indexFile?: string
  root?: string
  highlight?: boolean
  highlightLanguages?: string[]
  navLinks?: NavLink[]
  props?: any
  font?: string
  base?: string
  theme?: 'default' | 'dark'
}

export type InstanceOptions = SetRequired<
  Options,
  'indexFile' | 'root' | 'highlight' | 'title' | 'base'
>

export class Docup {
  options: InstanceOptions

  constructor(options: Options = {}) {
    const matchedDarkTheme =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    this.options = {
      title: options.title || document.title || 'Docup',
      indexFile: 'README.md',
      root: '',
      base: '/',
      highlight: true,
      theme: matchedDarkTheme ? 'dark' : 'default',
      ...options,
    }
  }

  init() {
    const font = this.options.font || 'Lato'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@400;700&display=swap`
    document.head.appendChild(link)

    render(h(App, { options: this.options }), document.body)
  }
}

export function init(options: Options) {
  const docup = new Docup(options)
  docup.init()
}

export const version = process.env.DOCUP_VERSION
