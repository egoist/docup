import marked from 'marked'
// @ts-ignore
import anchorIcon from '!raw-loader!../svg/anchor.svg'
import { evaluate } from './evaluate'
import highlight from '../utils/highlight'
import { escapeHtml } from './html'

type Options = {
  highlight?: boolean | ((lang: string) => string)
  linksInNewTab?: boolean
}

function slugify(input: string) {
  return input // Remove html tags
  .replace(/<(?:.|\n)*?>/gm, '') // Remove special characters
  .replace(/[!\"#$%&'\(\)\*\+,\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') // eslint-disable-line no-useless-escape
  // Replace dots and spaces with a short dash
  .replace(/(\s|\.)/g, '-') // Replace long dash with two short dashes
  .replace(/—/g, '--') // Make the whole thing lowercase
  .toLowerCase();
}

function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

export async function renderMarkdown(content: string, options: Options) {
  let title: string | undefined

  const highlightFn =
    typeof options.highlight === 'function' ? options.highlight : highlight
  const renderer = new marked.Renderer()

  const render = (content: string) => {
    const html = marked(content, {
      renderer,
      highlight: options.highlight && highlightFn
    })
    return html
  }

  renderer.link = (href, title, text) => {
    let attrs = ` href="${href}"`
    if (title) {
      attrs += ` title="${title}"`
    }
    if (isExternalLink(href)) {
      attrs += ` target="_blank" rel="nofollow noopener"`
    }
    return `<a${attrs}>${text}</a>`
  }

  const menu = []
  const slugs = []
  renderer.heading = (text, depth, raw) => {
    if (depth === 1) {
      title = text
      return ''
    }
    let slug = slugify(raw)
    const existingCount = slugs.filter(s => s === slug).length
    slugs.push(slug)
    if (existingCount > 0) {
      slug = `${slug}-${existingCount}`
    }
    if (depth === 2) {
      menu.push({
        title: text,
        slug
      })
    }
    text = `<a class="Anchor" href="#${slug}">${anchorIcon}</a>${text}`
    return `<h${depth} id="${slug}">${text}</h${depth}>`
  }
  const originalBlockquote = renderer.blockquote
  renderer.blockquote = quote => {
    const RE = /^<p><strong>(.+)<\/strong>:\s*/
    if (RE.test(quote)) {
      const TAG = RE.exec(quote)[1]
      return `<div class="Message ${TAG.toLowerCase()}"><p>${quote.replace(
        RE,
        ''
      )}</div>`
    }
    return originalBlockquote(quote)
  }

  let hideCount = 0
  const HIDE_START = /^<!--\s*hide-on-docup-start\s*-->/
  const HIDE_STOP = /^<!--\s*hide-on-docup-stop\s*-->/
  const HIDE_START_HOLDER = '#!!!hide-start!!!'
  const HIDE_STOP_HOLDER = '#!!!hide-stop!!!'
  const SHOW_START = /^<!--\s*show-on-docup\s*\n/
  const DIV_START = /<!--\s*<div([^>]+)+>\s*-->/
  const DIV_END = /<!--\s*<\/div>\s*-->/
  renderer.html = html => {
    if (HIDE_START.test(html)) {
      hideCount++
      return HIDE_START_HOLDER + hideCount
    }
    if (HIDE_STOP.test(html)) {
      return HIDE_STOP_HOLDER + hideCount
    }
    if (SHOW_START.test(html)) {
      return render(html.replace(SHOW_START, '').replace(/^-->$/m, ''))
    }
    if (DIV_START.test(html)) {
      const m = DIV_START.exec(html)
      return `<div${m[1]}>`
    }
    if (DIV_END.test(html)) {
      return `</div>`
    }
    return html
  }

  const CODE_BLOCK_OPTIONS_RE = /{([^}]+)}/
  const rendererCode = renderer.code.bind(renderer)
  renderer.code = (code, lang, escaped) => {
    code = rendererCode(code, lang, escaped)
    code = code.replace(/<pre([^\>]*)>/, '<pre v-pre$1>')

    const options =
      lang &&
      CODE_BLOCK_OPTIONS_RE.test(lang) &&
      evaluate(CODE_BLOCK_OPTIONS_RE.exec(lang)[1])
    const lineNumbers =
      options &&
      options.highlightLines &&
      [].concat(options.highlightLines).map(value => {
        if (typeof value === 'string') {
          return value.split('-').map(v => parseInt(v))
        }
        return [value]
      })
    if (lineNumbers) {
      const codeSplits = escapeHtml(code).split('\n').map((split, index) => {
        split = split || '&#8203;'
        const lineNumber = index + 1
        const inRange = lineNumbers.some(([start, end]) => {
          if (start && end) {
            return lineNumber >= start && lineNumber <= end
          }
          return lineNumber === start
        })
        if (inRange) {
          return `<div class="code-line is-highlighted">${split}</div>`
        }
        return `<div class="code-line">${split}</div>`
      })
      const codeMask = `<div class="docup-highlight-mask">${codeSplits.join('')}</div>`
      return `<div class="docup-highlight">${codeMask}<div class="docup-highlight-code">${code}</div></div>`
    }

    return `<div class="docup-highlight"><div class="docup-highlight-code">${code}</div></div>`
  }

  let html = render(content)

  // Strip out hidden contents
  for (let i = 0; i < hideCount; i++) {
    const RE = new RegExp(
      `${HIDE_START_HOLDER}${i + 1}([\\s\\S]*)${HIDE_STOP_HOLDER}${i + 1}`,
      'gi'
    )
    html = html.replace(RE, '')
  }

  return {
    html,
    title,
    menu
  }
}
