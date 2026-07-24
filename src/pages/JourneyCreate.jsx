import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { Select } from '@/molecules/Select'
import { TimezoneAutocomplete } from '@/molecules/TimezoneAutocomplete'
import { PageHeader } from '@/patterns/PageHeader'
import {
  COMMON_CURRENCIES,
  PRESETS,
  guessDeviceTimezone,
} from '@/lib/catalog'
import { createJourney } from '@/lib/viaggioApi'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function JourneyCreate() {
  const nav = useNavigation()
  const { defaultCurrency } = useDisplayPrefs()
  const qc = useQueryClient()
  const [preset, setPreset] = useState(null)
  const [title, setTitle] = useState('')
  const [startsOn, setStartsOn] = useState('')
  const [endsOn, setEndsOn] = useState('')
  const [timezone, setTimezone] = useState(guessDeviceTimezone)
  const [currency, setCurrency] = useState(defaultCurrency)
  const [error, setError] = useState('')

  const createMut = useMutation({
    mutationFn: createJourney,
    onSuccess: (journey) => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      nav.replace('journey', { journeyId: journey.id })
    },
    onError: (err) => setError(err.message || 'Create failed'),
  })

  function pickPreset(p) {
    setPreset(p)
    setTitle('')
    setError('')
  }

  function onCreate() {
    if (!preset) return
    setError('')
    createMut.mutate({
      title: title.trim() || preset.titlePlaceholder || preset.label,
      type: preset.type,
      preset: preset.id,
      defaultTimezone: timezone,
      defaultCurrency: currency,
      startsOn: startsOn || null,
      endsOn: endsOn || null,
    })
  }

  if (!preset) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="New journey"
          subtitle="Pick a starting template."
          leading={
            <Button variant="ghost" size="sm" onClick={nav.goBack}>
              <ArrowLeft size={14} />
              {nav.previousRouteLabel ?? 'Back'}
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <div className={styles.formNarrow}>
            <ul className={styles.list}>
              {PRESETS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={styles.rowBtn}
                    onClick={() => pickPreset(p)}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowTitle}>{p.label}</span>
                      <span className={styles.rowMeta}>{p.description}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={preset.label}
        subtitle="Confirm title, timezone, and currency."
        leading={
          <Button variant="ghost" size="sm" onClick={() => setPreset(null)}>
            <ArrowLeft size={14} />
            Presets
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <div className={cx(styles.form, styles.formNarrow)}>
          <div className={styles.field}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={preset.titlePlaceholder}
            />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Label htmlFor="starts">Starts (optional)</Label>
              <Input
                id="starts"
                type="date"
                value={startsOn}
                onChange={(e) => setStartsOn(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="ends">Ends (optional)</Label>
              <Input
                id="ends"
                type="date"
                value={endsOn}
                onChange={(e) => setEndsOn(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="tz">Default timezone</Label>
              <TimezoneAutocomplete
                id="tz"
                value={timezone}
                onChange={setTimezone}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="cur">Default currency</Label>
              <Select
                id="cur"
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
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button onClick={onCreate} disabled={createMut.isPending} fullWidth>
            {createMut.isPending ? 'Creating…' : 'Create journey'}
          </Button>
        </div>
      </div>
    </div>
  )
}
