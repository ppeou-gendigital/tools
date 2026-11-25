import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
)

const manifest = JSON.parse(
  readFileSync(new URL('./manifest.json', import.meta.url), 'utf8'),
)

// package.json is the single source of truth for the release version.
manifest.version = pkg.version

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
