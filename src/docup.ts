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
  navLinks: NavLink[]
  props?: any
}

export type InstanceOptions = SetRequired<Options, 'indexFile' | 'root' | 'highlight' | 'title'>

export class Docup {
  options: InstanceOptions

  constructor(options: Options) {
    this.options = {
      title: options.title || document.title || 'Docup',
      indexFile: 'README.md',
      root: './',
      highlight: true,
      ...options,
    }
  }

  init() {
    render(h(App, { options: this.options }), document.body)
  }
}

export function init(options: Options) {
  const docup = new Docup(options)
  docup.init()
}

export const version = process.env.DOCUP_VERSION
