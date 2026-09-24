import { useEffect, useRef, useState } from 'react'
import { asset } from '../../utils/asset'
import styles from './VideoStrip.module.css'

export default function VideoStrip() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const poster = asset('videos/hero-strip-poster.jpg')

  return (
    <section className={styles.strip} ref={sectionRef} aria-label="רגעים מהמאפייה של דניאל בייקרי">
      {shouldLoad ? (
        <video
          className={styles.media}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={asset('videos/hero-strip.webm')} type="video/webm" />
          <source src={asset('videos/hero-strip.mp4')} type="video/mp4" />
        </video>
      ) : (
        <img className={styles.media} src={poster} alt="" loading="lazy" />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.title}>נאפה באהבה</span>
        <span className={styles.subtitle}>רגעים קטנים. טעמים גדולים.</span>
      </div>
    </section>
  )
}
