import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckSquare,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  ListMusic,
  MapPin,
  Sun,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { activityIcon } from '@/lib/activityIcons'
import { formatFlightStatusLine } from '@/lib/flightStatus'
import { formatWallDate, formatWallTime } from '@/lib/format'
import {
  formatWeatherChip,
  hydrateWeatherCache,
  weatherIconKind,
  weatherKeyFromEntry,
} from '@/lib/weather'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

function WeatherIcon({ kind, size = 32 }) {
  const props = { size, strokeWidth: 1.75, 'aria-hidden': true }
  if (kind === 'sun') return <Sun {...props} />
  if (kind === 'cloud-sun') return <CloudSun {...props} />
  if (kind === 'fog') return <CloudFog {...props} />
  if (kind === 'drizzle') return <CloudDrizzle {...props} />
  if (kind === 'rain') return <CloudRain {...props} />
  if (kind === 'snow') return <CloudSnow {...props} />
  if (kind === 'storm') return <CloudLightning {...props} />
  return <Cloud {...props} />
}

const WEATHER_LEGEND = [
  { kind: 'sun', label: 'Clear' },
  { kind: 'cloud-sun', label: 'Partly cloudy' },
  { kind: 'cloud', label: 'Overcast' },
  { kind: 'fog', label: 'Fog' },
  { kind: 'rain', label: 'Rain' },
  { kind: 'snow', label: 'Snow' },
  { kind: 'storm', label: 'Storm' },
]

export function OfflineJourney() {
  const { params, goHome, navigate } = useNavigation()
  const journeyId = params.journeyId
  const { getPack } = useOffline()
  const { displayLocale } = useDisplayPrefs()
  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const next = journeyId ? await getPack(journeyId) : null
      if (mounted) {
        if (next?.weather) hydrateWeatherCache(next.weather)
        setPack(next)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [journeyId, getPack])

  const entries = useMemo(() => {
    const list = pack?.entries ?? []
    return [...list].sort((a, b) => {
      const da = a.occursOn || a.occursAt || ''
      const db = b.occursOn || b.occursAt || ''
      return String(da).localeCompare(String(db))
    })
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Journey" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading offline journey…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack?.journey) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Journey"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} aria-hidden="true" />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>This journey is not available offline.</p>
          <Button onClick={goHome} fullWidth>
            Back
          </Button>
        </div>
      </div>
    )
  }

  const journey = pack.journey
  const tz = journey.defaultTimezone

  return (
    <div className={styles.page}>
      <PageHeader
        title={journey.title || 'Journey'}
        leading={
          <Button variant="ghost" size="sm" onClick={goHome}>
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner syncedAt={pack.syncedAt} />

        <div className={styles.chipRow}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('spending', { journeyId })}
          >
            <Wallet size={14} aria-hidden="true" />
            Spending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('todos', { journeyId })}
          >
            <CheckSquare size={14} aria-hidden="true" />
            To-dos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('playlist', { journeyId })}
          >
            <ListMusic size={14} aria-hidden="true" />
            Playlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('map', { journeyId })}
          >
            <MapPin size={14} aria-hidden="true" />
            Places
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('members', { journeyId })}
          >
            <Users size={14} aria-hidden="true" />
            Travelers
          </Button>
        </div>

        {pack.weather && Object.keys(pack.weather).length > 0 ? (
          <div className={styles.weatherLegend} aria-label="Weather legend">
            <span className={styles.weatherLegendLabel}>Weather</span>
            <span className={styles.weatherLegendSep} aria-hidden="true">
              ·
            </span>
            <ul className={styles.weatherLegendList}>
              {WEATHER_LEGEND.map((item) => (
                <li
                  key={item.kind}
                  className={styles.weatherLegendItem}
                  data-kind={item.kind}
                >
                  <span className={styles.entryWeatherIcon}>
                    <WeatherIcon kind={item.kind} size={14} />
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className={styles.sectionTitle}>Timeline</p>
        {entries.length === 0 ? (
          <p className={styles.hint}>No activities in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {entries.map((e) => {
              const when = e.occursAt
                ? `${formatWallDate(e.occursAt, e.timezone || tz, displayLocale)} · ${formatWallTime(e.occursAt, e.timezone || tz, displayLocale)}`
                : e.occursOn
                  ? formatWallDate(e.occursOn, tz, displayLocale)
                  : null
              const flightStatusLine = formatFlightStatusLine(e.details)
              const weatherLookup = weatherKeyFromEntry(e)
              const weather = weatherLookup
                ? pack?.weather?.[weatherLookup.key]
                : null
              const weatherLabel = formatWeatherChip(weather, {
                locale: displayLocale,
              })
              const weatherKind = weatherIconKind(weather?.weatherCode)
              const ActivityIcon = activityIcon(e.activityId)
              return (
                <li
                  key={e.id}
                  className={cx(
                    styles.entryRow,
                    styles.entryRowTimeline,
                    weatherLabel && styles.entryRowHasWeather,
                  )}
                >
                  <span className={styles.entryIconFlat} aria-hidden="true">
                    <ActivityIcon size={32} strokeWidth={1.75} />
                  </span>
                  <div className={styles.entryMain}>
                    <div className={styles.entryTitle}>
                      <strong className={styles.rowTitle}>
                        {e.title || e.activityId || 'Activity'}
                      </strong>
                    </div>
                    <div className={styles.entryMeta}>
                      {when && <span className={styles.hint}>{when}</span>}
                      {flightStatusLine && (
                        <span className={styles.flightStatus}>
                          {flightStatusLine}
                        </span>
                      )}
                      {e.placeName && (
                        <span className={styles.hint}>{e.placeName}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.entryActions} />
                  {weatherLabel ? (
                    <div
                      className={styles.entryWeather}
                      title={
                        weather?.summary
                          ? `${weather.summary} · as of offline pin`
                          : 'Forecast as of offline pin'
                      }
                      data-kind={weatherKind}
                    >
                      <span className={styles.entryWeatherIcon}>
                        <WeatherIcon kind={weatherKind} size={28} />
                      </span>
                      <span className={styles.entryWeatherTemps}>
                        {weatherLabel}
                      </span>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
