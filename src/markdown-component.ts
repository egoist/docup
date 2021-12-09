export const MD_PROPS_KEY = `MD_C_PROPS`

// prevent vite from shimming import.meta.url
let docupUrl = import.meta.url
if (import.meta.env.DEV) {
  // During dev it's not bundled
  // So we resolve to docup.ts instead
  docupUrl = docupUrl.replace('markdown-component.ts', 'docup.ts')
}

export { docupUrl }

export const setMdProps = (props: any) => {
  window[MD_PROPS_KEY] = props
}

export const getSkypackUrl = (name: string) =>
  `https://cdn.skypack.dev/${name}?min`

const IMPORT_RE = /(^|\s|;)import(?:['"\s]*([\w*${}\s,]+)from\s*)?['"\s]['"\s](.*[@\w_-]+)['"\s].*/g

const getNewUrl = (url: string) => {
  if (url === 'preact' || url === 'fre' || url === 'docup') {
    return docupUrl
  }
  if (/^([\.\/]|https?:\/\/)/.test(url)) return url

  return getSkypackUrl(url)
}

export const rewriteImports = (code: string) => {
  return code.replace(IMPORT_RE, (m, prefix, specs, name) => {
    return prefix + `import ` + specs + ` from '${getNewUrl(name)}'`
  })
}

export const initMarkdownComponentsProxy = () => {
  window._MD_COMPONENTS = new Proxy<Record<string, any>>(
    {},
    {
      set: function (target, prop: string, value) {
        const [info, index] = prop.split('_')
        const appScript = document.createElement('script')
        appScript.type = 'module'
        const importRenderFunction =
          info === 'react'
            ? `import {createElement as h} from "${getSkypackUrl('react')}";
              import {render} from "${getSkypackUrl('react-dom')}"`
            : info === 'vue'
            ? `import {createApp,h} from '${getSkypackUrl(
                'vue@next'
              )}';var render=(app,el)=>createApp(app).mount(el)`
            : `import {render,h} from "${docupUrl}"`
        appScript.textContent = `
      ${importRenderFunction}
      render(h(_MD_COMPONENTS.${prop},${MD_PROPS_KEY}), document.getElementById(\`md_components_${index}\`))`

        document.body.append(appScript)

        return Reflect.set(target, prop, value)
      },
    }
  )
}
