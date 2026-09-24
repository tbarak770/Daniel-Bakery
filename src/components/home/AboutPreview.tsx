import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import styles from './AboutPreview.module.css'

export default function AboutPreview() {
  return (
    <section className="section">
      <div className={`container ${styles.wrap}`}>
        <div className={styles.imageWrap}>
          <img src={asset('images/about/about.jpg')} alt="אפייה ביתית באהבה" loading="lazy" />
        </div>
        <div className={styles.text}>
          <span className={styles.eyebrow}>הסיפור שלנו</span>
          <h2>נאפה באהבה, בבית, בכל פעם מחדש</h2>
          <p>
            דניאל בייקרי נולד מתוך אהבה אמיתית לאפייה. כל מוצר נאפה בקפידה, מרכיבים איכותיים ומתכונים שחוזרים על
            עצמם רק כשהם יוצאים מושלמים. אנחנו מאמינים שהדברים הכי טובים נעשים לאט, בידיים, ובלב פתוח.
          </p>
          <Link to="/about" className="btn btn-secondary">
            קראו את הסיפור המלא
          </Link>
        </div>
      </div>
    </section>
  )
}
