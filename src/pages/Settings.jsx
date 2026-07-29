import { useState } from 'react'
import { Archive, ArrowLeft, UserRound } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Label } from '@/molecules/Label'
import { LocaleAutocomplete } from '@/molecules/LocaleAutocomplete'
import { Select } from '@/molecules/Select'
import { PageHeader } from '@/patterns/PageHeader'
import { COMMON_CURRENCIES } from '@/lib/catalog'
import { formatMoney, formatWallDate } from '@/lib/format'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function Settings() {
  const { goBack, previousRouteLabel, goArchives, goProfile } = useNavigation()
  const {
    displayLocale,
    defaultCurrency,
    mapsProvider,
    setDisplayLocale,
    setDefaultCurrency,
    setMapsProvider,
  } = useDisplayPrefs()
  const [locale, setLocale] = useState(displayLocale)
  const [currency, setCurrency] = useState(defaultCurrency)
  const [maps, setMaps] = useState(mapsProvider)
  const [saved, setSaved] = useState(false)

  async function onSave() {
    await setDisplayLocale(locale)
    await setDefaultCurrency(currency)
    await setMapsProvider(maps)
    setSaved(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        subtitle="Display preferences for Viaggio."
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />

      <div className={cx('is-fluid-width', styles.body)}>
        <div className={cx(styles.form, styles.formNarrow)}>
          <p className={styles.sectionTitle}>Account</p>
          <ul className={styles.list}>
            <li>
              <button
                type="button"
                className={styles.rowBtn}
                onClick={() => goProfile()}
              >
                <UserRound
                  size={16}
                  className={styles.rowIcon}
                  aria-hidden="true"
                />
                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>Profile</span>
                  <span className={styles.rowMeta}>
                    How you appear to co-travelers
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.rowBtn}
                onClick={() => goArchives()}
              >
                <Archive
                  size={16}
                  className={styles.rowIcon}
                  aria-hidden="true"
                />
                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>Archives</span>
                  <span className={styles.rowMeta}>
                    Restore or import saved journeys
                  </span>
                </span>
              </button>
            </li>
          </ul>

          <p className={styles.sectionTitle}>Display</p>
          <div className={styles.field}>
            <Label htmlFor="locale">Display locale</Label>
            <LocaleAutocomplete
              id="locale"
              value={locale}
              onChange={(next) => {
                setLocale(next)
                setSaved(false)
              }}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="currency">Default currency</Label>
            <Select
              id="currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value)
                setSaved(false)
              }}
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.field}>
            <Label htmlFor="mapsProvider">Preferred maps app</Label>
            <Select
              id="mapsProvider"
              value={maps}
              onChange={(e) => {
                setMaps(e.target.value)
                setSaved(false)
              }}
            >
              <option value="google">Google Maps</option>
              <option value="apple">Apple Maps</option>
            </Select>
          </div>
          <p className={styles.hint}>
            Preview: {formatMoney(123450, currency, locale)} ·{' '}
            {formatWallDate(new Date().toISOString(), undefined, locale)}.
            Journey Map buttons open {maps === 'apple' ? 'Apple' : 'Google'}{' '}
            Maps.
          </p>
          <Button onClick={onSave} fullWidth>
            {saved ? 'Saved' : 'Save preferences'}
          </Button>
        </div>
      </div>
    </div>
  )
}
