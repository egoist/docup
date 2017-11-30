import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'

export default function highlight(str, lang) {
  return Prism.highlight(str, Prism.languages[lang] || Prism.languages.markup)
}
