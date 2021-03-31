export * from 'fre'

export function setHtml(html: string) {
  return { ref: (dom: any) => (dom.innerHTML = html) }
}
