export { h, render } from 'preact'

export type { FunctionComponent as FC } from 'preact'

export * from 'preact/hooks'

export function setHtml(html: string) {
  return { dangerouslySetInnerHTML: { __html: html } }
}
