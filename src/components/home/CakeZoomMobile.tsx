import { useEffect, useState } from 'react'
import { asset } from '../../utils/asset'
import styles from './CakeZoomMobile.module.css'

const PHOTOS = [
  'images/cake-zoom/photo-01.webp',
  'images/cake-zoom/photo-02.webp',
  'images/cake-zoom/photo-03.webp',
  'images/cake-zoom/photo-04.webp',
  'images/cake-zoom/photo-05.webp',
  'images/cake-zoom/photo-06.webp',
]

const INTERVAL_MS = 2800

export default function CakeZoomMobile() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % PHOTOS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.wrap} aria-label="צלילה קולנועית לתוך עוגת השוקולד של דניאל בייקרי">
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          className={`${styles.photo} ${i === active ? styles.photoActive : ''}`}
          src={asset(src)}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  )
}
