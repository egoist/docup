import { h, FunctionComponent } from 'preact'

export const Main: FunctionComponent<{ html: string }> = ({ html }) => {
  return (
    <div class="mt-12 main">
      <div
        class="max-w-2xl content"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  )
}
