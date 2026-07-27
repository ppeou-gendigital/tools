import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import manifest from './manifest.json' with { type: 'json' }
import pkg from './package.json' with { type: 'json' }

// Build targets share this single Vite config:
//   npm run dev             -> web dev server (index.html)
//   npm run build           -> extension prod build (CRXJS)              [mode=extension]
//   npm run build:web       -> GitHub Pages build (base /tools/accesso/) [mode=web]
//   npm run build:firebase  -> Firebase Hosting at site root (base /)    [mode=web --base /]

/** package.json version + short git SHA, e.g. 0.1.0+1db81d8 */
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
  const webBase = '/tools/accesso/'
  const appVersion = buildAppVersion()

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
    // Default web PROD base is GitHub Pages:
    // https://<user>.github.io/tools/accesso/
    // Override with `vite build --base /` for Firebase root hosting
    // (`npm run build:firebase`). Dev + extension always use '/'.
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
              // Registration lives in src/pwaRegister.js (visibility/focus
              // update checks for iOS home-screen). Don't double-inject.
              injectRegister: false,
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
