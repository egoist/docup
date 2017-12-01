<template>
  <div id="docup-root">
    <doc-loading v-if="loading" />
    <div class="Container" v-else>
      <header class="Header" v-if="title">
        <h1 class="Title">{{ title }}</h1>
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
import marked from 'marked3'
import slugo from 'slugo'

import highlight from '../utils/highlight'
import DocMenu from './Menu.vue'
import DocLoading from './Loading.vue'

export default {
  props: ['opts'],

  data() {
    return {
      title: null,
      html: '',
      menu: [],
      loading: true
    }
  },

  async created() {
    this.loading = true
    const content = await fetch(`${this.opts.root}${this.opts.indexFile}`).then(res => res.text())
    const renderer = new marked.Renderer()
    const orginalHeading = renderer.heading.bind(renderer)
    let title
    const menu = []
    renderer.heading = (text, depth, raw) => {
      if (depth === 1) {
        title = text
        return ''
      }
      if (depth === 2) {
        menu.push({
          title: text,
          slug: slugo(raw)
        })
      }
      return orginalHeading(text, depth, raw)
    }
    const highlightFn = typeof this.opts.highlight === 'function' ? this.opts.highlight : highlight
    this.html = marked(content, {
      renderer,
      highlight: this.opts.highlight && highlightFn
    })
    this.title = title
    this.menu = menu
    this.loading = false
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
  --ease: cubic-bezier(.82, 0, .12, 1);
  --width: 800px;
  --header-height: 400px;

  --dark: #000;
  --blue: #33A9FF;
  --light-gray: #fafafa;

  --bg: #fff;
  --fg: #868E96;
  --fg-dark: #212529;

  --selection-bg: var(--blue);
  --selection-fg: white;
}

body {
  margin: 0;
  font: 16px/1.4 -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif;
  font-weight: 300;
}

.Container {
  margin: 0 auto;
  max-width: var(--width);
}

h2, h3, h4 {
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

pre {
  background: transparent;
  border: 1px solid #f0f0f0;
  padding: 30px;
  border-radius: 2px;
  overflow-x: auto;
  font: "Source Code Pro", Menlo, monospace;
  font-size: .8em;
  line-height: 1.5em;
  margin: 40px 0;
}

code {
  font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
}

li > code,
p > code {
  border: 1px solid #DEE2E6;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
  font-family: inherit;
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
</style>

<style scoped>
.Header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--header-height);
}

.Title {
  margin: 0;
  font-size: 18px;
  text-transform: uppercase;
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
