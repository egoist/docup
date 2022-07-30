import { h, FC, useEffect, useState, useRef, setHtml } from 'renderer'
import { SidebarMenuItem } from '../markdown'
import { NavLink } from '../docup'

export const Sidebar: FC<{
  menu: SidebarMenuItem[]
  title: string
  base: string
  showSidebar: boolean
  navLinks: NavLink[]
  beforeSidebar?: string
}> = ({ menu, title, base, showSidebar, navLinks, beforeSidebar }) => {
  const [hash, setHash] = useState('')
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  let sidebarItemClicked = false

  const handleSidebarItemClick = () => {
    sidebarItemClicked = true
  }

  useEffect(() => {
    setHash(decodeURIComponent(location.hash))
    const onHashChange = () => {
      const decodedHash = decodeURIComponent(location.hash)
      setHash(decodedHash)

      // Don't change scroll position when the hashchange is triggered click, that's bad user experience
      if (location.hash && !sidebarItemClicked) {
        const el: HTMLAnchorElement | null = document.querySelector(
          `.sidebar .menu_item[href="${decodedHash}"]`
        )
        if (el) {
          if (sidebarRef.current) {
            sidebarRef.current.scrollTop = el.offsetTop - 100
          }
        }
      }
      sidebarItemClicked = false
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div
      ref={sidebarRef}
      class={
        `fixed md:pt-12 sidebar left-0 top-0 bottom-0 border-r` +
        (showSidebar ? ' sidebar_show' : '')
      }
    >
      <div class="md:hidden sidebar_navbar pb-3">
        <h1 class="text-2xl px-5 flex h-12 items-center">
          <a class="w-full" href={base}>
            {title}
          </a>
        </h1>
        <div>
          <ul>
            {navLinks.map((link, index) => {
              return (
                <li key={index}>
                  <a class="navlink" href={link.link}>
                    {link.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {beforeSidebar && (
        <div>
          <div {...setHtml(beforeSidebar)}></div>
        </div>
      )}
      <div class="my-5">
        {menu.map((item, index) => {
          return (
            <a
              class={
                `block px-5 py-1 menu_item` +
                (item.slug === hash.slice(1) ? ' menu_item__active' : '')
              }
              onClick={handleSidebarItemClick}
              data-slug={item.slug}
              key={index}
              data-depth={item.depth}
              href={`#${item.slug}`}
              {...setHtml(item.text)}
            ></a>
          )
        })}
      </div>
    </div>
  )
}
