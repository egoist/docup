import { h, useEffect, useRef } from 'fre'

export const Main = ({ html, loadingState }) => {
  const t = useRef(null)
  useEffect(()=>{
    if (loadingState === 'loading') {
      t.current.innerHTML = `<div class="">
    <div class="loader rounded h-4 w-32"></div>
    <div class="loader rounded h-4 w-64 mt-3"></div>
    <div class="loader rounded h-4 w-48 mt-3"></div>
  </div>`
    } else {
      t.current.innerHTML = `<div
    className="content"
  >${html}</div>`
    }
  },[loadingState])
  return (
    <div class="mt-12 main">
      <div
        class="max-w-2xl xl:max-w-4xl"
        ref={t}
      ></div>
    </div>
  )
}
