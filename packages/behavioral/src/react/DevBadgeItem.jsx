import { Bug } from 'lucide-react'

/** @param {{ email?: string | null }} props */
export function DevBadgeItem({ email }) {
  if (!email) return null
  return (
    <div className="bh-dev-badge" title={`Dev auto-login active as ${email}`}>
      <Bug size={12} aria-hidden="true" />
      <span>Dev auto-login</span>
    </div>
  )
}
