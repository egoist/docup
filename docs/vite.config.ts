import { defineConfig } from 'vite'
import prefresh from '@prefresh/vite'
import { createConfig } from '../scripts/utils'

export default defineConfig((ctx) => {
  const config = createConfig(
    'preact',
    ctx.mode === 'production' && !process.env.DEBUG,
    true
  )
  return {
    ...config,
    plugins: [...(config.plugins || []), prefresh()],
  }
})
