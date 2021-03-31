import { h } from 'fre'

export const Navbar = ({ title, base, navLinks, toggleSidebar }) => {
  return (
    <header class="fixed w-full top-0 left-0 h-12 navbar flex items-center justify-between px-5">
      <div class="flex items-center">
        <h1 class="mr-8 text-2xl">
          <a href={base}>{title}</a>
        </h1>
        <ul class="hidden md:flex">
          {navLinks.map((link) => {
            return (
              <li key={link.text + link.link} class="mr-5 text-lg">
                <a class="navlink" href={link.link}>
                  {link.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <div class="flex md:hidden">
        <button onClick={toggleSidebar}>
          <svg fill="currentColor" class="w-6 h-6" viewBox="0 0 20 20">
            <path
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  )
}
