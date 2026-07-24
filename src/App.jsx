import { useEffect } from 'react'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from '@/providers/AuthProvider'
import { DisplayPrefsProvider, useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { OfflineProvider, useOffline } from '@/providers/OfflineProvider'
import { PlaylistPlaybackProvider } from '@/providers/PlaylistPlaybackProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import gateStyles from '@/blocks/AuthGate.module.scss'
import { AcceptInvite } from '@/pages/AcceptInvite'
import { Archives } from '@/pages/Archives'
import { EntryEdit } from '@/pages/EntryEdit'
import { ExpenseEdit } from '@/pages/ExpenseEdit'
import { Home } from '@/pages/Home'
import { Journey } from '@/pages/Journey'
import { JourneyCreate } from '@/pages/JourneyCreate'
import { JourneySettings } from '@/pages/JourneySettings'
import { Members } from '@/pages/Members'
import { OnboardingPrefs } from '@/pages/OnboardingPrefs'
import { People } from '@/pages/People'
import { Map } from '@/pages/Map'
import { Playlist } from '@/pages/Playlist'
import { Todos } from '@/pages/Todos'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'
import { Spending } from '@/pages/Spending'
import { OfflineEmpty } from '@/pages/offline/OfflineEmpty'
import { OfflineRouter } from '@/pages/offline/OfflineRouter'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

function OnboardingGate({ children }) {
  const { prefsConfirmed, ready } = useDisplayPrefs()
  const { route, replace } = useNavigation()

  useEffect(() => {
    if (!ready) return
    if (prefsConfirmed) return
    if (route === 'onboarding-prefs' || route === 'accept-invite') return
    replace('onboarding-prefs')
  }, [ready, prefsConfirmed, route, replace])

  if (!ready) return null
  return children
}

function OnlineRouter() {
  const { route } = useNavigation()
  if (route === 'onboarding-prefs') return <OnboardingPrefs />
  if (route === 'journey-create') return <JourneyCreate />
  if (route === 'journey') return <Journey />
  if (route === 'entry-edit') return <EntryEdit />
  if (route === 'expense-edit') return <ExpenseEdit />
  if (route === 'members') return <Members />
  if (route === 'accept-invite') return <AcceptInvite />
  if (route === 'spending') return <Spending />
  if (route === 'playlist') return <Playlist />
  if (route === 'todos') return <Todos />
  if (route === 'map') return <Map />
  if (route === 'journey-settings') return <JourneySettings />
  if (route === 'profile') return <Profile />
  if (route === 'settings') return <Settings />
  if (route === 'people') return <People />
  if (route === 'archives') return <Archives />
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
  if (isOfflineMode) return <OfflineRouter />

  return (
    <AuthGate>
      <OnboardingGate>
        <OnlineRouter />
      </OnboardingGate>
    </AuthGate>
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
        <AuthProvider>
          <ThemeProvider>
            <FontSizeProvider>
              <FabCornerProvider>
                <DisplayPrefsProvider>
                  <PrefsSync />
                  <NavigationProvider>
                    <PlaylistPlaybackProvider>
                      <AppShell>
                        <ModeSwitch />
                      </AppShell>
                    </PlaylistPlaybackProvider>
                  </NavigationProvider>
                </DisplayPrefsProvider>
              </FabCornerProvider>
            </FontSizeProvider>
          </ThemeProvider>
        </AuthProvider>
      </OfflineProvider>
    </PersistQueryClientProvider>
  )
}
