import {
  Bookmark,
  ExternalLink,
  FolderTree,
  History,
  House,
  ListTree,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { FavStar } from '@/patterns/FavStar'
import { UrlParamsMenu } from '@/patterns/UrlParamsMenu'
import { useCurrentTab } from '@/hooks/useCurrentTabUrl'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './PageShortcuts.module.scss'

// Cross-page shortcuts rendered in each page's toolbar. Landing, AEM
// Jump, Visited URLs, Site Tree, and Fav Links share the workflow, so
// we surface the siblings on every page. Order below is the same
// everywhere; we just filter the current page out so the strip occupies
// a consistent slot.
const SHORTCUTS = [
  {
    id: 'landing',
    label: 'Landing',
    icon: House,
    pick: (nav) => nav.goLanding,
  },
  {
    id: 'aem-jump',
    label: 'AEM Jump',
    icon: ExternalLink,
    pick: (nav) => nav.goAemJump,
  },
  {
    id: 'aem-eds-ue',
    label: 'AEM EDS-UE',
    icon: ListTree,
    pick: (nav) => nav.goAemEdsUe,
  },
  {
    id: 'visited-urls',
    label: 'Visited URLs',
    icon: History,
    pick: (nav) => nav.goVisitedUrls,
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
    icon: Bookmark,
    pick: (nav) => nav.goFavLinks,
  },
]

// Rendered at the tail of the page's header row. The `.separator` uses
// `margin-left: auto` so the whole group hugs the right edge — the
// separator pipe becomes the visual boundary between the page's own
// toolbar (on the left) and this right-hand cluster (on the right).
//
// The right-hand cluster is:
//   1. UrlParamsMenu — one-click URL param edits targeting the active
//      browser tab. Sits first because it's a tool the current page
//      acts on, not navigation.
//   2. FavStar — one-click save-the-active-tab-to-Fav-Links. Placed
//      next to UrlParamsMenu because both act on the current tab.
//      Disabled in the web build (no chrome.tabs).
//   3. Cross-page nav buttons — jump to sibling tool pages.
//
// AEM Jump has its own dedicated UrlParamsMenu bound to the source-card
// input, so it doesn't render PageShortcuts's copy and there's no
// duplication.
export function PageShortcuts({ current, className }) {
  const nav = useNavigation()
  const tab = useCurrentTab()
  const visible = SHORTCUTS.filter((s) => s.id !== current)
  return (
    <>
      <span
        aria-hidden="true"
        role="separator"
        aria-orientation="vertical"
        className={styles.separator}
      />
      <UrlParamsMenu url={tab?.url ?? ''} className={className} />
      <FavStar
        url={tab?.url ?? ''}
        title={tab?.title ?? ''}
        className={className}
      />
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
