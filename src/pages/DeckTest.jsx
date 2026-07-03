import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './DeckTest.module.scss'

const SLIDES = [1, 2, 3, 4, 5]

export function DeckTest() {
  const { goHome } = useNavigation()
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={goHome} className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Deck test</h1>
          <p className={styles.subtitle}>SM: 10 cols / MD: 5 / LG: 4 / XL: 3</p>
        </div>
      </header>

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
