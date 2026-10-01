import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import { nearestReadyFrame, preloadFrames, type FrameSet } from '../../utils/framePreloader'
import { clamp01 } from '../../utils/scrollCrossfade'
import LoadingScreen from './LoadingScreen'
import styles from './CroissantScrollSequence.module.css'

/*
 * Scroll-scrubbed croissant shot: 67 frames driven by the scroll position (no
 * scroll hijacking). The frames carry the camera move (push-in while proofing/
 * baking, pull-out to the wide hero shot). For a film-like feel the shown
 * position eases after the wheel and adjacent frames dissolve by the exact
 * fractional position; at rest it settles on a whole frame. The code also
 * stabilises each frame and adds a faint warm glow. See CLAUDE.md.
 */
const FRAME_COUNT = 67
const FRAME_ASPECT = 16 / 9

// Loading screen: first visit only, never longer than this.
const LOADING_MAX_MS = 6000
let framesLoadedOnce = false

// Stabilisation, measured offline from the frames themselves (adjacent-frame
// motion -> smoothed camera path). Per frame: [scale, shiftX, shiftY], shifts
// in frame-width units. Clamped to the brief: scale 1/1.025..1.025, |shift| <= 6px.
const CAMERA_CORRECTION: [number, number, number][] = [
  [1.0067, 0.00093, -0.00116], [1.006, 0.00166, -0.00193], [0.9758, -0.00053, 0.00324], [1.0075, 0.00234, -0.00211],
  [0.9923, -0.00417, 0.00148], [1.025, 0.00326, -0.00417], [1.012, 0.00202, -0.00417], [1.0102, -0.00142, 0.00417],
  [0.9818, 0.00034, 0.00283], [0.9839, 0.00009, 0.0038], [0.9932, -0.00015, -0.00067], [0.9978, -0.00042, -0.00051],
  [1.0017, 0.00038, -0.00008], [1.0017, 0.00016, 0.00055], [0.9958, 0.00002, 0.00239], [1.0044, 0.00105, -0.00083],
  [1.0062, 0.00012, 0.00019], [1.0065, 0.00032, -0.001], [1.0048, -0.00053, -0.00239], [1.0021, -0.00046, -0.00076],
  [0.9756, -0.00164, 0.00417], [1.0128, 0.00016, -0.00066], [1.008, -0.00039, -0.00177], [0.9899, -0.00001, 0.00138],
  [0.9971, 0.00033, 0.00139], [1.0137, -0.00034, -0.00301], [1.0212, 0.00016, -0.00348], [0.9904, 0.00186, 0.002],
  [0.9925, 0.00072, 0.00127], [0.9929, -0.00022, 0.00065], [0.9991, 0.00003, 0.00023], [1.0006, 0.00035, -0.00007],
  [1.0042, -0.00038, -0.00035], [1.0042, -0.0001, -0.00062], [1.0067, -0.00092, -0.00085], [0.9854, 0.00131, 0.00417],
  [0.9976, -0.00065, -0.00093], [0.9976, -0.00063, -0.00077], [0.9973, -0.00073, -0.00064], [0.998, 0.0001, -0.00064],
  [1.0009, -0.00012, 0.00024], [1, 0.00083, -0.00008], [0.9969, 0.00106, -0.0006], [0.9909, 0.00182, -0.00139],
  [0.9848, 0.00319, -0.00142], [0.9949, 0.00299, -0.00058], [1.0161, -0.00417, 0.0024], [1.0098, -0.00251, 0.0013],
  [1.0042, -0.00101, 0.00051], [0.9999, 0.00004, -0.00005], [0.9953, -0.00028, -0.00046], [0.9892, 0.00028, 0.0002],
  [0.984, -0.0003, 0.00079], [0.9802, -0.00101, 0.00009], [1.025, 0.00192, -0.00417], [0.9822, -0.00384, -0.00104],
  [0.9951, 0.00103, 0.00224], [0.9991, 0.00053, 0.00132], [0.9979, -0.00009, 0.00058], [0.9957, -0.00083, 0.00006],
  [0.9956, -0.00164, -0.00027], [1.0043, 0.0017, 0.0006], [1.003, 0.00091, 0.00055], [1.0034, 0.00027, 0.00065],
  [0.9996, -0.0002, -0.00016], [1.0028, 0.00051, 0.00023], [1.0027, 0.00028, 0.00077],
]
// Every frame is drawn this much larger so a correction (or the shake) can never
// reveal the photo's edge. Equals 1 / the smallest correction scale.
const OVERSCAN = 1.025

// Portrait screens: cover would crop the croissant in the close frames (25-40),
// so the frame is scaled to fit this croissant span (fraction of frame width).
const CROISSANT_SPAN = 0.56

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
//   position, each drawn with its own stabilisation so the two line up
// - once scrolling stops the shown position settles on a whole, crisp frame
const EASE_MS = 140
const IDLE_SNAP_MS = 160

// Warm glow: rises from frame 9, peaks at frames 20-25, gone by frame 35.
// Takes the fractional frame position so it changes smoothly too.
function glowFor(pos: number) {
  const f = pos + 1
  if (f <= 9 || f >= 35) return 0
  if (f < 20) return 0.12 * easeInOut(rangeProgress(f, 9, 20))
  if (f <= 25) return 0.12
  return 0.12 * (1 - easeInOut(rangeProgress(f, 25, 35)))
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

    // one frame, drawn with its own stabilisation correction
    function drawFrame(index: number, alpha: number) {
      const [a, bx, by] = CAMERA_CORRECTION[index]
      const s = OVERSCAN * a
      const w = box.w * s
      const h = box.h * s
      ctx!.globalAlpha = alpha
      ctx!.drawImage(frames!.images[index], box.x + box.w / 2 + bx * box.w - w / 2, box.y + box.h / 2 + by * box.w - h / 2, w, h)
      ctx!.globalAlpha = 1
      return { cy: box.y + box.h / 2 + by * box.w, h }
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

      if (glowRef.current) glowRef.current.style.opacity = reduced ? '0' : glowFor(pos).toFixed(3)
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
