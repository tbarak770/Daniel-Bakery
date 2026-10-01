import { useEffect, useState } from 'react'
import { asset } from '../../utils/asset'
import LastBite from './LastBite'
import styles from './CookieStoryMobile.module.css'

// Mobile stand-in for CinematicHero (scroll-scrubbing is desktop-only): the same
// six cookie photos as a gentle auto crossfade, under the closing call-to-action.
const PHOTOS = [
  'images/cinematic/photo-01.webp',
  'images/cinematic/photo-02.webp',
  'images/cinematic/photo-03.webp',
  'images/cinematic/photo-04.webp',
  'images/cinematic/photo-05.webp',
  'images/cinematic/photo-06.webp',
]

const INTERVAL_MS = 2800

export default function CookieStoryMobile() {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  // reduced motion: rest on the finished, chocolate-filled cookie
  const [active, setActive] = useState(reduced ? PHOTOS.length - 1 : 0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % PHOTOS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <section className={styles.section} aria-label="הסיפור של עוגיית דניאל">
      <div className={styles.photos} aria-hidden="true">
        {PHOTOS.map((src, i) => (
          <img
            key={src}
            className={`${styles.photo} ${i === active ? styles.photoActive : ''}`}
            src={asset(src)}
            alt=""
            loading="lazy"
          />
        ))}
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <LastBite />
      </div>
    </section>
  )
}
