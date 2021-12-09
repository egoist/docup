import { build } from 'vite'
import { buildTypes, createConfig } from './utils'

async function main() {
  for (const config of [
    createConfig('preact', true),
    createConfig('preact'),
    createConfig('fre', true),
    createConfig('fre'),
  ]) {
    await build(config)
  }
  await buildTypes()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
