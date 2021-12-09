import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import tsResolve from '@egoist/rollup-plugin-ts-resolve'
import { UserConfig } from 'vite'
import MagicString from 'magic-string'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

function getPrismLanguages() {
  const files = fs.readdirSync('node_modules/prismjs/components')
  return files
    .filter((file) => file.endsWith('.min.js'))
    .map((file) => {
      const [, name] = /\-([^\.]+)/.exec(file)!
      return name
    })
}

export const createConfig = (
  renderer: 'preact' | 'fre',
  minify?: boolean,
  isWebsite?: boolean
): UserConfig => {
  return {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      legalComments: 'none',
    },
    define: {
      DOCUP_VERSION: JSON.stringify(pkg.version),
      PRISM_VERSION: JSON.stringify(require('prismjs/package').version),
      PRISM_LANGUAGES: JSON.stringify(getPrismLanguages()),
    },
    // plugins: [
    //   {
    //     name: 'import_meta_url',
    //     enforce: 'post',
    //     renderChunk(code) {
    //       const index = code.indexOf('import_meta_url')

    //       if (index === -1) return
    //       const s = new MagicString(code)
    //       s.overwrite(
    //         index,
    //         index + 'import_meta_url'.length,
    //         'import.meta.url'
    //       )
    //       return {
    //         code: s.toString(),
    //         map: s.generateMap({ hires: true }),
    //       }
    //     },
    //   },
    // ],
    build: {
      emptyOutDir: false,
      minify,
      sourcemap: true,
      target: 'esnext',
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        input: isWebsite
          ? [path.resolve('./docs/index.html'), path.resolve('./docs/main.ts')]
          : ['./src/docup.ts'],
        output: {
          format: 'esm',
          manualChunks: undefined,

          ...(isWebsite
            ? {}
            : {
                entryFileNames() {
                  return (renderer === 'fre'
                    ? 'docup.fre.js'
                    : 'docup.js'
                  ).replace(/\.js$/, () => (minify ? '.min.js' : '.js'))
                },
                assetFileNames(chunk) {
                  if (chunk.name === 'docup.css') {
                    return `docup${minify ? '.min' : ''}.css`
                  }
                  return chunk.name!
                },
              }),
        },
      },
    },
    resolve: {
      alias: {
        renderer: path.resolve('src/renderer/' + renderer + '.ts'),
      },
    },
  }
}

export async function buildTypes() {
  const deps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]
  const bundle = await rollup({
    input: ['./src/docup.ts'],
    plugins: [
      {
        name: 'ignore',
        resolveId(id) {
          if (id === 'renderer') return false
          if (deps.some((dep) => id === dep || id.startsWith(dep + '/')))
            return false
        },
        load(id) {
          if (/\.css$/.test(id)) return ''
        },
      },
      // @ts-expect-error
      tsResolve(),
      dts(),
    ],
  })
  await bundle.write({
    format: 'esm',
    dir: './dist',
  })
}
