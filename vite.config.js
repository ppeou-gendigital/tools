import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'node:path'
import manifest from './manifest.json' with { type: 'json' }

// Two build targets share this single Vite config:
//   npm run dev          -> web dev server (index.html)
//   npm run build        -> extension prod build (uses manifest.json via CRXJS)  [mode=extension]
//   npm run build:web    -> web prod build to dist-web/                          [mode=web]
export default defineConfig(({ command, mode }) => {
  const isExtension = mode === 'extension'
  const isBuild = command === 'build'

  return {
    // Web PROD build is intended to be served from
    // https://<user>.github.io/tools/acceso/, so every asset URL must
    // be prefixed with the repo-and-tool subpath. Dev server (`npm run
    // dev`) keeps '/' so http://localhost:5173/ works, and the extension
    // build always resolves at the extension root.
    base: !isExtension && isBuild ? '/tools/acceso/' : '/',
    plugins: [
      react(),
      ...(isExtension ? [crx({ manifest })] : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Make `@use 'tokens/mixins'` work anywhere in the tree.
          loadPaths: [resolve(__dirname, 'src')],
        },
      },
    },
    build: isExtension
      ? {
          outDir: 'dist',
          emptyOutDir: true,
          rollupOptions: {
            input: {
              popup: resolve(__dirname, 'popup.html'),
            },
          },
        }
      : {
          // Nested so the uploaded Pages artifact serves at
          // /tools/acceso/ (matching `base` above). The workflow uploads
          // the parent `dist-web/` folder as the site.
          outDir: 'dist-web/acceso',
          emptyOutDir: true,
          rollupOptions: {
            input: {
              index: resolve(__dirname, 'index.html'),
            },
          },
        },
    server: {
      port: 5173,
      strictPort: false,
    },
  }
})
