import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/siteConfig'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div>
          <div className={styles.brand}>Daniel Bakery</div>
          <div className={styles.brandSub}>דניאל בייקרי</div>
          <p className={styles.tagline}>{siteConfig.tagline}. עוגות, עוגיות וקינוחים שנאפים טריים ומוכנים במיוחד בשבילכם.</p>
          <div className={styles.social}>
            <a
              className={styles.socialLink}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="עמוד האינסטגרם שלנו"
            >
              IG
            </a>
            <a
              className={styles.socialLink}
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="עמוד הפייסבוק שלנו"
            >
              FB
            </a>
          </div>
        </div>

        <div>
          <div className={styles.heading}>קטגוריות</div>
          <nav className={styles.linkList}>
            <Link to="/products?category=עוגות">עוגות</Link>
            <Link to="/products?category=עוגיות">עוגיות</Link>
            <Link to="/products?category=קינוחים">קינוחים</Link>
            <Link to="/products">כל המוצרים</Link>
          </nav>
        </div>

        <div>
          <div className={styles.heading}>מידע</div>
          <nav className={styles.linkList}>
            <Link to="/about">אודות דניאל בייקרי</Link>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer noopener">
              יצירת קשר בוואטסאפ
            </a>
            <span>ההזמנות מתואמות ידנית מול דניאל</span>
          </nav>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">© {new Date().getFullYear()} Daniel Bakery | דניאל בייקרי. כל הזכויות שמורות.</div>
      </div>
    </footer>
  )
}
