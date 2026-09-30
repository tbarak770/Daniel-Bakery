// Shared math for scroll-scrubbed photo sequences: given N images and a
// 0-1 scroll progress, compute per-image cumulative time boundaries, a
// crossfade opacity, and a "Ken Burns" slow-zoom scale.

export function computeBoundaries(weights: number[]): number[] {
  const total = weights.reduce((sum, w) => sum + w, 0)
  const boundaries: number[] = [0]
  let cumulative = 0
  for (const w of weights) {
    cumulative += w
    boundaries.push(cumulative / total)
  }
  return boundaries
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

export function crossfadeOpacity(
  index: number,
  count: number,
  boundaries: number[],
  progress: number,
  crossfade: number,
): number {
  const start = boundaries[index]
  const end = boundaries[index + 1]
  if (progress <= start - crossfade || progress >= end + crossfade) return 0
  if (progress < start + crossfade) {
    return index === 0 ? 1 : clamp01((progress - (start - crossfade)) / (2 * crossfade))
  }
  if (progress > end - crossfade) {
    return index === count - 1 ? 1 : clamp01((end + crossfade - progress) / (2 * crossfade))
  }
  return 1
}

export function kenBurnsScale(index: number, boundaries: number[], progress: number, maxScale: number): number {
  const start = boundaries[index]
  const end = boundaries[index + 1]
  const local = clamp01((progress - start) / (end - start || 1))
  return 1 + (maxScale - 1) * local
}
