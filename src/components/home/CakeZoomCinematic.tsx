import { useEffect, useRef, useState } from 'react'
import { asset } from '../../utils/asset'
import { clamp01, computeBoundaries, crossfadeOpacity, kenBurnsScale } from '../../utils/scrollCrossfade'
import styles from './CakeZoomCinematic.module.css'

const PHOTOS = [
  'images/cake-zoom/photo-01.webp',
  'images/cake-zoom/photo-02.webp',
  'images/cake-zoom/photo-03.webp',
  'images/cake-zoom/photo-04.webp',
  'images/cake-zoom/photo-05.webp',
  'images/cake-zoom/photo-06.webp',
]

const CROSSFADE = 0.04
const MAX_SCALE = 1.1
const BOUNDARIES = computeBoundaries(PHOTOS.map(() => 1))

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CakeZoomCinematic() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    for (const src of PHOTOS) {
      const img = new Image()
      img.src = asset(src)
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount >= PHOTOS.length && !cancelled) setReady(true)
      }
    }
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready || reduced) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    function onScroll() {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const rect = wrapper!.getBoundingClientRect()
        const viewportH = window.innerHeight
        const scrollable = rect.height - viewportH
        const progress = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0
        imgRefs.current.forEach((img, i) => {
          if (!img) return
          img.style.opacity = String(crossfadeOpacity(i, PHOTOS.length, BOUNDARIES, progress, CROSSFADE))
          img.style.transform = `scale(${kenBurnsScale(i, BOUNDARIES, progress, MAX_SCALE)})`
        })
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [ready, reduced])

  return (
    <div className={styles.wrapper} ref={wrapperRef} aria-label="צלילה קולנועית לתוך עוגת השוקולד של דניאל בייקרי">
      <div className={styles.sticky}>
        {!ready ? (
          <img className={styles.photo} src={asset(PHOTOS[0])} alt="" />
        ) : (
          PHOTOS.map((src, i) => (
            <img
              key={src}
              ref={(el) => {
                imgRefs.current[i] = el
              }}
              className={styles.photo}
              src={asset(src)}
              alt=""
              style={reduced ? { opacity: i === PHOTOS.length - 1 ? 1 : 0 } : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
}
