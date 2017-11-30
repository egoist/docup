<template>
  <div class="doc-page container">
    <header class="doc-header" v-if="title">
      <h1 class="doc-title">{{ title }}</h1>
    </header>
    <div class="doc-body">
      <div class="doc-sidebar">
        <doc-menu :menu="menu" />
      </div>
      <div class="doc-main">
        <div class="doc-content" v-html="html"></div>
        <div class="doc-footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'unfetch'
import marked from 'marked3'
import slugo from 'slugo'

import highlight from '../utils/highlight'
import DocMenu from '../components/Menu.vue'

export default {
  props: ['opts'],

  data() {
    return {
      title: null,
      html: '',
      menu: []
    }
  },

  async created() {
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
  },

  components: {
    DocMenu
  }
}
</script>

<style scoped>
.doc-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.doc-title {
  margin: 0;
  font-size: 18px;
}

.doc-body {
  display: flex;
}

.doc-sidebar {
  flex: 1 1 auto;
}

.doc-main {
  width: 75%;
}

.doc-footer {
  height: 100px;
}
</style>
