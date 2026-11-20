import '@mantine/core/styles.css'
import './styles.css'

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import App from './App.jsx'
import { theme } from './theme.js'
import { useChromeStorage } from './hooks/useChromeStorage.js'

const SUNRISE_HOUR = 6
const SUNSET_HOUR = 18

function isDaytime(date) {
  const hour = date.getHours()
  return hour >= SUNRISE_HOUR && hour < SUNSET_HOUR
}

function resolveColorScheme(colorScheme, systemDark, now) {
  if (colorScheme === 'light') return 'light'
  if (colorScheme === 'dark') return 'dark'
  if (colorScheme === 'sunrise') return isDaytime(now) ? 'light' : 'dark'
  return systemDark ? 'dark' : 'light'
}

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
    'aemJump.colorScheme',
    'system',
  )
  const [now, setNow] = useState(() => new Date())
  const systemDark = useSystemDark()

  useEffect(() => {
    if (colorScheme !== 'sunrise') return undefined

    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [colorScheme])

  const resolved = resolveColorScheme(colorScheme, systemDark, now)

  return (
    <MantineProvider theme={theme} forceColorScheme={resolved}>
      <App colorScheme={colorScheme} onColorSchemeChange={setColorScheme} />
    </MantineProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
