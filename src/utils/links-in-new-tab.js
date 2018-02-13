const RE = /https?:\/\//

export default function linksInNewTab(href) {
  return RE.test(href)
}
