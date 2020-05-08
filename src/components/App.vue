<template>
  <div id="docup-root" :style="{ 'font-family': opts.customFont }">
    <doc-loading v-if="loading" />
    <div class="Container" v-else>
      <header class="Header" v-if="title">
        <div class="Logo" v-if="opts.logo" v-html="opts.logo"></div>
        <h1 class="Title" v-html="title"></h1>
        <h2
          class="Description"
          v-if="opts.description"
          v-html="opts.description"
        ></h2>
      </header>
      <div class="Body">
        <div class="Sidebar">
          <doc-menu :menu="menu" />
        </div>
        <div class="Main">
          <component v-if="Content" :is="Content" />
          <div class="Footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'unfetch'
import marked from 'marked'
import jump from 'jump.js'
import load from 'loadjs'

import { renderMarkdown } from '../utils/markdown'
import DocMenu from './Menu.vue'
import DocLoading from './Loading.vue'

export default {
  props: ['opts'],

  data() {
    return {
      title: '',
      html: '',
      menu: [],
      loading: true
    }
  },

  async created() {
    this.loading = true

    const [content] = await Promise.all([
      await fetch(`${this.opts.root}${this.opts.indexFile}`).then(res =>
        res.text()
      ),
      Array.isArray(this.opts.highlightLanguages) &&
        (await load(
          this.opts.highlightLanguages.map(
            lang =>
              `https://cdn.jsdelivr.net/npm/prismjs/components/prism-${lang}.min.js`
          ),
          'prism-languages',
          {
            returnPromise: true
          }
        ))
    ])

    const { html, title, menu } = await renderMarkdown(content, {
      highlight: this.opts.highlight,
      linksInNewTab: this.opts.linksInNewTab
    })
    this.html = html
    this.title = this.opts.title || title

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

  computed: {
    Content() {
      return (
        this.html && {
          template: `<div>${this.html}</div>`,
          data: this.opts.data
        }
      )
    }
  },

  components: {
    DocMenu,
    DocLoading
  }
}
</script>

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
  --fg-dark: var(--dark);

  --selection-bg: var(--blue);
  --selection-fg: white;
  --highlight-line-bg: rgb(9, 39, 121);
  --highlight-line-border-color: rgb(26, 159, 221);
  --code-block-bg: #011627;
  --code-block-color: #d6deeb;
  --code-font-size: .875rem;
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

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  background: transparent;
}

.docup-highlight {
  position: relative;
  background: var(--code-block-bg);
  font-family: 'Source Code Pro', Menlo, monospace;
  font-size: var(--code-font-size);
  border-radius: 12px;
  overflow: hidden;
  margin: 40px 0;
  white-space: pre;
}

.docup-highlight-code,
.docup-highlight-mask {
  padding: 30px;
}

.docup-highlight-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  color: transparent;
  padding-left: 0;
  padding-right: 0;
  white-space: pre;
}

.docup-highlight-code {
  position: relative;
  z-index: 2;
  overflow: auto;
  font-size: 0;
}

.docup-highlight-code pre {
  line-height: 1.5;
}

.docup-highlight-code pre code {
  font-size: var(--code-font-size);
}

.code-line {
  padding: 0 30px;
  margin-bottom: 1.5px;
}

.code-line.is-highlighted {
  background-color: var(--highlight-line-bg);
  box-shadow: inset 4px 0 0 var(--highlight-line-border-color);
}

h2,
h3,
h4 {
  margin-top: 75px;
  margin-bottom: 0;
  font-weight: 600;
  line-height: 1.5rem;
}

h2 {
  margin-top: 100px;
  padding-top: 50px;
  font-size: 2.3rem;
}

h2:first-child {
  margin-top: 0;
  padding-top: 0;
}

h3 {
  font-size: 1.7rem;
}

h4 {
  font-size: 1.3rem;
}

h5 {
  font-size: 1rem;
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
  font-weight: 500;
}

li a,
p a {
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
  margin: 0;
  color: var(--code-block-color);
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  tab-size: 4;
  hyphens: none;
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

.Logo img {
  height: 60px;
}

.Title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
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
