import { defineConfig } from 'vite'
import prefresh from '@prefresh/vite'
import { createConfig } from '../scripts/utils'

export default defineConfig({
  ...createConfig('preact', false),
  // @ts-expect-error
  plugins: [prefresh()],
})
