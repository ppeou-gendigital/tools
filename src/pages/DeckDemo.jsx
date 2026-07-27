import { Deck, Slide } from '@/blocks/Deck'
import { PageHeader } from '@/patterns/PageHeader'
import styles from './DeckDemo.module.scss'

const SLIDES = [1, 2, 3, 4, 5]

export function DeckDemo() {
  return (
    <div className={styles.page}>
      <PageHeader title="Deck demo" subtitle="SM: 10 cols / MD: 5 / LG: 4 / XL: 3" />

      <div className={styles.deckWrap}>
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
