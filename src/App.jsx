import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AiCareProvider } from '@/providers/AiCareProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { PatientVaultProvider } from '@/providers/PatientVaultProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import { PatientVaultGate } from '@/blocks/PatientVaultGate'
import { BiometricEnrollPrompt } from '@/blocks/BiometricEnrollPrompt'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'
import { VaultSecurity } from '@/pages/VaultSecurity'
import { DatafeedSettings } from '@/pages/DatafeedSettings'
import { Visits } from '@/pages/Visits'
import { Appointments } from '@/pages/Appointments'
import { Doctors } from '@/pages/Doctors'
import { Medications } from '@/pages/Medications'
import { Readings } from '@/pages/Readings'
import { Files } from '@/pages/Files'
import { Family } from '@/pages/Family'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

function Router() {
  const { route } = useNavigation()
  if (route === 'profile') return <Profile />
  if (route === 'settings') return <Settings />
  if (route === 'vault-security') return <VaultSecurity />
  if (route === 'datafeed-settings') return <DatafeedSettings />
  if (route === 'visits') return <Visits />
  if (route === 'appointments') return <Appointments />
  if (route === 'doctors') return <Doctors />
  if (route === 'medications') return <Medications />
  if (route === 'readings') return <Readings />
  if (route === 'files') return <Files />
  if (route === 'family') return <Family />
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
      <AuthProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <FabCornerProvider>
              <PrefsSync />
              <PatientVaultProvider>
                <AiCareProvider>
                  <NavigationProvider>
                    <AppShell>
                      <AuthGate>
                        <PatientVaultGate>
                          <BiometricEnrollPrompt />
                          <Router />
                        </PatientVaultGate>
                      </AuthGate>
                    </AppShell>
                  </NavigationProvider>
                </AiCareProvider>
              </PatientVaultProvider>
            </FabCornerProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
