import { useEffect, useRef, useState } from 'react'
import { asset } from '../../utils/asset'
import { clamp01, computeBoundaries, crossfadeOpacity, kenBurnsScale } from '../../utils/scrollCrossfade'
import { ChevronIcon } from '../icons'
import LastBite from './LastBite'
import styles from './CinematicHero.module.css'

interface Photo {
  src: string
  weight: number
}

interface Chapter {
  number: string
  title: string
  subtitle: string
  photoStart: number
  photoEnd: number
}

// Relative hold-time per photo. Chapters 2 & 3 (the oven + fresh-from-oven
// beats) get more weight so their captions have time to be read, per the
// "emphasize the story" request.
const PHOTOS: Photo[] = [
  { src: 'images/cinematic/photo-01.webp', weight: 1 },
  { src: 'images/cinematic/photo-02.webp', weight: 1 },
  { src: 'images/cinematic/photo-03.webp', weight: 1.6 },
  { src: 'images/cinematic/photo-04.webp', weight: 1.6 },
  { src: 'images/cinematic/photo-05.webp', weight: 1 },
  { src: 'images/cinematic/photo-06.webp', weight: 1 },
]

const CHAPTERS: Chapter[] = [
  {
    number: '01',
    title: 'קמח, ביצה, שוקולד',
    subtitle: 'כל מרכיב נכנס לקערה באהבה, עוד לפני שהתחלנו',
    photoStart: 0,
    photoEnd: 1,
  },
  {
    number: '02',
    title: 'לתנור, בסבלנות',
    subtitle: 'חום נמוך, המון זמן, בלי שום קיצורי דרך',
    photoStart: 2,
    photoEnd: 2,
  },
  {
    number: '03',
    title: 'ישר מהתנור',
    subtitle: 'זהובה, חמה, בדיוק ברגע הנכון',
    photoStart: 3,
    photoEnd: 3,
  },
  {
    number: '04',
    title: 'שוקולד עשיר נמס בפנים',
    subtitle: 'זה הטעם של דניאל בייקרי',
    photoStart: 4,
    photoEnd: 5,
  },
]

const CROSSFADE = 0.035
const MAX_SCALE = 1.07
const BOUNDARIES = computeBoundaries(PHOTOS.map((p) => p.weight))

function photoOpacity(index: number, progress: number): number {
  return crossfadeOpacity(index, PHOTOS.length, BOUNDARIES, progress, CROSSFADE)
}

function photoScale(index: number, progress: number): number {
  return kenBurnsScale(index, BOUNDARIES, progress, MAX_SCALE)
}

function chapterIndexForProgress(progress: number): number {
  let photoIndex = PHOTOS.length - 1
  for (let i = 0; i < PHOTOS.length; i++) {
    if (progress < BOUNDARIES[i + 1]) {
      photoIndex = i
      break
    }
  }
  const idx = CHAPTERS.findIndex((c) => photoIndex >= c.photoStart && photoIndex <= c.photoEnd)
  return idx === -1 ? CHAPTERS.length - 1 : idx
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const reduced = prefersReducedMotion()

  // Preload the 6 photos
  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    for (const photo of PHOTOS) {
      const img = new Image()
      img.src = asset(photo.src)
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount >= PHOTOS.length && !cancelled) setReady(true)
      }
    }
    return () => {
      cancelled = true
    }
  }, [])

  // Scroll-driven progress
  useEffect(() => {
    if (!ready || reduced) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    function applyProgress(p: number) {
      imgRefs.current.forEach((img, i) => {
        if (!img) return
        img.style.opacity = String(photoOpacity(i, p))
        img.style.transform = `scale(${photoScale(i, p)})`
      })
    }

    function onScroll() {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const rect = wrapper!.getBoundingClientRect()
        const viewportH = window.innerHeight
        const scrollable = rect.height - viewportH
        const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0
        setProgress(p)
        applyProgress(p)
        if (p > 0.02) setScrolled(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced])

  const effectiveProgress = reduced ? 1 : progress
  const activeChapter = chapterIndexForProgress(effectiveProgress)
  const ctaVisible = effectiveProgress >= 1 - CROSSFADE * 1.5

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.sticky}>
        {!ready ? (
          <img className={styles.photo} src={asset(PHOTOS[0].src)} alt="" />
        ) : (
          PHOTOS.map((photo, i) => (
            <img
              key={photo.src}
              ref={(el) => {
                imgRefs.current[i] = el
              }}
              className={styles.photo}
              src={asset(photo.src)}
              alt=""
              style={reduced ? { opacity: i === PHOTOS.length - 1 ? 1 : 0 } : undefined}
            />
          ))
        )}
        <div className={styles.overlay} />

        <div className={`${styles.content} ${ctaVisible ? styles.contentHidden : ''}`}>
          <div className={styles.captionArea}>
            <span className={styles.eyebrow}>הסיפור של עוגיית דניאל</span>
            <div className={styles.captionStack}>
              {CHAPTERS.map((chapter, i) => (
                <div key={chapter.title} className={`${styles.caption} ${i === activeChapter ? styles.captionActive : ''}`}>
                  <div className={styles.captionTitle}>{chapter.title}</div>
                  <div className={styles.captionSubtitle}>{chapter.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.chapters} aria-hidden="true">
              {CHAPTERS.map((chapter, i) => (
                <span key={chapter.number} className={`${styles.chapterNum} ${i === activeChapter ? styles.chapterNumActive : ''}`}>
                  {chapter.number}
                </span>
              ))}
            </div>
            <div className={`${styles.scrollHint} ${scrolled ? styles.scrollHintHidden : ''}`}>
              <span>גללו כדי להמשיך בסיפור</span>
              <span className={styles.scrollArrow}>
                <ChevronIcon size={16} className={styles.scrollArrowIcon} />
              </span>
            </div>
          </div>
        </div>

        {/* closing beat of the page, after the reference's "last bite" */}
        <div className={`${styles.ctaOverlay} ${ctaVisible || reduced ? styles.ctaOverlayVisible : ''}`}>
          <LastBite />
        </div>
      </div>
    </div>
  )
}
