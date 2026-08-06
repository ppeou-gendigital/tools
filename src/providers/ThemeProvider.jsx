import { ThemeProvider as ToolsThemeProvider, useTheme } from '@tools/service'

export function ThemeProvider({ children }) {
  return (
    <ToolsThemeProvider appId="jira-capacity" defaultTheme="system">
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
