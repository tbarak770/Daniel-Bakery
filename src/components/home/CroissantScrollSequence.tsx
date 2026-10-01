import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import { nearestReadyFrame, preloadFrames, type FrameSet } from '../../utils/framePreloader'
import { clamp01 } from '../../utils/scrollCrossfade'
import LoadingScreen from './LoadingScreen'
import styles from './CroissantScrollSequence.module.css'

// Loading screen: shown on the first visit only (frames are browser-cached
// afterwards), never longer than this, so a slow connection is never stuck.
const LOADING_MAX_MS = 6000
let framesLoadedOnce = false

// Frames are generated from source-frames/croissant/*.png (see CLAUDE.md).
// FRAME_COUNT must match the number of exported web frames.
const FRAME_COUNT = 33
const FRAME_ASPECT = 16 / 9

// Where the croissant sits inside every (aligned) frame, as fractions of the image.
const FOCAL = { x0: 0.31, x1: 0.78, y0: 0.42, y1: 0.9 }
const FOCAL_CX = (FOCAL.x0 + FOCAL.x1) / 2
const FOCAL_CY = (FOCAL.y0 + FOCAL.y1) / 2

// Direction (timed like crussant.vercel.app, measured side by side with its 80 frames).
// Baking: which frame (1-based) is reached at each scroll progress. Like the
// reference, the pastry stays pale until ~0.2, is pale-golden at 0.5, light
// golden-brown at 0.75 and fully baked at ~0.9; the rest is the hero shot.
const BAKE_KEYS: [number, number][] = [
  [0, 1],
  [0.2, 5],
  [0.5, 14],
  [0.75, 25],
  [0.9, FRAME_COUNT],
  [1, FRAME_COUNT],
]

// Camera keyframes [progress, zoom, croissant screen-x, croissant screen-y].
// Zoom 1 = frame covers the viewport; < 1 = wider than the photo, edges fade to dark.
// Reference (croissant width on screen): 26% -> 33% -> 38% -> 40% (peak ~0.6)
// -> 29% -> 21%, centred at x 0.51-0.52, y 0.66-0.75 (tilts up at the end).
// Our photos are framed ~2x closer, so the same push-in / pull-back shape is
// compressed into the range the photos allow (croissant ~43% -> 57% -> 38%).
const CAMERA_KEYS: [number, number, number, number][] = [
  [0, 0.82, 0.5, 0.68],
  [0.2, 0.93, 0.5, 0.67],
  [0.4, 1.03, 0.5, 0.66],
  [0.6, 1.06, 0.5, 0.68],
  [0.8, 0.9, 0.5, 0.73],
  [1, 0.72, 0.5, 0.72],
]

// Displayed progress eases toward the scroll position with this time constant,
// so wheel steps don't jerk the camera; it settles within ~0.3s of stopping.
const SMOOTH_MS = 70

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function bakeFrameAt(p: number): number {
  for (let i = 1; i < BAKE_KEYS.length; i++) {
    const [p0, f0] = BAKE_KEYS[i - 1]
    const [p1, f1] = BAKE_KEYS[i]
    if (p <= p1) return lerp(f0, f1, (p - p0) / (p1 - p0)) - 1
  }
  return FRAME_COUNT - 1
}

// Catmull-Rom through the camera keys: smooth, no stops at keyframes.
function cameraAt(p: number): { zoom: number; sx: number; sy: number } {
  const k = CAMERA_KEYS
  let i = 1
  while (i < k.length - 1 && p > k[i][0]) i++
  const p0 = k[Math.max(0, i - 2)], p1 = k[i - 1], p2 = k[i], p3 = k[Math.min(k.length - 1, i + 1)]
  const t = clamp01((p - p1[0]) / (p2[0] - p1[0]))
  const cr = (j: number) => {
    const a = p0[j], b = p1[j], c = p2[j], d = p3[j]
    return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)
  }
  return { zoom: cr(1), sx: cr(2), sy: cr(3) }
}

// Reference text curves: trapezoid fade + linear ramp.
function trap(p: number, a: number, b: number, c: number, d: number) {
  if (p <= a || p >= d) return 0
  if (p < b) return (p - a) / (b - a)
  if (p <= c) return 1
  return 1 - (p - c) / (d - c)
}
function ramp(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a))
}

function frameUrls(): string[] {
  const dir = window.innerWidth <= 900 ? 'images/croissant/m' : 'images/croissant'
  return Array.from({ length: FRAME_COUNT }, (_, i) =>
    asset(`${dir}/frame-${String(i + 1).padStart(2, '0')}.webp`),
  )
}

// Width of the frame at zoom 1. Landscape: cover. Portrait: the reference simply
// covers (and crops the pastry); we scale so the croissant spans about the full
// screen width at the peak of the push-in, keeping it whole.
function baseWidth(vw: number, vh: number): number {
  const coverW = Math.max(vw, vh * FRAME_ASPECT)
  if (vw >= vh) return coverW
  const containW = Math.min(vw, vh * FRAME_ASPECT)
  const focalFitW = (vw * 1.12) / (FOCAL.x1 - FOCAL.x0)
  return Math.max(containW, Math.min(coverW, focalFitW))
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CroissantScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const segRefs = useRef<(HTMLDivElement | null)[]>([])
  const framesRef = useRef<FrameSet | null>(null)
  const shownRef = useRef(-1)
  const targetRef = useRef(0)
  const lastDrawnRef = useRef('')
  const rafRef = useRef<number | null>(null)
  const [loadPct, setLoadPct] = useState(0)
  const [loading, setLoading] = useState(
    () => !framesLoadedOnce && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!loading) return
    const id = window.setTimeout(() => setLoading(false), LOADING_MAX_MS)
    return () => window.clearTimeout(id)
  }, [loading])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const reduced = prefersReducedMotion()
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim() || '#140c08'
    const inkClear = 'rgba(20, 12, 8, 0)'
    let vw = 0
    let vh = 0
    let lastTime = 0

    function draw(p: number) {
      const frames = framesRef.current
      if (!frames || !ctx) return
      // clean switch to the nearest frame, like the reference: blending adjacent
      // AI frames ghosts wherever the pastry's outline changes between them
      const index = nearestReadyFrame(frames, Math.round(bakeFrameAt(p)))
      if (index === -1) return
      const cam = cameraAt(p)

      // quarter-pixel grid: the same scroll position always paints the exact same
      // image (forward or reverse), and sub-pixel jitter never triggers a redraw
      const q = (n: number) => Math.round(n * 4) / 4
      const w = q(baseWidth(vw, vh) * cam.zoom)
      const h = q(w / FRAME_ASPECT)
      const portrait = vh > vw
      let x = cam.sx * vw - FOCAL_CX * w
      let y = (portrait ? 0.6 : cam.sy) * vh - FOCAL_CY * h
      // when the photo covers the screen, never reveal its edges; when it is
      // narrower (wide shots) keep the croissant on its mark, edges fade out below
      if (w >= vw) x = Math.min(0, Math.max(vw - w, x))
      if (h >= vh) y = Math.min(0, Math.max(vh - h, y))
      x = q(x)
      y = q(y)

      const key = `${vw}x${vh}|${index}|${x}|${y}|${w}`
      if (key === lastDrawnRef.current) return
      lastDrawnRef.current = key

      ctx.fillStyle = ink
      ctx.fillRect(0, 0, vw, vh)
      ctx.drawImage(frames.images[index], x, y, w, h)

      // photo edges inside the screen dissolve into the dark (the "wide" shots)
      const fade = Math.min(w, h) * 0.14
      const edges: [number, number, number, number, boolean][] = [
        [x, 0, x + fade, 0, x > 0.5],
        [x + w, 0, x + w - fade, 0, x + w < vw - 0.5],
        [0, y, 0, y + fade, y > 0.5],
        [0, y + h, 0, y + h - fade, y + h < vh - 0.5],
      ]
      for (const [x0, y0, x1, y1, visible] of edges) {
        if (!visible) continue
        const g = ctx.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, ink)
        g.addColorStop(1, inkClear)
        ctx.fillStyle = g
        ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0) || vw, Math.abs(y1 - y0) || vh)
      }

      // reference vignette
      const r = Math.max(vw, vh * 0.8)
      const v = ctx.createRadialGradient(vw / 2, vh / 2, r * 0.35, vw / 2, vh / 2, r * 0.8)
      v.addColorStop(0, 'rgba(0, 0, 0, 0.15)')
      v.addColorStop(1, 'rgba(0, 0, 0, 0.65)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, vw, vh)
    }

    function applyText(p: number) {
      const s = segRefs.current
      const set = (el: HTMLDivElement | null, opacity: number, transform: string) => {
        if (!el) return
        el.style.opacity = opacity.toFixed(3)
        el.style.transform = transform
        el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden'
      }
      // 1. opening, centre
      const o1 = trap(p, 0, 0.04, 0.14, 0.2), e1 = ramp(p, 0, 0.2)
      set(s[0], o1, `translate(-50%, -50%) translateY(${(1 - o1) * 20 - e1 * 15}px) scale(${1.02 - e1 * 0.04})`)
      // side segments are centred on narrow screens (see CSS)
      const sideBase = vw <= 768 ? 'translate(-50%, -50%)' : 'translateY(-50%)'
      // 2. left
      const o2 = trap(p, 0.23, 0.3, 0.42, 0.49), e2 = ramp(p, 0.23, 0.49)
      set(s[1], o2, `${sideBase} translateY(${15 - e2 * 30}px) translateX(${(1 - o2) * -30}px)`)
      // 3. right
      const o3 = trap(p, 0.51, 0.58, 0.68, 0.75), e3 = ramp(p, 0.51, 0.75)
      set(s[2], o3, `${sideBase} translateY(${15 - e3 * 30}px) translateX(${(1 - o3) * 30}px)`)
      // 4. closing, centre + CTA (fades out just before the next section slides in)
      const o4 = p < 0.77 ? 0 : p < 0.98 ? Math.min(1, (p - 0.77) / 0.12) : Math.max(0, 1 - (p - 0.98) / 0.02)
      const e4 = ramp(p, 0.77, 0.98)
      set(s[3], o4, `translate(-50%, -50%) translateY(${(1 - o4) * 30}px) scale(${1.04 - e4 * 0.04})`)
      if (s[3]) s[3].style.pointerEvents = o4 > 0.4 ? 'auto' : 'none'
    }

    function readProgress() {
      const rect = section!.getBoundingClientRect()
      // last 100vh of the section is the tail where the next section slides over
      const scrollable = rect.height - 2 * window.innerHeight
      return scrollable > 0 ? clamp01(-rect.top / scrollable) : 1
    }

    function tick(now: number) {
      rafRef.current = null
      const target = reduced ? 1 : readProgress()
      targetRef.current = target
      const dt = lastTime ? Math.min(64, now - lastTime) : 16
      lastTime = now
      let shown = shownRef.current < 0 ? target : shownRef.current
      shown += (target - shown) * (1 - Math.exp(-dt / SMOOTH_MS))
      if (Math.abs(target - shown) < 0.0004) shown = target
      shownRef.current = shown
      draw(shown)
      // reduced motion: static hero frame with the closing text visible
      applyText(reduced ? 0.9 : shown)
      if (shown !== target) rafRef.current = requestAnimationFrame(tick)
      else lastTime = 0
    }

    function requestTick() {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick)
    }

    function resize() {
      vw = canvas!.clientWidth
      vh = canvas!.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(vw * dpr)
      canvas!.height = Math.round(vh * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.imageSmoothingQuality = 'high'
      lastDrawnRef.current = ''
      if (shownRef.current >= 0) draw(shownRef.current)
    }

    const { frames, cancel } = preloadFrames(
      frameUrls(),
      () => {
        lastDrawnRef.current = ''
        if (shownRef.current >= 0) draw(shownRef.current)
      },
      (settled, total) => {
        setLoadPct(Math.round((settled / total) * 100))
        if (settled === total) {
          framesLoadedOnce = true
          setLoading(false)
        }
      },
    )
    framesRef.current = frames

    const ro = new ResizeObserver(() => {
      resize()
      requestTick()
    })
    ro.observe(canvas)
    resize()
    requestTick()

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('orientationchange', requestTick)
    return () => {
      cancel()
      ro.disconnect()
      window.removeEventListener('scroll', requestTick)
      window.removeEventListener('orientationchange', requestTick)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      // reset so a remount (StrictMode) can schedule its own first tick
      rafRef.current = null
      shownRef.current = -1
      lastDrawnRef.current = ''
    }
  }, [])

  const seg = (i: number) => (el: HTMLDivElement | null) => {
    segRefs.current[i] = el
  }

  return (
    <section className={styles.section} ref={sectionRef} aria-label="קרואסון נאפה">
      <LoadingScreen progress={loadPct} hidden={!loading} />
      <div className={styles.stage}>
        <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
        <div className={`${styles.segment} ${styles.center}`} ref={seg(0)}>
          <h2 className={styles.headline}>האפייה המושלמת</h2>
          <p className={styles.subtext}>מאפים בעבודת יד, נאפים טריים במיוחד בשבילכם.</p>
        </div>
        <div className={`${styles.segment} ${styles.left}`} ref={seg(1)}>
          <h2 className={styles.headline}>
            הזמן הוא
            <br />
            המרכיב הסודי
          </h2>
          <p className={styles.subtext}>בצק שמקבל את הזמן שלו לתפוח, שכבה אחרי שכבה.</p>
        </div>
        <div className={`${styles.segment} ${styles.right}`} ref={seg(2)}>
          <h2 className={styles.headline}>
            בלי קיצורי
            <br />
            דרך
          </h2>
          <p className={styles.subtext}>חומרי גלם איכותיים, סבלנות, והרבה אהבה בכל מאפה.</p>
        </div>
        <div className={`${styles.segment} ${styles.center} ${styles.final}`} ref={seg(3)}>
          <h2 className={styles.headline}>טעם של בית</h2>
          <p className={styles.subtext}>נאפה באהבה על ידי דניאל, טרי מהתנור.</p>
          <Link to="/products" className={`btn btn-primary ${styles.cta}`}>
            לכל המוצרים
          </Link>
        </div>
      </div>
    </section>
  )
}
