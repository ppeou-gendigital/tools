import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ProfileProvider } from '@/providers/ProfileProvider'
import { JiraConfigProvider } from '@/providers/JiraConfigProvider'
import { JiraBridgeProvider } from '@/providers/JiraBridgeProvider'
import { AppShell } from '@/templates/AppShell'
import { ProfileGate } from '@/blocks/ProfileGate'
import { Profiles } from '@/pages/Profiles'
import { JiraWorkspace } from '@/pages/JiraWorkspace'
import { Settings } from '@/pages/Settings'
import { isJiraSlideRoute } from '@/lib/jira/slides'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

function Router() {
  const { route } = useNavigation()
  if (route === 'profiles') return <Profiles />
  if (isJiraSlideRoute(route)) return <JiraWorkspace />
  if (route === 'settings') return <Settings />
  return <Profiles />
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
            <ProfileProvider>
              <JiraConfigProvider>
                <JiraBridgeProvider>
                  <NavigationProvider>
                    <AppShell>
                      <ProfileGate>
                        <Router />
                      </ProfileGate>
                    </AppShell>
                  </NavigationProvider>
                </JiraBridgeProvider>
              </JiraConfigProvider>
            </ProfileProvider>
          </FabCornerProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  )
}
