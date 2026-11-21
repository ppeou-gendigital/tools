import '@mantine/core/styles.css'
import './styles.css'

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import App from './App.jsx'
import { theme } from './theme.js'
import { useChromeStorage } from './hooks/useChromeStorage.js'
import { STORAGE_KEYS } from './lib/jira/config.js'
import { resolveColorScheme } from './lib/theme.js'

function useSystemDark() {
  const [dark, setDark] = useState(
    () =>
      window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return dark
}

function Root() {
  const [colorScheme, setColorScheme] = useChromeStorage(
    STORAGE_KEYS.theme,
    'system',
  )
  const [now, setNow] = useState(() => new Date())
  const systemDark = useSystemDark()

  // Sunrise/sunset flips at 06:00 and 18:00; a per-minute tick catches the
  // boundary while the popup happens to stay open.
  useEffect(() => {
    if (colorScheme !== 'sunrise') return undefined

    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [colorScheme])

  return (
    <MantineProvider
      theme={theme}
      forceColorScheme={resolveColorScheme(colorScheme, systemDark, now)}
    >
      <App colorScheme={colorScheme} onColorSchemeChange={setColorScheme} />
    </MantineProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
