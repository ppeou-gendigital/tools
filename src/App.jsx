import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AemDomainsProvider } from '@/providers/AemDomainsProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { DeckTest } from '@/pages/DeckTest'
import { AemJump } from '@/pages/AemJump'
import { Settings } from '@/pages/Settings'
import { AemEnvironments } from '@/pages/AemEnvironments'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

// Bump this whenever the cached shape changes so stale entries get busted
// on next popup open. Reads naturally from package.json in the future if
// we start importing it.
const APP_VERSION = '0.1.0'

function Router() {
  const { route } = useNavigation()
  if (route === 'profile') return <Profile />
  if (route === 'deck-test') return <DeckTest />
  if (route === 'aem-jump') return <AemJump />
  if (route === 'settings') return <Settings />
  if (route === 'settings-aem-environments') return <AemEnvironments />
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
      <ThemeProvider>
        <FontSizeProvider>
          <FabCornerProvider>
            <AemDomainsProvider>
              <AuthProvider>
                <PrefsSync />
                <NavigationProvider>
                  <AppShell>
                    <AuthGate>
                      <Router />
                    </AuthGate>
                  </AppShell>
                </NavigationProvider>
              </AuthProvider>
            </AemDomainsProvider>
          </FabCornerProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  )
}
