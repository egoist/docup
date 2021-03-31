// ensure everything results in a single js file
import fs from 'fs'
import { build } from 'esbuild'
import { Plugin } from 'vite'

export const bundleDocsPlugin: Plugin = {
  name: 'bundle-docs',

  async writeBundle() {
    const file = fs
      .readdirSync('./docs/dist/assets')
      .filter((file) => file.endsWith('.js') && /^index\./.test(file))
    await build({
      entryPoints: [`./docs/dist/assets/${file}`],
      bundle: true,
      format: 'esm',
      outdir: './docs/dist',
      minify: true,
      platform: 'browser',
    })

    const html = fs
      .readFileSync('./docs/dist/index.html', 'utf8')
      .replace(
        /<script type=\"module\" crossorigin src="[^"]+"><\/script\>/,
        `<script type="module" crossorigin src="/${file}"></script>`
      )
      .replace(/<link rel="modulepreload" href="[^"]+">/, '')
    fs.writeFileSync('./docs/dist/index.html', html, 'utf8')
  },
}
