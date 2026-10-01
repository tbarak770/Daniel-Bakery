// Preloads an image sequence for canvas scroll-scrubbing.
// Order: frame 0 first (so the canvas is never empty), then the next few,
// then everything else in parallel. Each frame is decoded before it's marked
// ready, so drawImage() never has to decode mid-scroll.

export interface FrameSet {
  images: HTMLImageElement[]
  /** true once images[i] is loaded + decoded and safe to draw */
  ready: boolean[]
}

const EARLY_BATCH = 6

function loadOne(url: string, highPriority: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    if (highPriority) img.fetchPriority = 'high'
    img.onload = () => {
      // decode() can reject on some browsers even though the image is usable
      img.decode().then(() => resolve(img), () => resolve(img))
    }
    img.onerror = () => reject(new Error(`frame failed: ${url}`))
    img.src = url
  })
}

export function preloadFrames(
  urls: string[],
  onFrameReady: (index: number) => void,
  /** called after every frame settles (loaded or failed), for loading UIs */
  onProgress?: (settled: number, total: number) => void,
): { frames: FrameSet; cancel: () => void } {
  const frames: FrameSet = {
    images: new Array(urls.length),
    ready: new Array(urls.length).fill(false),
  }
  let cancelled = false
  let settled = 0
  const settle = () => {
    settled++
    if (!cancelled) onProgress?.(settled, urls.length)
  }

  const load = (i: number, highPriority = false) =>
    loadOne(urls[i], highPriority).then(
      (img) => {
        if (cancelled) return
        frames.images[i] = img
        frames.ready[i] = true
        onFrameReady(i)
        settle()
      },
      () => {
        // A missing frame must not break the sequence: the renderer falls back
        // to the nearest ready frame.
        settle()
      },
    )

  load(0, true).then(async () => {
    if (cancelled) return
    const early = []
    for (let i = 1; i <= Math.min(EARLY_BATCH, urls.length - 1); i++) early.push(load(i))
    await Promise.all(early)
    if (cancelled) return
    for (let i = EARLY_BATCH + 1; i < urls.length; i++) load(i)
  })

  return {
    frames,
    cancel: () => {
      cancelled = true
    },
  }
}

/** Nearest ready frame to `target` (searching both directions), or -1 if none. */
export function nearestReadyFrame(frames: FrameSet, target: number): number {
  const n = frames.ready.length
  for (let d = 0; d < n; d++) {
    if (target - d >= 0 && frames.ready[target - d]) return target - d
    if (target + d < n && frames.ready[target + d]) return target + d
  }
  return -1
}
