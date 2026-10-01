import { useEffect, useRef } from 'react'
import { asset } from '../../utils/asset'
import { nearestReadyFrame, preloadFrames, type FrameSet } from '../../utils/framePreloader'
import { clamp01 } from '../../utils/scrollCrossfade'
import styles from './CroissantScrollSequence.module.css'

// Frames are generated from source-frames/croissant/*.png (see CLAUDE.md).
// FRAME_COUNT must match the number of exported web frames.
const FRAME_COUNT = 33
const FRAME_ASPECT = 16 / 9

// Final share of the scroll that stays on the last (hero) frame, so the
// finished croissant "breathes" before the section releases.
const HERO_HOLD = 0.05

// Where the croissant sits inside every (aligned) frame, as fractions of the
// image. Used on portrait screens so the pastry is never cropped.
const FOCAL = { x0: 0.31, x1: 0.78, y0: 0.42, y1: 0.9 }

const HEADLINE_FROM = 0.84
const HEADLINE_TO = 0.96

function frameUrls(): string[] {
  const dir = window.innerWidth <= 900 ? 'images/croissant/m' : 'images/croissant'
  return Array.from({ length: FRAME_COUNT }, (_, i) =>
    asset(`${dir}/frame-${String(i + 1).padStart(2, '0')}.webp`),
  )
}

function frameForProgress(p: number): number {
  const t = clamp01(p / (1 - HERO_HOLD))
  return Math.round(t * (FRAME_COUNT - 1))
}

interface Layout {
  x: number
  y: number
  w: number
  h: number
}

// One layout for ALL frames (computed from viewport only), so the croissant
// never shifts between frames. Landscape: cover. Portrait: scale so the
// croissant fits the width, never below "contain", never above "cover".
function computeLayout(vw: number, vh: number): Layout {
  const cover = Math.max(vw / FRAME_ASPECT, vh) / vh
  const coverW = vh * cover * FRAME_ASPECT
  const containW = Math.min(vw, vh * FRAME_ASPECT)
  const focalFitW = (vw * 0.94) / (FOCAL.x1 - FOCAL.x0)
  const w = Math.max(containW, Math.min(coverW, focalFitW))
  const h = w / FRAME_ASPECT

  const focalCx = ((FOCAL.x0 + FOCAL.x1) / 2) * w
  let x = vw / 2 - (w < vw ? w / 2 : focalCx)
  x = Math.min(0, Math.max(vw - w, x))
  if (w < vw) x = (vw - w) / 2

  let y: number
  if (h >= vh) {
    y = (vh - h) / 2
    // keep the bottom of the croissant on screen on very wide viewports
    const focalBottom = FOCAL.y1 * h + y
    if (focalBottom > vh * 0.97) y -= focalBottom - vh * 0.97
    y = Math.min(0, Math.max(vh - h, y))
  } else {
    // portrait: image band sits a bit below centre, headline lives above it
    y = Math.min(vh - h, Math.max(0, vh * 0.58 - h / 2))
  }
  return { x, y, w, h }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CroissantScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<FrameSet | null>(null)
  const currentFrameRef = useRef(-1)
  const targetFrameRef = useRef(0)
  const progressRef = useRef(0)
  const layoutRef = useRef<Layout | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const reduced = prefersReducedMotion()
    const inkColor = getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim() || '#140c08'

    function draw(force = false) {
      const frames = framesRef.current
      const layout = layoutRef.current
      if (!frames || !layout || !ctx) return
      const index = nearestReadyFrame(frames, targetFrameRef.current)
      // keep the last valid frame until something closer is ready: never blank
      if (index === -1 || (index === currentFrameRef.current && !force)) return
      currentFrameRef.current = index

      const { x, y, w, h } = layout
      ctx.fillStyle = inkColor
      ctx.fillRect(0, 0, canvas!.clientWidth, canvas!.clientHeight)
      ctx.drawImage(frames.images[index], x, y, w, h)

      // portrait band: fade the photo's top/bottom edges into the page colour
      if (h < canvas!.clientHeight - 1) {
        const fade = Math.min(80, h * 0.18)
        for (const [from, to] of [[y, y + fade], [y + h, y + h - fade]] as const) {
          const g = ctx.createLinearGradient(0, from, 0, to)
          g.addColorStop(0, inkColor)
          g.addColorStop(1, 'rgba(20, 12, 8, 0)')
          ctx.fillStyle = g
          ctx.fillRect(x, Math.min(from, to), w, fade)
        }
      }
    }

    function resize() {
      const vw = canvas!.clientWidth
      const vh = canvas!.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(vw * dpr)
      canvas!.height = Math.round(vh * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.imageSmoothingQuality = 'high'
      layoutRef.current = computeLayout(vw, vh)
      draw(true)
    }

    function readProgress() {
      const rect = section!.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      return scrollable > 0 ? clamp01(-rect.top / scrollable) : 1
    }

    function update() {
      rafRef.current = null
      const p = reduced ? 1 : readProgress()
      progressRef.current = p
      targetFrameRef.current = reduced ? FRAME_COUNT - 1 : frameForProgress(p)
      draw()
      const headline = headlineRef.current
      if (headline) {
        const t = clamp01((p - HEADLINE_FROM) / (HEADLINE_TO - HEADLINE_FROM))
        headline.style.opacity = String(t)
        headline.style.transform = `translateY(${(1 - t) * 16}px)`
      }
    }

    function requestUpdate() {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(update)
    }

    const { frames, cancel } = preloadFrames(frameUrls(), (i) => {
      // redraw only if the newly ready frame is closer to what scroll wants
      const want = targetFrameRef.current
      if (Math.abs(i - want) < Math.abs(currentFrameRef.current - want) || currentFrameRef.current === -1) {
        draw(true)
      }
    })
    framesRef.current = frames

    const ro = new ResizeObserver(() => {
      resize()
      requestUpdate()
    })
    ro.observe(canvas)
    resize()
    update()

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('orientationchange', requestUpdate)
    return () => {
      cancel()
      ro.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('orientationchange', requestUpdate)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section className={styles.section} ref={sectionRef} aria-label="קרואסון נאפה">
      <div className={styles.stage}>
        <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
        <div className={styles.headline} ref={headlineRef}>
          <h2 className={styles.title}>הזמן הוא המרכיב הסודי</h2>
          <p className={styles.subtitle}>נאפה לאט, בסבלנות, עד הרגע המושלם</p>
        </div>
      </div>
    </section>
  )
}
