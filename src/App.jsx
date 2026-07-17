import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AuthProvider } from '@/providers/AuthProvider'
import { FabCornerProvider } from '@/providers/FabCornerProvider'
import { FontSizeProvider } from '@/providers/FontSizeProvider'
import { NavigationProvider, useNavigation } from '@/providers/NavigationProvider'
import { PrefsSync } from '@/providers/PrefsSync'
import { VaultItemsSync } from '@/providers/VaultItemsSync'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { VaultProvider, useVault } from '@/providers/VaultProvider'
import { AppShell } from '@/templates/AppShell'
import { AuthGate } from '@/blocks/AuthGate'
import { VaultUnlockOverlay } from '@/blocks/VaultUnlockOverlay'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { DeckDemo } from '@/pages/DeckDemo'
import { Settings } from '@/pages/Settings'
import { VaultSettings } from '@/pages/VaultSettings'
import { Credentials } from '@/pages/Credentials'
import { CredentialEdit } from '@/pages/CredentialEdit'
import { CreditCards } from '@/pages/CreditCards'
import { CreditCardEdit } from '@/pages/CreditCardEdit'
import { VaultUnlock } from '@/pages/VaultUnlock'
import { queryClient } from '@/lib/queryClient'
import { queryPersister } from '@/lib/queryPersister'

// Bump this whenever the cached shape changes so stale entries get busted
// on next popup open.
const APP_VERSION = '0.1.0'

// Routes that touch the vault. When the user has never set a
// passphrase (`needsSetup`), we hijack these routes with the full-page
// setup wizard. The locked-but-set-up case is handled by the overlay
// (see `<VaultUnlockOverlay />`) and per-page locked placeholders, so
// we don't route-swap for it.
const VAULT_ROUTES = new Set([
  'credentials',
  'credential-new',
  'credential-edit',
  'credit-cards',
  'credit-card-new',
  'credit-card-edit',
])

function Router() {
  const { route } = useNavigation()
  const vault = useVault()

  if (VAULT_ROUTES.has(route) && vault.needsSetup) {
    return <VaultUnlock />
  }

  if (route === 'profile') return <Profile />
  if (route === 'deck-demo') return <DeckDemo />
  if (route === 'settings') return <Settings />
  if (route === 'vault-settings') return <VaultSettings />
  if (route === 'credentials') return <Credentials />
  if (route === 'credential-new') return <CredentialEdit />
  if (route === 'credential-edit') return <CredentialEdit />
  if (route === 'credit-cards') return <CreditCards />
  if (route === 'credit-card-new') return <CreditCardEdit />
  if (route === 'credit-card-edit') return <CreditCardEdit />
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
      {/* AuthProvider is above Theme/Font/Fab so those providers can
          call applySyncOp with the current userId (Fav Links recipe). */}
      <AuthProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <FabCornerProvider>
              <VaultProvider>
                <PrefsSync />
                <VaultItemsSync />
                <NavigationProvider>
                  <AppShell>
                    <AuthGate>
                      <Router />
                      <VaultUnlockOverlay />
                    </AuthGate>
                  </AppShell>
                </NavigationProvider>
              </VaultProvider>
            </FabCornerProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
