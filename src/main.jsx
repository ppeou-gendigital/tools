import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@tools/ui/css'
import '@tools/behavioral/css'
import './brand.scss'

if (import.meta.env.MODE !== 'extension') {
  void import('./pwaRegister.js')
}

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found. Did you forget <div id="root"></div>?')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
