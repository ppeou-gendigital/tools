import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
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
import { DeckDemo } from '@/pages/DeckDemo'
import { RichTextDemo } from '@/pages/RichTextDemo'
import { Settings } from '@/pages/Settings'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

function Router() {
  const { route } = useNavigation()
  if (route === 'profile') return <Profile />
  if (route === 'deck-demo') return <DeckDemo />
  if (route === 'rich-text-demo') return <RichTextDemo />
  if (route === 'settings') return <Settings />
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
      {/* AuthProvider is hoisted so prefs providers can call useAuth() and
          push each mutation through supabaseSync with the current userId. */}
      <AuthProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <FabCornerProvider>
              <PrefsSync />
              <NavigationProvider>
                <AppShell>
                  <AuthGate>
                    <Router />
                  </AuthGate>
                </AppShell>
              </NavigationProvider>
            </FabCornerProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
