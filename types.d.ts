declare const DOCUP_VERSION: string
declare const PRISM_VERSION: string
declare const PRISM_LANGUAGES: string

declare module 'element-in-view' {
  type Options = {
    offset?: number
  }
  const inView: (el: Element, options?: Options) => boolean
  export default inView
}

declare interface ImportMeta {
  env: {
    DEV: boolean
  }
}

interface Window {
  MD_C_PROPS: any
  _MD_COMPONENTS: Record<string, any>
}
