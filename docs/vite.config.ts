import { defineConfig } from 'vite'
import prefresh from '@prefresh/vite'
import { createConfig } from '../scripts/utils'

const config = createConfig('preact', false, true)
export default defineConfig({
  ...config,
  plugins: [...(config.plugins || []), prefresh()],
})
