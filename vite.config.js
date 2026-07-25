import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import manifest from './manifest.json' with { type: 'json' }
import pkg from './package.json' with { type: 'json' }

// Two build targets share this single Vite config:
//   npm run dev          -> web dev server (index.html)
//   npm run build        -> extension prod build (uses manifest.json via CRXJS)  [mode=extension]
//   npm run build:web    -> web prod build to dist-web/                          [mode=web]

/** package.json version + short git SHA, e.g. 0.1.0+4ae2c00 */
function buildAppVersion() {
  let sha = 'local'
  try {
    sha = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    // Outside a git checkout (rare) — keep "+local".
  }
  return `${pkg.version}+${sha}`
}

export default defineConfig(({ command, mode }) => {
  const isExtension = mode === 'extension'
  const isBuild = command === 'build'
  const appVersion = buildAppVersion()
  // Firebase Hosting serves at the site root (https://project-loopy.web.app/).
  // Override with VITE_BASE only if you need a subpath deploy.
  const webBase = process.env.VITE_BASE || '/'

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
    // Web PROD defaults to `/` for Firebase. Dev and extension always `/`.
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
              // Registration lives in src/pwaRegister.js (visibility/focus
              // update checks for iOS home-screen). Don't double-inject.
              injectRegister: false,
              registerType: 'autoUpdate',
              includeAssets: [
                'icons/icon-180.png',
                'icons/icon-192.png',
                'icons/icon-512.png',
              ],
              manifest: {
                name: 'Loopy',
                short_name: 'Loopy',
                description: 'Loopy — React + Supabase web app',
                theme_color: '#0a0a0a',
                background_color: '#0a0a0a',
                display: 'standalone',
                start_url: './',
                scope: './',
                icons: [
                  {
                    src: 'icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                  },
                  {
                    src: 'icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                  },
                  {
                    src: 'icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
              workbox: {
                // Precache the app shell only. No runtimeCaching for
                // Supabase / API — cloud data stays network-fetched.
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
                navigateFallback: 'index.html',
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
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
    optimizeDeps: {
      exclude: ['@tools/ui', '@tools/behavioral', '@tools/service'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Package CSS + legacy `@use 'tokens/mixins'` in app modules.
          loadPaths: [
            resolve(__dirname, 'src'),
            resolve(__dirname, 'packages/ui/src/css'),
          ],
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
          // Nested under dist-web/<tool> so firebase.json public dir
          // stays dist-web/loopy (and legacy Pages dual-builds can still
          // assemble site/loopy/ if needed).
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
