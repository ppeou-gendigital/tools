import { useEffect, useRef } from 'react'
import { Deck, Slide } from '@/blocks/Deck'
import { JiraTabs } from '@/patterns/JiraTabs'
import { activeSlideKeyFromDeck, scrollDeckToSlide } from '@/lib/deckNav'
import { JIRA_SLIDES, isJiraSlideRoute } from '@/lib/jira/slides'
import { useNavigation } from '@/providers/NavigationProvider'
import { Report } from '@/pages/Report'
import { Sprints } from '@/pages/Sprints'
import { Columns } from '@/pages/Columns'
import { Users } from '@/pages/Users'
import {
  IssueStatus,
  IssueType,
  Projects,
  Resolutions,
} from '@/pages/LookupFilterPage'
import styles from './JiraWorkspace.module.scss'

const SLIDE_CONTENT = {
  report: Report,
  sprints: Sprints,
  columns: Columns,
  users: Users,
  'issue-type': IssueType,
  'issue-status': IssueStatus,
  resolutions: Resolutions,
  projects: Projects,
}

/** Visible slides → 12-col span: SM 1.2 / MD 2.2 / LG 3.2 / XL 4.2. */
const SLIDE_SPAN = {
  sm: 12 / 1.2,
  md: 12 / 2.2,
  lg: 12 / 3.2,
  xl: 12 / 4.2,
}

function routeToSlide(route) {
  return isJiraSlideRoute(route) ? route : 'report'
}

/** One parent attribute write — CSS selects the matching slide body. */
function applyActiveSlide(root, key) {
  if (!root || !key) return
  if (root.getAttribute('data-active-slide') === key) return
  root.setAttribute('data-active-slide', key)
}

export function JiraWorkspace() {
  const { route, replace, goProfiles } = useNavigation()
  const pageRef = useRef(null)
  const deckRef = useRef(null)
  const tabsRef = useRef(null)
  const skipRouteScrollRef = useRef(false)
  const activeId = routeToSlide(route)

  useEffect(() => {
    if (skipRouteScrollRef.current) {
      skipRouteScrollRef.current = false
      applyActiveSlide(pageRef.current, activeId)
      return
    }

    const deck = deckRef.current
    if (!deck) return
    scrollDeckToSlide(deck, activeId)
    applyActiveSlide(pageRef.current, activeId)
    const raf = requestAnimationFrame(() => {
      scrollDeckToSlide(deck, activeId)
      applyActiveSlide(pageRef.current, activeId)
    })
    return () => cancelAnimationFrame(raf)
  }, [activeId])

  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return

    let raf = 0
    let settleTimer = 0
    const supportsScrollEnd = 'onscrollend' in deck

    const syncHighlight = () => {
      const key = activeSlideKeyFromDeck(deck)
      if (!key) return null
      applyActiveSlide(pageRef.current, key)
      tabsRef.current?.setActive?.(key)
      return key
    }

    const persistRoute = () => {
      const key = syncHighlight()
      if (!key || key === route) return
      skipRouteScrollRef.current = true
      replace(key)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(syncHighlight)

      if (!supportsScrollEnd) {
        clearTimeout(settleTimer)
        settleTimer = window.setTimeout(persistRoute, 80)
      }
    }

    deck.addEventListener('scroll', onScroll, { passive: true })
    if (supportsScrollEnd) {
      deck.addEventListener('scrollend', persistRoute)
    }
    applyActiveSlide(pageRef.current, activeId)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(settleTimer)
      deck.removeEventListener('scroll', onScroll)
      if (supportsScrollEnd) {
        deck.removeEventListener('scrollend', persistRoute)
      }
    }
  }, [route, replace, activeId])

  function onSelectTab(id) {
    replace(id)
  }

  return (
    <div
      ref={pageRef}
      className={styles.page}
      data-jira-workspace
      data-active-slide={activeId}
    >
      <JiraTabs
        ref={tabsRef}
        className={styles.fullWidth}
        activeId={activeId}
        onSelect={onSelectTab}
        onHome={goProfiles}
      />
      <div className={styles.deckWrap}>
        <Deck ref={deckRef} className={styles.deck}>
          {JIRA_SLIDES.map(({ id }) => {
            const Content = SLIDE_CONTENT[id]
            return (
              <Slide
                key={id}
                span={SLIDE_SPAN.sm}
                spanMd={SLIDE_SPAN.md}
                spanLg={SLIDE_SPAN.lg}
                spanXl={SLIDE_SPAN.xl}
                data-slide={id}
              >
                <div className={styles.slideBody}>
                  <Content />
                </div>
              </Slide>
            )
          })}
          <div className={styles.endPad} aria-hidden="true" />
        </Deck>
      </div>
    </div>
  )
}
