import {
  FabCornerProvider as ToolsFabCornerProvider,
  useFabCorner,
} from '@tools/service'

export function FabCornerProvider({ children }) {
  return (
    <ToolsFabCornerProvider appId="jira-capacity">{children}</ToolsFabCornerProvider>
  )
}

export { useFabCorner }
