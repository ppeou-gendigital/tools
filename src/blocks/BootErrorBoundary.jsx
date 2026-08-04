import { Component } from 'react'
import { hasAttemptedPwaRepair, repairPwaShell } from '@/lib/pwaRepair'
import styles from './BootErrorBoundary.module.scss'

/**
 * Catches render crashes (e.g. React #185) and offers a full browser wipe + reload.
 */
export class BootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, repairing: false }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[loopy] boot crash', error, info?.componentStack)
    // Auto-repair once per tab session when a render crash blanks the app.
    if (!hasAttemptedPwaRepair()) {
      this.setState({ repairing: true })
      void repairPwaShell()
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className={styles.panel} role="alert">
        <h1 className={styles.title}>Loopy couldn’t load</h1>
        <p className={styles.body}>
          {this.state.repairing
            ? 'Clearing all site data and reloading…'
            : 'Something went wrong while starting the app. Reload clears all Loopy data in this browser (sign-in, cache, and saved route) and starts fresh.'}
        </p>
        <button
          type="button"
          className={styles.btn}
          disabled={this.state.repairing}
          onClick={() => {
            this.setState({ repairing: true })
            void repairPwaShell({ force: true })
          }}
        >
          Reload app
        </button>
      </div>
    )
  }
}
