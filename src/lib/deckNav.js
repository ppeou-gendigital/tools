/**
 * Pick the slide closest to the deck's left edge (scroll-snap start).
 * At max scroll, prefer the last slide (peek decks can't align it to the left).
 * @param {HTMLElement|null} deck
 * @param {string} [attr='data-slide']
 * @returns {string|null}
 */
export function activeSlideKeyFromDeck(deck, attr = 'data-slide') {
  if (!deck) return null
  const slides = [...deck.querySelectorAll(`[${attr}]`)]
  if (!slides.length) return null

  const maxScroll = deck.scrollWidth - deck.clientWidth
  if (maxScroll > 0 && deck.scrollLeft >= maxScroll - 2) {
    return slides[slides.length - 1].getAttribute(attr)
  }

  const left = deck.scrollLeft
  let bestKey = null
  let bestDist = Infinity
  for (const slide of slides) {
    const key = slide.getAttribute(attr)
    if (!key) continue
    const dist = Math.abs(slide.offsetLeft - left)
    if (dist < bestDist) {
      bestDist = dist
      bestKey = key
    }
  }
  return bestKey
}

/**
 * Scroll a deck to the slide with the given attribute value.
 * @returns {boolean}
 */
export function scrollDeckToSlide(deck, slideKey, attr = 'data-slide') {
  if (!deck || !slideKey) return false
  const slides = [...deck.querySelectorAll(`[${attr}]`)]
  const slide = slides.find(
    (el) => el.getAttribute(attr) === slideKey,
  )
  if (!(slide instanceof HTMLElement)) return false

  // Last slide: jump to max scroll so peek decks can activate it.
  if (slide === slides[slides.length - 1]) {
    deck.scrollLeft = Math.max(0, deck.scrollWidth - deck.clientWidth)
    return true
  }

  deck.scrollLeft = slide.offsetLeft
  return true
}
