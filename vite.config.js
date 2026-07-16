import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'
import manifest from './manifest.json' with { type: 'json' }

// Two build targets share this single Vite config:
//   npm run dev          -> web dev server (index.html)
//   npm run build        -> extension prod build (uses manifest.json via CRXJS)  [mode=extension]
//   npm run build:web    -> web prod build to dist-web/                          [mode=web]
export default defineConfig(({ command, mode }) => {
  const isExtension = mode === 'extension'
  const isBuild = command === 'build'
  const webBase = '/tools/accesso/'

  return {
    // Web PROD build is intended to be served from
    // https://<user>.github.io/tools/accesso/, so every asset URL must
    // be prefixed with the repo-and-tool subpath. Dev server (`npm run
    // dev`) keeps '/' so http://localhost:5173/ works, and the extension
    // build always resolves at the extension root.
    base: !isExtension && isBuild ? webBase : '/',
    // Serve committed icons/ as static assets for the web build (PWA
    // icons + apple-touch-icon). Extension build keeps icons via the
    // MV3 manifest paths instead.
    publicDir: isExtension ? false : resolve(__dirname, 'icons'),
    plugins: [
      react(),
      ...(isExtension
        ? [crx({ manifest })]
        : [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['icon-180.png', 'icon-192.png', 'icon-512.png'],
              manifest: {
                name: 'Accesso',
                short_name: 'Accesso',
                description: 'Accesso — credentials and cards vault',
                theme_color: '#0a0a0a',
                background_color: '#0a0a0a',
                display: 'standalone',
                start_url: './',
                scope: './',
                icons: [
                  {
                    src: 'icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                  },
                  {
                    src: 'icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                  },
                  {
                    src: 'icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
              workbox: {
                // Precache the app shell only. No runtimeCaching for
                // Supabase / API — vault data stays network-fetched.
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
                navigateFallback: 'index.html',
              },
              devOptions: {
                enabled: false,
              },
            }),
          ]),
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
          // /tools/accesso/ (matching `base` above). The workflow uploads
          // the parent `dist-web/` folder as the site.
          outDir: 'dist-web/accesso',
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
