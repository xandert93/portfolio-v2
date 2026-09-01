/**
 * Scrolls a section into view without touching the URL — a plain
 * `<a href="#id">` triggers native anchor navigation, which pushes
 * `#id` onto the URL. Sections already carry `scroll-mt-*` for the
 * sticky navbar offset, and `scrollIntoView` respects `scroll-margin`
 * the same way anchor navigation does.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}
