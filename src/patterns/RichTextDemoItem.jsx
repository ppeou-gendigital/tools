import { FilePenLine } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function RichTextDemoItem({ onClose }) {
  const { goRichTextDemo } = useNavigation()
  return (
    <MenuRow
      icon={FilePenLine}
      label="Rich text demo"
      onClose={onClose}
      onClick={goRichTextDemo}
    />
  )
}
