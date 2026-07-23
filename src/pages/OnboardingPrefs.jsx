import { useMemo, useState } from 'react'
import { Button } from '@/molecules/Button'
import { Label } from '@/molecules/Label'
import { LocaleAutocomplete } from '@/molecules/LocaleAutocomplete'
import { Select } from '@/molecules/Select'
import { PageHeader } from '@/patterns/PageHeader'
import {
  COMMON_CURRENCIES,
  guessDeviceCurrency,
  guessDeviceLocale,
} from '@/lib/catalog'
import { formatMoney, formatWallDate } from '@/lib/format'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

export function OnboardingPrefs() {
  const { confirmPrefs } = useDisplayPrefs()
  const { replace } = useNavigation()
  const [locale, setLocale] = useState(guessDeviceLocale)
  const [currency, setCurrency] = useState(guessDeviceCurrency)
  const [saving, setSaving] = useState(false)

  const preview = useMemo(
    () => ({
      money: formatMoney(123450, currency, locale),
      date: formatWallDate(new Date().toISOString(), undefined, locale),
    }),
    [locale, currency],
  )

  async function onContinue() {
    setSaving(true)
    try {
      await confirmPrefs({ locale, currency })
      replace('home')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="How should Viaggio look?"
        subtitle="Confirm locale and default currency. You can change these later in Settings."
      />
      <div className={styles.body}>
        <div className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="locale">Display locale</Label>
            <LocaleAutocomplete
              id="locale"
              value={locale}
              onChange={setLocale}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="currency">Default currency</Label>
            <Select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <p className={styles.hint}>
            Preview: {preview.money} · {preview.date}
          </p>
          <Button onClick={onContinue} disabled={saving} fullWidth>
            {saving ? 'Saving…' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
