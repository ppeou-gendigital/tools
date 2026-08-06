import { MenuRow } from '@tools/ui'

/**
 * @param {object} props
 * @param {Array<{ id: string, label: string, icon?: any, onClick: () => void }>} props.items
 * @param {() => void} [props.onClose]
 * @param {string} [props.activeId] — highlights the matching item
 */
export function AppNavItems({ items = [], onClose, activeId }) {
  return (
    <>
      {items.map(({ id, label, icon, onClick }) => (
        <MenuRow
          key={id}
          icon={icon}
          label={label}
          onClose={onClose}
          onClick={onClick}
          active={id === activeId}
        />
      ))}
    </>
  )
}
