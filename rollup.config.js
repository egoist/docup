// @ts-check
import path from 'path'
import dtsPlugin from 'rollup-plugin-dts'
import esbuildPlugin from 'rollup-plugin-esbuild'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import aliasPlugin from '@rollup/plugin-alias'
import windicss from './rollup-plugin-windicss'
import pkg from './package.json'

/**
 * @param {{ minify?: boolean, dts?: boolean, renderer?: 'preact' | 'fre' }} options
 * @returns {import('rollup').RollupOptions}
 */
const createConfig = ({ minify, dts, renderer } = {}) => {
  renderer = renderer || 'preact'
  const isFre = renderer === 'fre'
  let filename = `[name]${minify ? '.min' : ''}.js`
  if (isFre) {
    filename = filename.replace('[name]', '[name].fre')
  }
  return {
    input: 'src/docup.ts',
    output: {
      format: 'esm',
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
  // ESM format
  createConfig({}),
  createConfig({ renderer: 'fre' }),
  // ESM UMD format
  createConfig({ minify: true }),
  createConfig({ minify: true, renderer: 'fre' }),
]
