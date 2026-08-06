import {
  FontSizeProvider as ToolsFontSizeProvider,
  useFontSize,
} from '@tools/service'

export function FontSizeProvider({ children }) {
  return (
    <ToolsFontSizeProvider appId="jira-capacity">{children}</ToolsFontSizeProvider>
  )
}

export { useFontSize }
