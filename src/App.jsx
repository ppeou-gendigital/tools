import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AemDomainsProvider } from '@/providers/AemDomainsProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { FavoritesProvider } from '@/providers/FavoritesProvider'
import { FavoritesOrderProvider } from '@/providers/FavoritesOrderProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { PinnedSitesProvider } from '@/providers/PinnedSitesProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { TrackedHostnamesProvider } from '@/providers/TrackedHostnamesProvider'
import { VisitedUrlsProvider } from '@/providers/VisitedUrlsProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { Landing } from '@/pages/Landing'
import { DeckTest } from '@/pages/DeckTest'
import { AemJump } from '@/pages/AemJump'
import { FavLinks } from '@/pages/FavLinks'
import { Settings } from '@/pages/Settings'
import { AemEnvironments } from '@/pages/AemEnvironments'
import { SiteTree } from '@/pages/SiteTree'
import { TrackedHosts } from '@/pages/TrackedHosts'
import { VisitedUrls } from '@/pages/VisitedUrls'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

// Bump this whenever the cached shape changes so stale entries get busted
// on next popup open. Reads naturally from package.json in the future if
// we start importing it.
const APP_VERSION = '0.1.0'

function Router() {
  const { route } = useNavigation()
  if (route === 'profile') return <Profile />
  if (route === 'landing') return <Landing />
  if (route === 'deck-test') return <DeckTest />
  if (route === 'aem-jump') return <AemJump />
  if (route === 'visited-urls') return <VisitedUrls />
  if (route === 'site-tree') return <SiteTree />
  if (route === 'fav-links') return <FavLinks />
  if (route === 'settings') return <Settings />
  if (route === 'settings-aem-environments') return <AemEnvironments />
  if (route === 'settings-tracked-hosts') return <TrackedHosts />
  return <Home />
}

export function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 24 * 60 * 60 * 1000,
        buster: APP_VERSION,
      }}
    >
      {/* AuthProvider is hoisted above FavoritesProvider so the favorites
          provider can consume useAuth() directly — every favorite
          mutation runs a per-op read-modify-CAS against Supabase and
          therefore needs to know the current userId. AuthProvider has
          no dependency on any of the local-storage providers below it,
          so this hoist is safe. */}
      <AuthProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <FabCornerProvider>
              <AemDomainsProvider>
                <TrackedHostnamesProvider>
                  <PinnedSitesProvider>
                    <VisitedUrlsProvider>
                      <FavoritesProvider>
                        <FavoritesOrderProvider>
                          <PrefsSync />
                          <NavigationProvider>
                            <AppShell>
                              <AuthGate>
                                <Router />
                              </AuthGate>
                            </AppShell>
                          </NavigationProvider>
                        </FavoritesOrderProvider>
                      </FavoritesProvider>
                    </VisitedUrlsProvider>
                  </PinnedSitesProvider>
                </TrackedHostnamesProvider>
              </AemDomainsProvider>
            </FabCornerProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
