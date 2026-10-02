import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import { nearestReadyFrame, preloadFrames, type FrameSet } from '../../utils/framePreloader'
import { clamp01 } from '../../utils/scrollCrossfade'
import LoadingScreen from './LoadingScreen'
import styles from './CroissantScrollSequence.module.css'

/*
 * Scroll-scrubbed croissant shot: 120 frames cut from two AI videos the user
 * made (dough -> baking, baking -> wide hero shot), the same way the reference
 * (crussant.vercel.app) was built. Scroll position drives the frame (no scroll
 * hijacking). For a film-like feel the shown position eases after the wheel and
 * adjacent frames dissolve by the exact fractional position; at rest it settles
 * on a whole frame. Seam dissolve and camera smoothing are baked into the
 * frames (see CLAUDE.md), so the code draws them as-is plus a faint warm glow.
 */
const FRAME_COUNT = 120
const FRAME_ASPECT = 16 / 9

// Loading screen: first visit only, never longer than this.
const LOADING_MAX_MS = 6000
let framesLoadedOnce = false

// Portrait screens: cover would crop the croissant in the closest frames, so the
// frame is scaled to fit this croissant span (fraction of frame width).
const CROISSANT_SPAN = 0.58

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

function rangeProgress(value: number, from: number, to: number) {
  return clamp01((value - from) / (to - from))
}

// Film-like motion (user request: no stepping, no shake):
// - the shown position eases toward the scroll position (wheel notches jump
//   ~1.5 frames at once; easing turns them into continuous motion)
// - between two frames the next one dissolves in by the exact fractional
//   position
// - once scrolling stops the shown position settles on a whole, crisp frame
const EASE_MS = 140
const IDLE_SNAP_MS = 160

// Warm glow follows the story: rises as the oven fire builds (progress 0.12),
// strongest while the croissant bakes in the flames (0.28-0.40), gone by 0.55.
function glowFor(p: number) {
  if (p <= 0.12 || p >= 0.55) return 0
  if (p < 0.28) return 0.12 * easeInOut(rangeProgress(p, 0.12, 0.28))
  if (p <= 0.4) return 0.12
  return 0.12 * (1 - easeInOut(rangeProgress(p, 0.4, 0.55)))
}

// Text beats (timed like the reference): trapezoid fade + linear ramp.
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
  const dir = window.innerWidth <= 900 ? 'frames/m' : 'frames'
  return Array.from({ length: FRAME_COUNT }, (_, i) => asset(`${dir}/frame-${String(i + 1).padStart(3, '0')}.webp`))
}

interface Box {
  x: number
  y: number
  w: number
  h: number
}

// One base box for every frame (viewport-only), like object-fit: cover with
// object-position 50% 52% (desktop) / 54% (mobile). Portrait: fit the croissant.
function baseBox(vw: number, vh: number): Box {
  const posY = vw < 768 ? 0.54 : 0.52
  const coverW = Math.max(vw, vh * FRAME_ASPECT)
  let w = coverW
  if (vh > vw) {
    const containW = Math.min(vw, vh * FRAME_ASPECT)
    w = Math.max(containW, Math.min(coverW, (vw * 1.04) / CROISSANT_SPAN))
  }
  const h = w / FRAME_ASPECT
  return { x: (vw - w) * 0.5, y: (vh - h) * posY, w, h }
}

function isDebug() {
  const q = window.location.search + '&' + (window.location.hash.split('?')[1] ?? '')
  return /(^|[?&])debug=1(&|$)/.test(q)
}

export default function CroissantScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const debugRef = useRef<HTMLPreElement>(null)
  const segRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const [debug] = useState(isDebug)
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ink = '#1a100b'
    const inkClear = 'rgba(26, 16, 11, 0)'
    let vw = 0
    let vh = 0
    let box: Box = { x: 0, y: 0, w: 0, h: 0 }
    let frames: FrameSet | null = null
    let shown = -1 // displayed frame position (fractional), eases toward the scroll
    let drawnKey = ''
    let lastScrollAt = 0
    let lastFrameAt = 0
    let lastScrollY = window.scrollY
    let speed = 0
    let loaded = 0

    function drawFrame(index: number, alpha: number) {
      ctx!.globalAlpha = alpha
      ctx!.drawImage(frames!.images[index], box.x, box.y, box.w, box.h)
      ctx!.globalAlpha = 1
      return { cy: box.y + box.h / 2, h: box.h }
    }

    function draw(pos: number) {
      if (!frames || !ctx) return
      const lo = Math.min(FRAME_COUNT - 1, Math.floor(pos))
      const base = nearestReadyFrame(frames, lo)
      if (base === -1) return
      const hi = Math.min(FRAME_COUNT - 1, lo + 1)
      // dissolve amount into the next frame (only when both are really loaded).
      // smoothstep: passes quickly through the 50/50 mix, where two AI frames
      // with slightly different outlines would read as a double edge
      const t = pos - lo
      const mix = base === lo && hi !== lo && frames.ready[hi] ? t * t * (3 - 2 * t) : 0
      const key = `${vw}x${vh}|${base}|${mix.toFixed(3)}`
      if (key === drawnKey) return
      drawnKey = key

      ctx.fillStyle = ink
      ctx.fillRect(0, 0, vw, vh)
      const { cy, h } = drawFrame(base, 1)
      if (mix > 0.002) drawFrame(hi, mix)

      // portrait band: the photo's top/bottom edges dissolve into the ground
      if (box.h < vh - 1) {
        const top = cy - h / 2
        const bottom = cy + h / 2
        const fade = h * 0.16
        for (const [from, to] of [[top, top + fade], [bottom, bottom - fade]] as const) {
          const g = ctx.createLinearGradient(0, from, 0, to)
          g.addColorStop(0, ink)
          g.addColorStop(1, inkClear)
          ctx.fillStyle = g
          ctx.fillRect(0, Math.min(from, to) - 1, vw, fade + 2)
        }
      }

      if (glowRef.current) glowRef.current.style.opacity = reduced ? '0' : glowFor(pos / (FRAME_COUNT - 1)).toFixed(3)
    }

    function applyText(p: number) {
      const s = segRefs.current
      const set = (el: HTMLDivElement | null, opacity: number, transform: string) => {
        if (!el) return
        el.style.opacity = opacity.toFixed(3)
        el.style.transform = transform
        el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden'
      }
      const o1 = trap(p, 0, 0.04, 0.14, 0.2), e1 = ramp(p, 0, 0.2)
      set(s[0], o1, `translate(-50%, -50%) translateY(${(1 - o1) * 20 - e1 * 15}px) scale(${1.02 - e1 * 0.04})`)
      const sideBase = vw <= 768 ? 'translate(-50%, -50%)' : 'translateY(-50%)'
      const o2 = trap(p, 0.23, 0.3, 0.42, 0.49), e2 = ramp(p, 0.23, 0.49)
      set(s[1], o2, `${sideBase} translateY(${15 - e2 * 30}px) translateX(${(1 - o2) * -30}px)`)
      const o3 = trap(p, 0.51, 0.58, 0.68, 0.75), e3 = ramp(p, 0.51, 0.75)
      set(s[2], o3, `${sideBase} translateY(${15 - e3 * 30}px) translateX(${(1 - o3) * 30}px)`)
      const o4 = p < 0.77 ? 0 : p < 0.98 ? Math.min(1, (p - 0.77) / 0.12) : Math.max(0, 1 - (p - 0.98) / 0.02)
      const e4 = ramp(p, 0.77, 0.98)
      set(s[3], o4, `translate(-50%, -50%) translateY(${(1 - o4) * 30}px) scale(${1.04 - e4 * 0.04})`)
      if (s[3]) s[3].style.pointerEvents = o4 > 0.4 ? 'auto' : 'none'
    }

    // progress over (FRAME_COUNT - 1) * pixelsPerFrame of scroll; the section's
    // last 100vh is a tail that holds frame-067 while the next section slides over
    function readProgress() {
      const sectionTop = section!.getBoundingClientRect().top + window.scrollY
      const scrollable = section!.offsetHeight - 2 * window.innerHeight
      if (scrollable <= 0) return 1
      return Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollable))
    }

    function tick(now: number) {
      rafRef.current = null
      const progress = reduced ? 1 : readProgress()
      const last = FRAME_COUNT - 1
      let target = progress * last
      const idle = now - lastScrollAt > IDLE_SNAP_MS
      // at rest, settle on a whole frame so the still image is crisp
      if (idle) target = Math.round(target)

      const dt = lastFrameAt ? Math.min(64, now - lastFrameAt) : 16
      lastFrameAt = now
      if (shown < 0 || reduced) shown = target
      else shown += (target - shown) * (1 - Math.exp(-dt / EASE_MS))
      if (Math.abs(target - shown) < 0.002) shown = target

      draw(shown)
      applyText(reduced ? 0.9 : shown / last)

      if (debugRef.current) {
        speed = speed * 0.7 + ((window.scrollY - lastScrollY) / Math.max(1, dt)) * 1000 * 0.3
        lastScrollY = window.scrollY
        debugRef.current.textContent =
          `frame    ${String(Math.round(shown) + 1).padStart(3, '0')} / ${FRAME_COUNT}  (pos ${(shown + 1).toFixed(2)})\n` +
          `progress ${progress.toFixed(4)}\n` +
          `speed    ${Math.round(speed)} px/s\n` +
          `loaded   ${loaded} / ${FRAME_COUNT}\n` +
          `canvas   ${canvas!.width} x ${canvas!.height}`
      }

      // keep animating while easing, and until the idle snap has happened
      if (shown !== target || !idle) rafRef.current = requestAnimationFrame(tick)
      else lastFrameAt = 0
    }

    function requestTick() {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick)
    }

    function onScroll() {
      lastScrollAt = performance.now()
      requestTick()
    }

    function resize() {
      vw = canvas!.clientWidth
      vh = canvas!.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(vw * dpr)
      canvas!.height = Math.round(vh * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'
      box = baseBox(vw, vh)
      drawnKey = ''
      if (shown >= 0) draw(shown)
    }

    const preload = preloadFrames(
      frameUrls(),
      () => {
        loaded++
        // a newly loaded frame may be the one on screen (or its dissolve partner)
        drawnKey = ''
        if (shown >= 0) draw(shown)
        requestTick()
      },
      (settled, total) => {
        setLoadPct(Math.round((settled / total) * 100))
        if (settled === total) {
          framesLoadedOnce = true
          setLoading(false)
        }
      },
    )
    frames = preload.frames

    const ro = new ResizeObserver(() => {
      resize()
      requestTick()
    })
    ro.observe(canvas)
    resize()
    requestTick()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('orientationchange', requestTick)
    return () => {
      preload.cancel()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('orientationchange', requestTick)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      // reset so a remount (StrictMode) can schedule its own first tick
      rafRef.current = null
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
        <div className={styles.glow} ref={glowRef} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />
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
        {debug && <pre className={styles.debug} ref={debugRef} />}
      </div>
    </section>
  )
}
