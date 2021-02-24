import _debug from 'debug'
import {
  resolveOptions,
  UserOptions,
  WindiPluginUtils,
  createUtils,
} from '@windicss/plugin-utils'
import CleanCSS from 'clean-css'

const NAME = 'rollup-plugin-windicss'
const MODULE_ID = 'windi.css'
const MODULE_ID_VIRTUAL = `/@windicss/${MODULE_ID}`

const debug = {
  hmr: _debug(`${NAME}:hmr`),
  css: _debug(`${NAME}:transform:css`),
  group: _debug(`${NAME}:transform:group`),
}

/**
 * Store transformed CSS
 * @param {string} css
 * @param {string[]} chunks
 * @returns {string}
 */
const handleResult = (css, chunks) => {
  chunks.push(css)
  return ``
}

/**
 *
 * @param {UserOptions & { minify?: boolean }} userOptions
 * @returns {import('rollup').Plugin}
 */
function WindiCssRollupPlugin(userOptions = {}) {
  /** @type {WindiPluginUtils} */
  let utils

  const options = resolveOptions(userOptions)
  let chunks = []

  const cleanCSS = new CleanCSS()

  return {
    name: NAME,

    options(inputOptions) {
      utils = createUtils(options, {
        name: NAME,
        root: inputOptions.context || process.cwd(),
      })
      utils.init()
      return inputOptions
    },

    buildStart() {
      chunks = []
    },

    resolveId(id) {
      return id.startsWith(MODULE_ID) || id === MODULE_ID_VIRTUAL
        ? MODULE_ID_VIRTUAL
        : null
    },

    async load(id) {
      if (id === MODULE_ID_VIRTUAL) return ``
    },

    async transform(code, id) {
      if (id === MODULE_ID_VIRTUAL) {
        return handleResult(await utils.generateCSS(), chunks)
      }

      if (options.transformGroups && utils.isDetectTarget(id)) {
        debug.group(id)
        return handleResult(utils.transfromGroups(code), chunks)
      }

      if (options.transformCSS && utils.isCssTransformTarget(id)) {
        console.log(id)
        debug.css(id)
        return handleResult(utils.transformCSS(code), chunks)
      }
    },

    generateBundle() {
      let code = chunks.join('\n')
      if (userOptions.minify) {
        code = cleanCSS.minify(code).styles
      }
      this.emitFile({
        type: 'asset',
        fileName: userOptions.minify ? 'docup.min.css' : 'docup.css',
        source: code,
      })
    },
  }
}

export * from '@windicss/plugin-utils'
export default WindiCssRollupPlugin
