export function slugify(input: string) {
  return (
    input // Remove html tags
      .replace(/<(?:.|\n)*?>/gm, '') // Remove special characters
      .replace(/[!\"#$%&'\(\)\*\+,\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') // eslint-disable-line no-useless-escape
      // Replace dots and spaces with a short dash
      .replace(/(\s|\.)/g, '-') // Replace long dash with two short dashes
      .replace(/—/g, '--') // Make the whole thing lowercase
      .toLowerCase()
  )
}

export function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

export const ANCHOR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
`

export const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="64 64 896 896" width="14" height="14"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" /></svg>
`

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash) as HTMLDivElement
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 60,
    })
  }
}

export function updateURLHash(hash: string, replace: boolean) {
  if (replace) {
    history.replaceState({}, '', hash)
  } else {
    history.pushState({}, '', hash)
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

const scriptCaches: string[] = []

export function loadScript(url: string) {
  if (scriptCaches.indexOf(url) !== -1) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export async function loadLanguages(langs: string[]) {
  await Promise.all(
    langs.map((lang) =>
      loadScript(
        `https://cdn.jsdelivr.net/npm/prismjs@${process.env.PRISM_VERSION}/components/prism-${lang}.min.js`
      )
    )
  )
}

/**
 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * Taken from https://github.com/component/throttle/blob/master/index.js MIT licensed
 *
 * @param func Function to wrap.
 * @param wait Number of milliseconds that must elapse between `func` invocations.
 * @return A new function that wraps the `func` function passed in.
 */

export function throttle<T extends Function>(func: T, wait: number) {
  // caching
  let ctx: any | undefined,
    args: IArguments | undefined,
    rtn: Function | undefined,
    timeoutID: number | undefined
  let last = 0

  return function (this: any) {
    ctx = this
    args = arguments
    var delta = Date.now() - last
    if (!timeoutID)
      if (delta >= wait) call()
      else timeoutID = self.setTimeout(call, wait - delta)
    return rtn
  }

  function call() {
    timeoutID = 0
    last = +new Date()
    rtn = func.apply(ctx, args)
    ctx = undefined
    args = undefined
  }
}

const TRAILING_SLASH_RE = /\/$/
const MD_RE = /\.md$/

export function getFileUrl(root: string, indexFile: string, pathname: string) {
  let url = root
  // Remove trailing slash
  // Becuase pathname always starts with slash
  .replace(TRAILING_SLASH_RE, '')
  // `pathname` ends with slash
  // this is a directory
  // use `indexFile`
  if (TRAILING_SLASH_RE.test(pathname)) {
    url += `${pathname}${indexFile}`
  } else if (!MD_RE.test(pathname)) {
    url += `${pathname}.md`
  }
  return url
}
