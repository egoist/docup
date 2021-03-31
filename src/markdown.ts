import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markdown'
import { isExternalLink, slugify, ANCHOR_ICON } from './utils'
import htm from 'htm'
import { render } from 'fre'
import * as hooks from 'fre'

const BLOCKQUOTE_TAG_RE = /^<p>(?:<strong>)?(Note|Alert|Info|Warning|Success|Alert)(?:<\/strong>)?\:\s*/i

export interface SidebarMenuItem {
  text: string
  slug: string
  depth: number
}

export function renderMarkdown(text: string, { props }: { props: any }) {
  const renderer = new marked.Renderer()
  const fns: Array<() => void> = []

  const originalBlockquote = renderer.blockquote
  renderer.blockquote = (quote) => {
    const m = BLOCKQUOTE_TAG_RE.exec(quote)
    if (m) {
      const [, type] = m
      return `<div class="message message_type__${type.toLowerCase()}"><p>${quote.replace(
        BLOCKQUOTE_TAG_RE,
        ''
      )}</div>`
    }
    return originalBlockquote.call(renderer, quote)
  }

  const originalCode = renderer.code
  let codeReplacementIndex = 0

  renderer.code = (code, _lang = '', escaped) => {
    const [lang, info] = _lang.split(' ')
    if (info === 'preact') {
      const index = codeReplacementIndex++
      fns.push(() => {
        const newCode = `${code.replace(/export\s+default\s/, 'return ')}`
        const getComponent = new Function('html', 'hooks', newCode)
        let Component
        try {
          Component = getComponent(htm.bind(h), hooks)
        } catch (error) {
          console.error(`Error compiling code block`)
          throw error
        }
        const el = document.getElementById(`code-replacement-${index}`)
        if (el) {
          render(h(Component, props), el)
        }
      })
      return `<div id="code-replacement-${index}"></div>`
    }
    return originalCode.call(renderer, code, lang, escaped)
  }

  renderer.link = (href, title, text) => {
    let attrs = ` href="${href}"`
    if (title) {
      attrs += ` title="${title}"`
    }
    if (href && isExternalLink(href)) {
      attrs += ` target="_blank" rel="nofollow noopener"`
    }
    return `<a${attrs}>${text}</a>`
  }

  // @ts-ignore
  renderer.listitem = (text, task) => {
    return `<li${task ? ` class="task_list__item"` : ''}>${text}</li>`
  }

  const menu: Array<SidebarMenuItem> = []
  const slugs: string[] = []
  renderer.heading = (text, depth, raw) => {
    // Hide h1
    if (depth === 1) {
      return ''
    }
    let slug = slugify(raw)
    const existingCount = slugs.filter((s) => s === slug).length
    slugs.push(slug)
    if (existingCount > 0) {
      slug = `${slug}-${existingCount}`
    }
    if (depth < 5) {
      menu.push({
        text,
        slug,
        depth: depth,
      })
    }
    text = `<a class="anchor" href="#${slug}">${ANCHOR_ICON}</a>${text}`
    return `<h${depth} class="heading" id="${slug}">${text}</h${depth}>`
  }

  const html = marked(text, {
    renderer,
    gfm: true,
    highlight(code, lang) {
      const prismLang = Prism.languages[lang] || Prism.languages.markup
      return Prism.highlight(code, prismLang, prismLang ? lang : 'markup')
    },
  })

  return {
    html,
    menu,
    fns,
  }
}
