import { ExternalLink, FolderTree, Star } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { UrlParamsMenu } from '@/patterns/UrlParamsMenu'
import { useCurrentTabUrl } from '@/hooks/useCurrentTabUrl'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './PageShortcuts.module.scss'

// Cross-page shortcuts rendered in each page's toolbar. AEM Jump, Site
// Tree, and Fav Links are used together in the same workflow (jump to an
// environment, inspect its tree, bookmark a URL) so we surface the other
// two on every page. Order below is the same everywhere; we just filter
// the current page out so the strip always has exactly two entries and
// occupies a consistent slot in the header.
const SHORTCUTS = [
  {
    id: 'aem-jump',
    label: 'AEM Jump',
    icon: ExternalLink,
    pick: (nav) => nav.goAemJump,
  },
  {
    id: 'site-tree',
    label: 'Site tree',
    icon: FolderTree,
    pick: (nav) => nav.goSiteTree,
  },
  {
    id: 'fav-links',
    label: 'Fav links',
    icon: Star,
    pick: (nav) => nav.goFavLinks,
  },
]

// Rendered at the tail of the page's header row. The `.separator` uses
// `margin-left: auto` so the whole group hugs the right edge — the
// separator pipe becomes the visual boundary between the page's own
// toolbar (on the left) and this right-hand cluster (on the right).
//
// The right-hand cluster is:
//   1. UrlParamsMenu — one-click URL param edits (A/B, Analytics debug,
//      promocode presets) targeting the active browser tab. Sits first
//      because it's a tool the current page acts on, not navigation.
//   2. Cross-page nav buttons — jump to sibling tool pages.
//
// AEM Jump has its own dedicated UrlParamsMenu bound to the source-card
// input, so it doesn't render PageShortcuts and there's no duplication.
export function PageShortcuts({ current, className }) {
  const nav = useNavigation()
  const tabUrl = useCurrentTabUrl()
  const visible = SHORTCUTS.filter((s) => s.id !== current)
  return (
    <>
      <span
        aria-hidden="true"
        role="separator"
        aria-orientation="vertical"
        className={styles.separator}
      />
      <UrlParamsMenu url={tabUrl ?? ''} className={className} />
      {visible.map(({ id, label, icon: Icon, pick }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={pick(nav)}
          className={className}
          aria-label={`Go to ${label}`}
          title={label}
        >
          <Icon size={14} aria-hidden="true" />
        </Button>
      ))}
    </>
  )
}
