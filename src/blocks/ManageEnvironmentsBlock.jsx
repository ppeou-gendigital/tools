import { ChevronDown, ChevronUp, Eye, EyeOff, Settings2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { isDomainRenderable } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import styles from './ManageEnvironmentsBlock.module.scss'

// Manage-slide for the AEM Jump deck. Renders one row per RENDERABLE
// domain with an up/down pair and a visibility toggle. All mutations go
// through the provider setter, which persists locally and hands off to
// PrefsSync for the debounced Supabase upsert.
//
// Reorder logic operates on the FULL domains array (via the provider's
// functional updater) so draft entries between two renderable entries
// stay in place - we walk past them to find the nearest renderable
// neighbour before swapping.
export function ManageEnvironmentsBlock({ domains, onChange, onOpenSettings }) {
  const isEmpty = domains.length === 0

  function move(id, delta) {
    onChange((prev) => {
      const i = prev.findIndex((d) => d.id === id)
      if (i < 0) return prev
      let j = i + delta
      while (j >= 0 && j < prev.length && !isDomainRenderable(prev[j])) {
        j += delta
      }
      if (j < 0 || j >= prev.length) return prev
      const next = prev.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function toggleVisible(id) {
    onChange((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, visible: d.visible === false } : d,
      ),
    )
  }

  return (
    <section className={styles.block} aria-label="Manage environments">
      <header className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>Environments</h2>
        <p className={styles.blockSubtitle}>
          Toggle which environments show up on this page, and reorder them.
        </p>
      </header>

      {isEmpty ? (
        <p className={styles.empty}>
          No environments configured yet. Add one in Settings to see it here.
        </p>
      ) : (
        <ul className={styles.rows}>
          {domains.map((d, index) => {
            const isFirst = index === 0
            const isLast = index === domains.length - 1
            const isVisible = d.visible !== false
            const displayLabel = d.label || d.kind
            return (
              <li key={d.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowLabel}>{displayLabel}</span>
                  <div className={styles.chips}>
                    <span className={cx(styles.chip, styles.chipKind)}>
                      {d.kind}
                    </span>
                    <span className={styles.chip}>{d.role}</span>
                    <span className={styles.chip}>{d.env}</span>
                  </div>
                </div>
                <div className={styles.rowControls}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(d.id, -1)}
                    disabled={isFirst}
                    aria-label={`Move ${displayLabel} up`}
                    title="Move up"
                  >
                    <ChevronUp size={14} aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(d.id, 1)}
                    disabled={isLast}
                    aria-label={`Move ${displayLabel} down`}
                    title="Move down"
                  >
                    <ChevronDown size={14} aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisible(d.id)}
                    aria-pressed={isVisible}
                    aria-label={
                      isVisible
                        ? `Hide ${displayLabel}`
                        : `Show ${displayLabel}`
                    }
                    title={isVisible ? 'Hide' : 'Show'}
                    className={cx(!isVisible && styles.hiddenBtn)}
                  >
                    {isVisible ? (
                      <Eye size={14} aria-hidden="true" />
                    ) : (
                      <EyeOff size={14} aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {onOpenSettings && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className={styles.settingsBtn}
        >
          <Settings2 size={12} aria-hidden="true" />
          Add or edit in Settings
        </Button>
      )}
    </section>
  )
}
