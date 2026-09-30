import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import { ChevronIcon } from '../icons'
import styles from './CinematicHero.module.css'

interface Chapter {
  startFrame: number
  endFrame: number
  title: string
  subtitle: string
}

const TOTAL_FRAMES = 105

const CHAPTERS: Chapter[] = [
  { startFrame: 1, endFrame: 30, title: 'קמח, ביצה, שוקולד', subtitle: 'כל מרכיב נכנס לקערה באהבה, עוד לפני שהתחלנו' },
  { startFrame: 31, endFrame: 80, title: 'ישר מהתנור', subtitle: 'זהובות, חמות, בדיוק ברגע הנכון' },
  { startFrame: 81, endFrame: 105, title: 'שוקולד עשיר נמס בפנים', subtitle: 'זה הטעם של דניאל בייקרי' },
]

function framePath(index: number): string {
  const padded = String(index).padStart(4, '0')
  return asset(`images/cinematic/frame-${padded}.webp`)
}

function chapterIndexForFrame(frame: number): number {
  const idx = CHAPTERS.findIndex((c) => frame >= c.startFrame && frame <= c.endFrame)
  return idx === -1 ? CHAPTERS.length - 1 : idx
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameIndexRef = useRef(1)
  const rafRef = useRef<number | null>(null)

  const [ready, setReady] = useState(false)
  const [frameIndex, setFrameIndex] = useState(1)
  const [scrolled, setScrolled] = useState(false)
  const reduced = prefersReducedMotion()

  // Preload all frames
  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES + 1)
    let loadedCount = 0

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = framePath(i)
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount >= TOTAL_FRAMES && !cancelled) {
          imagesRef.current = images
          setReady(true)
        }
      }
      images[i] = img
    }
    imagesRef.current = images

    return () => {
      cancelled = true
    }
  }, [])

  // Draw a given frame to canvas, cover-fit
  function drawFrame(index: number) {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const dw = iw * scale
    const dh = ih * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  // Size canvas to sticky container
  useEffect(() => {
    if (!ready || reduced) return
    const canvas = canvasRef.current
    const sticky = stickyRef.current
    if (!canvas || !sticky) return

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = sticky!.getBoundingClientRect()
      canvas!.width = Math.round(rect.width * dpr)
      canvas!.height = Math.round(rect.height * dpr)
      drawFrame(frameIndexRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced])

  // Scroll-driven scrubbing
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
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
        const next = 1 + Math.round(progress * (TOTAL_FRAMES - 1))
        if (next !== frameIndexRef.current) {
          frameIndexRef.current = next
          setFrameIndex(next)
          drawFrame(next)
        }
        if (progress > 0.02 && !scrolled) setScrolled(true)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced])

  const effectiveFrame = reduced ? TOTAL_FRAMES : frameIndex
  const activeChapter = chapterIndexForFrame(effectiveFrame)
  const ctaVisible = effectiveFrame >= TOTAL_FRAMES - 5

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.sticky} ref={stickyRef}>
        {!ready || reduced ? (
          <img className={styles.poster} src={framePath(reduced ? TOTAL_FRAMES : 1)} alt="" />
        ) : (
          <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
        )}
        <div className={styles.overlay} />

        <div className={`${styles.content} ${ctaVisible ? styles.contentHidden : ''}`}>
          <div className={styles.brand}>
            <span className={styles.brandMain}>Daniel Bakery</span>
            <span className={styles.brandSub}>דניאל בייקרי</span>
          </div>

          <div className={styles.captionArea}>
            {CHAPTERS.map((chapter, i) => (
              <div
                key={chapter.title}
                className={`${styles.caption} ${i === activeChapter ? styles.captionActive : ''}`}
              >
                <div className={styles.captionTitle}>{chapter.title}</div>
                <div className={styles.captionSubtitle}>{chapter.subtitle}</div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.dots} aria-hidden="true">
              {CHAPTERS.map((chapter, i) => (
                <span key={chapter.title} className={`${styles.dot} ${i === activeChapter ? styles.dotActive : ''}`} />
              ))}
            </div>
            <div className={`${styles.scrollHint} ${scrolled ? styles.scrollHintHidden : ''}`}>
              <span>גללו</span>
              <span className={styles.scrollArrow}>
                <ChevronIcon size={16} className={styles.scrollArrowIcon} />
              </span>
            </div>
          </div>
        </div>

        <div className={`${styles.ctaOverlay} ${ctaVisible || reduced ? styles.ctaOverlayVisible : ''}`}>
          <div className={styles.ctaInner}>
            <span className={styles.ctaTagline}>מתוק יותר כשזה נאפה באהבה</span>
            <Link to="/products" className="btn btn-primary">
              לכל המוצרים
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
