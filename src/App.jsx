import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { NotesProvider } from '@/providers/NotesProvider'
import { LockboxProvider } from '@/providers/LockboxProvider'
import { OfflineProvider, useOffline } from '@/providers/OfflineProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { PromptProvider } from '@/providers/PromptProvider'
import { WorkspaceSync } from '@/providers/WorkspaceSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import gateStyles from '@/blocks/AuthGate.module.scss'
import { LockboxUnlockOverlay } from '@/blocks/LockboxUnlockOverlay'
import { Home } from '@/pages/Home'
import { NoteEdit } from '@/pages/NoteEdit'
import { Profile } from '@/pages/Profile'
import { DeckDemo } from '@/pages/DeckDemo'
import { Settings } from '@/pages/Settings'
import { LockboxSettings } from '@/pages/LockboxSettings'
import { OfflineEmpty } from '@/pages/offline/OfflineEmpty'
import { OfflineRouter } from '@/pages/offline/OfflineRouter'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

function OnlineRouter() {
  const { route } = useNavigation()
  if (route === 'note-edit') return <NoteEdit />
  if (route === 'profile') return <Profile />
  if (route === 'deck-demo') return <DeckDemo />
  if (route === 'settings') return <Settings />
  if (route === 'lockboxes') return <LockboxSettings />
  return <Home />
}

function ModeSwitch() {
  const { ready, isOfflineMode, isOfflineEmpty } = useOffline()

  if (!ready) {
    return (
      <div className={gateStyles.loading}>
        <Loader2 size={16} className={gateStyles.spinner} aria-hidden="true" />
        <span>Loading</span>
      </div>
    )
  }

  if (isOfflineEmpty) return <OfflineEmpty />
  if (isOfflineMode) {
    return (
      <>
        <OfflineRouter />
        <LockboxUnlockOverlay />
      </>
    )
  }

  return (
    <>
      <AuthGate>
        <OnlineRouter />
      </AuthGate>
      <LockboxUnlockOverlay />
    </>
  )
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
      <OfflineProvider>
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
                          <ModeSwitch />
                        </AppShell>
                      </PromptProvider>
                    </NavigationProvider>
                  </LockboxProvider>
                </NotesProvider>
              </FabCornerProvider>
            </FontSizeProvider>
          </ThemeProvider>
        </AuthProvider>
      </OfflineProvider>
    </PersistQueryClientProvider>
  )
}
