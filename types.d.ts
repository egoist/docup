declare namespace NodeJS {
  interface ProcessEnv {
    DOCUP_VERSION: string
    PRISM_VERSION: string
  }
}


declare module 'element-in-view' {
  const inView: (el: Element) => boolean
  export default inView
}
