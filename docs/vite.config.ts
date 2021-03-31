import fs from 'fs'
import path from 'path'
import { UserConfig } from 'vite'
import prefresh from '@prefresh/vite'
import windicss from 'vite-plugin-windicss'

const pkg = require('../package.json')

function getPrismLanguages() {
  const files = fs.readdirSync('node_modules/prismjs/components')
  return files
    .filter((file) => file.endsWith('.min.js'))
    .map((file) => {
      const [, name] = /\-([^\.]+)/.exec(file)!
      return name
    })
}

const config: UserConfig = {
  define: {
    DOCUP_VERSION: JSON.stringify(pkg.version),
    PRISM_VERSION: JSON.stringify(require('prismjs/package').version),
    PRISM_LANGUAGES: JSON.stringify(getPrismLanguages()),
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'fre'`,
  },
  plugins: [
    prefresh(),
    windicss({
      scan: {
        fileExtensions: ['tsx'],
        dirs: [path.resolve('src')],
      },
    }),
  ],
}

export default config
