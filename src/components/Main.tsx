import { h, FC } from 'renderer'
import { LoadingState } from './App'

export const Main: FC<{
  html: string
  loadingState: LoadingState
}> = ({ html, loadingState }) => {
  return (
    <div class="mt-12 main">
      <div class="max-w-2xl xl:max-w-4xl">
        {loadingState === 'loading' ? (
          <section class="">
            <div class="loader rounded h-4 w-32"></div>
            <div class="loader rounded h-4 w-64 mt-3"></div>
            <div class="loader rounded h-4 w-48 mt-3"></div>
          </section>
        ) : (
          <div
            className="content"
            ref={(dom) => {
              console.log(dom)
              dom && (dom.innerHTML = html)
            }}
          ></div>
        )}
      </div>
    </div>
  )
}
