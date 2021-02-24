declare namespace NodeJS {
  interface ProcessEnv {
    DOCUP_VERSION: string
    PRISM_VERSION: string
  }
}

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
