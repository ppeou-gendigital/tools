import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { OfflineProvider, useOffline } from '@/providers/OfflineProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { VaultItemsSync } from '@/providers/VaultItemsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { VaultProvider, useVault } from '@/providers/VaultProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import gateStyles from '@/blocks/AuthGate.module.scss'
import { VaultUnlockOverlay } from '@/blocks/VaultUnlockOverlay'
import { BiometricEnrollPrompt } from '@/blocks/BiometricEnrollPrompt'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { DeckDemo } from '@/pages/DeckDemo'
import { Settings } from '@/pages/Settings'
import { VaultSettings } from '@/pages/VaultSettings'
import { DatafeedSettings } from '@/pages/DatafeedSettings'
import { Credentials } from '@/pages/Credentials'
import { CredentialEdit } from '@/pages/CredentialEdit'
import { CreditCards } from '@/pages/CreditCards'
import { CreditCardEdit } from '@/pages/CreditCardEdit'
import { VaultUnlock } from '@/pages/VaultUnlock'
import { OfflineEmpty } from '@/pages/offline/OfflineEmpty'
import { OfflineRouter } from '@/pages/offline/OfflineRouter'
import { APP_VERSION } from '@/env'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

const VAULT_ROUTES = new Set([
  'credentials',
  'credential-new',
  'credential-edit',
  'credit-cards',
  'credit-card-new',
  'credit-card-edit',
  'datafeed-settings',
])

function OnlineRouter() {
  const { route } = useNavigation()
  const vault = useVault()

  if (VAULT_ROUTES.has(route) && vault.needsSetup) {
    return <VaultUnlock />
  }

  if (route === 'profile') return <Profile />
  if (route === 'deck-demo') return <DeckDemo />
  if (route === 'settings') return <Settings />
  if (route === 'vault-settings') return <VaultSettings />
  if (route === 'datafeed-settings') return <DatafeedSettings />
  if (route === 'credentials') return <Credentials />
  if (route === 'credential-new') return <CredentialEdit />
  if (route === 'credential-edit') return <CredentialEdit />
  if (route === 'credit-cards') return <CreditCards />
  if (route === 'credit-card-new') return <CreditCardEdit />
  if (route === 'credit-card-edit') return <CreditCardEdit />
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
        <VaultUnlockOverlay />
      </>
    )
  }

  return (
    <AuthGate>
      <OnlineRouter />
      <VaultUnlockOverlay />
      <BiometricEnrollPrompt />
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
                <VaultProvider>
                  <PrefsSync />
                  <VaultItemsSync />
                  <NavigationProvider>
                    <AppShell>
                      <ModeSwitch />
                    </AppShell>
                  </NavigationProvider>
                </VaultProvider>
              </FabCornerProvider>
            </FontSizeProvider>
          </ThemeProvider>
        </AuthProvider>
      </OfflineProvider>
    </PersistQueryClientProvider>
  )
}
