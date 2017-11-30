import Prism from 'prismjs'
/* eslint-disable import/no-unassigned-import */
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
/* eslint-enable import/no-unassigned-import */

export default function highlight(str, lang) {
  return Prism.highlight(str, Prism.languages[lang] || Prism.languages.markup)
}
