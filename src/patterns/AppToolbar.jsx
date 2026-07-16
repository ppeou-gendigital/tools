import { CreditCard, KeyRound, Settings } from 'lucide-react'
import { AutofillButton } from '@/patterns/AutofillButton'
import { FillCardButton } from '@/patterns/FillCardButton'
import { HeaderIconButton } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'

// The always-present right-side cluster of app-level navigation
// shortcuts. Rendered by <PageHeader> — pages never mount this
// directly, so the icon set stays consistent across the app.
//
// Each icon lights up when its route (or a sub-route) is active,
// giving users an unobtrusive "you are here" signal without a
// dedicated breadcrumb.
const ITEMS = [
  {
    id: 'credentials',
    label: 'Credentials',
    Icon: KeyRound,
    routes: ['credentials', 'credential-new', 'credential-edit'],
    onGo: (nav) => nav.goCredentials(),
  },
  {
    id: 'credit-cards',
    label: 'Credit cards',
    Icon: CreditCard,
    routes: ['credit-cards', 'credit-card-new', 'credit-card-edit'],
    onGo: (nav) => nav.goCreditCards(),
  },
  {
    id: 'settings',
    label: 'Settings',
    Icon: Settings,
    routes: ['settings', 'vault-settings'],
    onGo: (nav) => nav.goSettings(),
  },
]

export function AppToolbar() {
  const nav = useNavigation()
  return (
    <nav aria-label="App navigation" style={{ display: 'contents' }}>
      {/* Ambient contextual action — only renders when the active
          tab actually matches something in the vault. Positioned
          before the fixed nav shortcuts so it's the first thing the
          eye lands on when it does appear. */}
      <AutofillButton />
      <FillCardButton />
      {ITEMS.map(({ id, label, Icon, routes, onGo }) => {
        const active = routes.includes(nav.route)
        return (
          <HeaderIconButton
            key={id}
            active={active}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            title={label}
            onClick={() => onGo(nav)}
          >
            <Icon size={16} aria-hidden="true" />
          </HeaderIconButton>
        )
      })}
    </nav>
  )
}
