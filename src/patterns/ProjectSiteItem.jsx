import { Globe } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'

const PROJECT_SITE_URL = 'https://ppeou-gendigital.github.io/tools/loopy/'

// Opens the public Loopy project page in a new tab. Kept as a plain
// window.open so it works identically in the extension popup and the
// hosted web build - no NavigationProvider route needed since the target
// lives outside the app shell.
export function ProjectSiteItem({ onClose }) {
  function openSite() {
    window.open(PROJECT_SITE_URL, '_blank', 'noopener,noreferrer')
  }
  return (
    <MenuRow
      icon={Globe}
      label="Project site"
      onClose={onClose}
      onClick={openSite}
    />
  )
}
