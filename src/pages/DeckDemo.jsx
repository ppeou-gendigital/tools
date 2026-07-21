import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './DeckDemo.module.scss'

const SLIDES = [1, 2, 3, 4, 5]

export function DeckDemo() {
  const { goBack, previousRouteLabel } = useNavigation()
  return (
    <div className={styles.page}>
      <PageHeader
        title="Deck demo"
        subtitle="SM: 10 cols / MD: 5 / LG: 4 / XL: 3"
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        shortcuts={
          <PageShortcuts current="deck-demo" className={styles.iconBtn} />
        }
      />

      <div className={cx('is-fluid-width', styles.deckWrap)}>
        <Deck>
          {SLIDES.map((n) => (
            <Slide key={n} span={10} spanMd={5} spanLg={4} spanXl={3}>
              <div className={styles.slideBody} data-slide={n}>
                <div className={styles.slideNumber}>{n}</div>
                <h2 className={styles.slideTitle}>Slide {n}</h2>
                <p className={styles.slideMeta}>span: 10 / 5 / 4 / 3</p>
              </div>
            </Slide>
          ))}
        </Deck>
      </div>
    </div>
  )
}
