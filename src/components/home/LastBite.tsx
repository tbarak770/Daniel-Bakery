import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/siteConfig'
import styles from './LastBite.module.css'

// Closing call-to-action, styled after the reference's "THE LAST BITE" section.
// Used as the final beat of the cookie story (desktop overlay + mobile slideshow).
export default function LastBite() {
  return (
    <div className={styles.inner}>
      <span className={styles.tag}>הנגיסה האחרונה</span>
      <h2 className={styles.headline}>
        ביס אחד
        <br />
        <span className={styles.accent}>ואתם מכורים.</span>
      </h2>
      <div className={styles.buttons}>
        <Link to="/products" className="btn btn-primary">
          לכל המוצרים
        </Link>
        <a
          className="btn btn-secondary"
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          דברו איתנו בוואטסאפ
        </a>
      </div>
    </div>
  )
}
