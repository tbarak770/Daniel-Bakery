import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/siteConfig'
import { FacebookIcon, InstagramIcon, WhatsappIcon } from '../icons'
import styles from './Footer.module.css'

// Four-column footer after the reference (.site-footer). The reference's
// newsletter column is replaced by WhatsApp, our only contact channel.
export default function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}`

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              Daniel Bakery
            </Link>
            <p className={styles.tagline}>
              {siteConfig.tagline}. עוגות, עוגיות וקינוחים שנאפים טריים, בעבודת יד, ומוכנים במיוחד בשבילכם.
            </p>
            <div className={styles.social}>
              <a
                className={styles.socialBtn}
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="עמוד האינסטגרם שלנו"
              >
                <InstagramIcon />
              </a>
              <a
                className={styles.socialBtn}
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="עמוד הפייסבוק שלנו"
              >
                <FacebookIcon />
              </a>
              <a
                className={styles.socialBtn}
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="וואטסאפ"
              >
                <WhatsappIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <div className={styles.heading}>ניווט</div>
            <ul className={styles.links}>
              <li>
                <Link to="/products">כל המוצרים</Link>
              </li>
              <li>
                <Link to="/products?category=עוגות">עוגות</Link>
              </li>
              <li>
                <Link to="/products?category=עוגיות">עוגיות</Link>
              </li>
              <li>
                <Link to="/products?category=קינוחים">קינוחים</Link>
              </li>
              <li>
                <Link to="/about">הסיפור שלנו</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className={styles.heading}>הזמנות</div>
            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>איך מזמינים</div>
              <div className={styles.infoText}>בוחרים מוצרים, ממלאים פרטים, והכל נשלח לדניאל בוואטסאפ.</div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>מתי מקבלים</div>
              <div className={styles.infoText}>כל הזמנה מתואמת אישית.</div>
              <div className={styles.infoMeta}>מומלץ להזמין כמה ימים מראש</div>
            </div>
          </div>

          <div>
            <div className={styles.heading}>דברו איתנו</div>
            <p className={styles.infoText}>שאלה, הזמנה מיוחדת או סתם להגיד שהיה טעים? דניאל עונה בוואטסאפ.</p>
            <a className={`btn btn-primary ${styles.waBtn}`} href={whatsappUrl} target="_blank" rel="noreferrer noopener">
              שליחת הודעה בוואטסאפ
            </a>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} Daniel Bakery | דניאל בייקרי. כל הזכויות שמורות.</span>
          <button
            type="button"
            className={styles.backToTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            חזרה למעלה ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
