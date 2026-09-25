import { asset } from '../../utils/asset'
import styles from './Gallery.module.css'

const IMAGES = [
  'images/daniel/daniel-mixing.jpg',
  'images/gallery/g2.jpg',
  'images/gallery/g3.jpg',
  'images/daniel/daniel-piping.jpg',
  'images/gallery/g5.jpg',
  'images/gallery/g6.jpg',
]

export default function Gallery() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">רגעים מהמטבח</span>
          <h2>קצת מהעולם של דניאל בייקרי</h2>
        </div>
        <div className={styles.grid}>
          {IMAGES.map((src) => (
            <div className={styles.item} key={src}>
              <img src={asset(src)} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
