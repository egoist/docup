import { h, FC } from 'renderer'
import { LoadingState } from './App'

export const Main: FC<{
  html: string
  loadingState: LoadingState
}> = ({ html, loadingState }) => {
  return (
    <div class="mt-12 main">
      <div class="max-w-2xl xl:max-w-4xl">
        {loadingState === 'loading' && (
          <div class="">
            <div class="loader rounded h-4 w-32"></div>
            <div class="loader rounded h-4 w-64 mt-3"></div>
            <div class="loader rounded h-4 w-48 mt-3"></div>
          </div>
        )}
        {loadingState !== 'loading' && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        )}
      </div>
    </div>
  )
}
