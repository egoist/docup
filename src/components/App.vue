<template>
  <div
    id="docup-root"
    :style="{'font-family': opts.customFont}">
    <doc-loading v-if="loading" />
    <div class="Container" v-else>
      <header class="Header" v-if="title">
        <h1 class="Title" v-html="title"></h1>
        <h2 class="Description" v-if="description" v-html="description"></h2>
      </header>
      <div class="Body">
        <div class="Sidebar">
          <doc-menu :menu="menu" />
        </div>
        <div class="Main">
          <div class="Content" :class="{'highlightFirstParagraph': opts.highlightFirstParagraph}" v-html="html"></div>
          <div class="Footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'unfetch'
import md from 'md'
import slugo from 'slugo'
import jump from 'jump.js'

import highlight from '../utils/highlight'
import linksInNewTab from '../utils/links-in-new-tab'
import DocMenu from './Menu.vue'
import DocLoading from './Loading.vue'

import anchorIcon from '!raw-loader!../svg/anchor.svg'

export default {
  props: ['opts'],

  data() {
    return {
      title: null,
      description: this.opts.description,
      html: '',
      menu: [],
      loading: true
    }
  },

  async created() {
    this.loading = true
    const content = await fetch(`${this.opts.root}${this.opts.indexFile}`).then(
      res => res.text()
    )
    const renderer = new md.Renderer()
    const orginalHeading = renderer.heading.bind(renderer)
    let title = this.opts.title
    const menu = []
    renderer.heading = (text, depth, raw) => {
      if (depth === 1) {
        if (!title) {
          title = text
        }
        return ''
      }
      const slug = slugo(raw)
      if (depth === 2) {
        menu.push({
          title: text,
          slug
        })
      }
      text = `<a class="Anchor" href="#${slug}">${anchorIcon}</a>${text}`
      return orginalHeading(text, depth, raw)
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
    renderer.html = html => {
      if (HIDE_START.test(html)) {
        hideCount++
        return HIDE_START_HOLDER + hideCount
      }
      if (HIDE_STOP.test(html)) {
        return HIDE_STOP_HOLDER + hideCount
      }
      if (SHOW_START.test(html)) {
        return md(html.replace(SHOW_START, '').replace(/^-->$/m, ''), {
          highlight: this.opts.highlight && highlightFn,
          linksInNewTab
        })
      }
      return html
    }

    const highlightLinesRe = /{([\d,-]+)}/
    const rendererCode = renderer.code.bind(renderer)
    renderer.code = (code, lang, escaped) => {
      code = rendererCode(code, lang, escaped)

      if (lang && highlightLinesRe.test(lang)) {
        const lineNumbers = highlightLinesRe
          .exec(lang)[1]
          .split(',')
          .map(v => v.split('-').map(v => parseInt(v)))
        const codeSplits = code.split('\n').map((split, index) => {
          const lineNumber = index + 1
          const inRange = lineNumbers.some(([start, end]) => {
            if (start && end) {
              return lineNumber >= start && lineNumber <= end
            }
            return lineNumber === start
          })
          if (inRange) {
            return {
              code: `<span class="docup-highlight-line">${split}</span>`,
              highlighted: true
            }
          }
          return {
            code: split
          }
        })
        let highlightedCode = ''
        codeSplits.forEach(
          split =>
            split.highlighted
              ? (highlightedCode += split.code)
              : (highlightedCode += `${split.code}\n`)
        )
        return highlightedCode
      }

      return code
    }

    const highlightFn =
      typeof this.opts.highlight === 'function'
        ? this.opts.highlight
        : highlight
    let html = md(content, {
      renderer,
      highlight: this.opts.highlight && highlightFn,
      linksInNewTab
    })

    // Strip out hidden contents
    for (let i = 0; i < hideCount; i++) {
      const RE = new RegExp(
        `${HIDE_START_HOLDER}${i + 1}([\\s\\S]*)${HIDE_STOP_HOLDER}${i + 1}`,
        'gi'
      )
      html = html.replace(RE, '')
    }

    this.html = html
    this.title = title
    this.menu = menu
    this.loading = false

    await this.$nextTick()
    const el = location.hash && document.getElementById(location.hash.slice(1))
    if (el) {
      jump(el, {
        duration: 0
      })
    }
  },

  components: {
    DocMenu,
    DocLoading
  }
}
</script>

<style src="prismjs/themes/prism.css"></style>

<style>
* {
  box-sizing: border-box;
}

:root {
  --ease: cubic-bezier(0.82, 0, 0.12, 1);
  --width: 800px;
  --header-height: 400px;

  --dark: #000;
  --blue: #33a9ff;
  --light-gray: #fafafa;

  --bg: #fff;
  --fg: #868e96;
  --fg-dark: #212529;

  --selection-bg: var(--blue);
  --selection-fg: white;
}

body {
  margin: 0;
  font: 16px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: 300;
}

.Container {
  margin: 0 auto;
  max-width: var(--width);
}

.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
  background: transparent;
}

.docup-highlight-line {
  background-color: #f7f8f9;
  display: block;
  margin: 0 -30px;
  padding: 0 30px;
}

h2,
h3,
h4 {
  margin-top: 75px;
  margin-bottom: 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: var(--fg-dark);
}

h2 {
  margin-top: 100px;
  padding-top: 50px;
  font-size: 1.5rem;
}

h2:first-child {
  margin-top: 0;
  padding-top: 0;
}

.highlightFirstParagraph h2 + p {
  font-size: 1.6rem;
  line-height: 1.6;
}

h2 + iframe,
h3 + iframe,
h4 + iframe {
  margin-top: 25px;
}

a {
  color: inherit;
  text-decoration: none;
}

p {
  margin: 25px 0;
  line-height: 1.6;
}

li strong,
p strong {
  color: var(--fg-dark);
  font-weight: 500;
}

li a,
p a {
  color: var(--fg-dark);
  font-weight: 400;
  padding-bottom: 3px;
  border-bottom: 1px dotted #ddd;
}

li a:hover,
p a:hover {
  color: var(--blue);
  border-bottom: none;
}

ul {
  margin: 30px 0 30px 30px;
  padding: 0;
}

ul ul {
  margin: 10px 0 10px 30px;
}

ul li {
  margin: 5px 0;
  line-height: 1.5em;
}

ul li strong {
  font-weight: 500;
}

img {
  max-width: 100%;
}

pre {
  background: transparent;
  border: 1px solid #f0f0f0;
  padding: 30px;
  border-radius: 3px;
  overflow-x: auto;
  font-family: 'Source Code Pro', Menlo, monospace;
  font-size: 0.8em;
  line-height: 1.5em;
  margin: 40px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

code {
  font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
    'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace,
    serif;
}

li > code,
p > code {
  border: 1px solid #dee2e6;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
  font-family: inherit;
}

hr {
  border: none;
  background-color: #f9f9f9;
  height: 1px;
  margin: 25px 0;
  height: 1px;
}

details > summary {
  cursor: pointer;
  outline: none;
  user-select: none;
}

details > p {
  border-left: 3px solid var(--dark);
  padding-left: 15px;
}

blockquote {
  padding: 10px 15px;
  border-left: 3px solid rgb(0, 0, 0);
  margin: 20px 0px;
}

blockquote p,
.Message p {
  margin: 0;
}

blockquote p:not(:first-child),
.Message p:not(:first-child) {
  margin-top: 20px;
}

.Message {
  background: whitesmoke;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  color: #4a4a4a;
  padding: 1em 1.25em;
  margin: 25px 0;
}

.Message.alert {
  background: #fff5f7;
  border-color: #ff3860;
  color: #cd0930;
}

.Message.info {
  background: #f6fbfe;
  border-color: #209cee;
  color: #12537e;
}

.Message.warning {
  background: #fffdf5;
  border-color: #ffdd57;
  color: #3b3108;
}

.Message.success {
  background: #f6fef9;
  border-color: #23d160;
  color: #0e301a;
}

.Anchor {
  position: relative;
  margin-left: -14px;
  opacity: 0.15;
  display: inline-block;
  width: 14px;
  height: 14px;
  visibility: hidden;
}

.Anchor:hover {
  opacity: 1;
}

.Anchor svg {
  position: absolute;
  right: 5px;
  top: 0;
}

h2:hover .Anchor,
h3:hover .Anchor,
h4:hover .Anchor {
  visibility: visible;
}
</style>

<style scoped>
.Header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: var(--header-height);
}

.Title {
  margin: 0;
  font-size: 20px;
  text-transform: uppercase;
}

.Description {
  margin-top: 0;
  padding-top: 10px;
  font-size: 16px;
  color: var(--fg);
  font-weight: 300;
}

.Body {
  display: flex;
}

.Sidebar {
  flex: 1 1 auto;
}

.Main {
  width: 75%;
}

.Footer {
  height: 100px;
}

@media screen and (max-width: 768px) {
  .Body {
    flex-direction: column;
    padding: 0 20px;
  }

  .Sidebar {
    margin-bottom: 40px;
  }

  .Main {
    width: 100%;
  }
}
</style>
