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
    // Web PROD build is served from
    // https://ppeou-gendigital.github.io/tools/loopy/, so every asset URL
    // must be prefixed with the repo-and-tool subpath. Dev server
    // (`npm run dev`) keeps '/' so http://localhost:5173/ works as before,
    // and the extension build always resolves at the extension root.
    base: !isExtension && isBuild ? '/tools/loopy/' : '/',
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
          // Make `@use 'styles/mixins'` work anywhere in the tree.
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
          // /tools/loopy/ (matching `base` above). The workflow uploads
          // the parent `dist-web/` folder as the site.
          outDir: 'dist-web/loopy',
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
