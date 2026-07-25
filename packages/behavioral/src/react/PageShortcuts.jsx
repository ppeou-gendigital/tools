import { Button } from '@tools/ui'

/**
 * @param {object} props
 * @param {string} [props.current]
 * @param {string} [props.className]
 * @param {Array<{ id: string, label: string, icon: any, onClick: () => void }>} props.items
 */
export function PageShortcuts({ current, className, items = [] }) {
  const visible = items.filter((s) => s.id !== current)
  if (visible.length === 0) return null

  return (
    <div className="bh-shortcuts" role="toolbar" aria-label="App">
      <span
        aria-hidden="true"
        role="separator"
        aria-orientation="vertical"
        className="bh-shortcuts__sep"
      />
      {visible.map(({ id, label, icon: Icon, onClick }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={className}
          aria-label={label}
          title={label}
        >
          <Icon size={14} aria-hidden="true" />
        </Button>
      ))}
    </div>
  )
}
