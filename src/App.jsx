import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { NotesProvider } from '@/providers/NotesProvider'
import { LockboxProvider } from '@/providers/LockboxProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { PromptProvider } from '@/providers/PromptProvider'
import { WorkspaceSync } from '@/providers/WorkspaceSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import { LockboxUnlockOverlay } from '@/blocks/LockboxUnlockOverlay'
import { Home } from '@/pages/Home'
import { NoteEdit } from '@/pages/NoteEdit'
import { Profile } from '@/pages/Profile'
import { DeckDemo } from '@/pages/DeckDemo'
import { Settings } from '@/pages/Settings'
import { LockboxSettings } from '@/pages/LockboxSettings'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

// Bump this whenever the cached shape changes so stale entries get busted
// on next popup open.
const APP_VERSION = '0.2.0'

function Router() {
  const { route } = useNavigation()
  if (route === 'note-edit') return <NoteEdit />
  if (route === 'profile') return <Profile />
  if (route === 'deck-demo') return <DeckDemo />
  if (route === 'settings') return <Settings />
  if (route === 'lockboxes') return <LockboxSettings />
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
              <NotesProvider>
                <LockboxProvider>
                  <WorkspaceSync />
                  <NavigationProvider>
                    <PromptProvider>
                      <AppShell>
                        <AuthGate>
                          <Router />
                        </AuthGate>
                        <LockboxUnlockOverlay />
                      </AppShell>
                    </PromptProvider>
                  </NavigationProvider>
                </LockboxProvider>
              </NotesProvider>
            </FabCornerProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
