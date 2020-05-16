import dtsPlugin from 'rollup-plugin-dts'
import postcssPlugin from 'rollup-plugin-postcss'
import esbuildPlugin from 'rollup-plugin-esbuild'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import pkg from './package.json'

const createConfig = ({ minify, format, dts } = {}) => {
  const filename = `[name]${format === 'esm' ? '.esm' : ''}${
    minify ? '.min' : ''
  }.js`
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
      postcssPlugin({
        extensions: ['.css'],
        extract: true,
        minimize: minify,
      }),
      !dts &&
        esbuildPlugin({
          minify,
          jsxFactory: 'h',
          define: {
            'process.env.DOCUP_VERSION': JSON.stringify(pkg.version),
            'process.env.PRISM_VERSION': JSON.stringify(
              pkg.dependencies.prismjs
            ),
          },
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
  // Minified UMD format
  createConfig({ format: 'umd', minify: true }),
  // ESM format
  createConfig({ format: 'esm' }),
]
