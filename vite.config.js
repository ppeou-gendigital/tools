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
//
// Branch naming → Pages URL (after `npm run init -- --name foo`):
//   branch tool/foo  →  base /tools/foo/  →  https://<user>.github.io/tools/foo/
export default defineConfig(({ command, mode }) => {
  const isExtension = mode === 'extension'
  const isBuild = command === 'build'
  const webBase = '/tools/notas/'

  return {
    // Web PROD build is intended to be served from
    // https://<user>.github.io/tools/notas/, so every asset URL must
    // be prefixed with the repo-and-tool subpath. Dev server (`npm run
    // dev`) keeps '/' so http://localhost:5173/ works, and the extension
    // build always resolves at the extension root.
    base: !isExtension && isBuild ? webBase : '/',
    // Web build serves public/ (PWA + apple-touch icons under public/icons/).
    // Extension build keeps icons via the MV3 manifest paths in icons/.
    publicDir: isExtension ? false : resolve(__dirname, 'public'),
    plugins: [
      react(),
      ...(isExtension
        ? [crx({ manifest })]
        : [
            VitePWA({
              // Registration lives in src/pwaRegister.js (visibility/focus/
              // pageshow/online update checks for iOS home-screen).
              // Don't double-inject a second register call.
              injectRegister: false,
              registerType: 'autoUpdate',
              filename: 'sw.js',
              manifestFilename: 'manifest.webmanifest',
              includeAssets: [
                'icons/icon-180.png',
                'icons/icon-192.png',
                'icons/icon-512.png',
              ],
              manifest: {
                id: '/tools/notas/',
                name: 'Notas',
                short_name: 'Notas',
                description: 'Notas — notebooks, tags, and locked notes',
                theme_color: '#0a0a0a',
                background_color: '#0a0a0a',
                display: 'standalone',
                display_override: ['standalone', 'browser'],
                orientation: 'any',
                lang: 'en',
                start_url: './',
                scope: './',
                icons: [
                  {
                    src: 'icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: 'icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: 'icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
                categories: ['productivity', 'utilities'],
              },
              workbox: {
                // Precache the app shell only. No runtimeCaching for
                // Supabase / API — cloud data stays network-fetched.
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
                navigateFallback: 'index.html',
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
                // Prefer network for navigations when online so deploys
                // surface faster; precache still covers offline shell.
                navigationPreload: false,
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
          // /tools/notas/ (matching `base` above). The workflow uploads
          // the parent `dist-web/` folder as the site.
          outDir: 'dist-web/notas',
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
