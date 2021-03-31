import path from 'path'
import dtsPlugin from 'rollup-plugin-dts'
import esbuildPlugin from 'rollup-plugin-esbuild'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import aliasPlugin from '@rollup/plugin-alias'
import windicss from './rollup-plugin-windicss'
import pkg from './package.json'

const createConfig = ({ minify, format, dts, renderer } = {}) => {
  renderer = renderer || 'preact'
  const isFre = renderer === 'fre'
  let filename = `[name]${format === 'esm' ? '.esm' : ''}${
    minify ? '.min' : ''
  }.js`
  if (isFre) {
    filename = filename.replace('[name]', '[name].fre')
  }
  return {
    input: 'src/docup.ts',
    output: {
      format,
      name: 'docup',
      dir: 'dist',
      entryFileNames: dts ? '[name].d.ts' : filename,
    },
    plugins: [
      commonjsPlugin({}),
      nodeResolvePlugin({
        extensions: dts
          ? ['.d.ts', '.ts']
          : ['.js', '.ts', '.json', '.tsx', '.mjs'],
      }),
      aliasPlugin({
        entries: {
          renderer: path.resolve('src/renderer/' + renderer + '.ts'),
        },
      }),
      windicss({
        minify,
        scan: {
          dirs: [path.resolve('src')],
          fileExtensions: ['tsx'],
        },
        transformCSS: true,
        transformGroups: false,
      }),
      !dts &&
        esbuildPlugin({
          minify,
          jsxFactory: 'h',
          jsxFragment: 'Fragment',
          define: {
            DOCUP_VERSION: JSON.stringify(pkg.version),
            PRISM_VERSION: JSON.stringify(pkg.dependencies.prismjs),
          },
          target: ['es2020', 'edge88', 'safari14', 'chrome88'],
        }),
      dts && dtsPlugin(),
    ].filter(Boolean),
  }
}

export default [
  // Generate types
  createConfig({ dts: true }),
  // UMD format
  createConfig({ format: 'umd' }),
  createConfig({ format: 'umd', renderer: 'fre' }),
  // Minified UMD format
  createConfig({ format: 'umd', minify: true }),
  createConfig({ format: 'umd', minify: true, renderer: 'fre' }),
  // ESM format
  createConfig({ format: 'esm' }),
]
