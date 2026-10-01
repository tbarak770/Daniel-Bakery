import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import styles from './AboutPreview.module.css'

// Split layout after the reference's "atelier" section: round photo frame with a
// glass chip, text on the other side.
export default function AboutPreview() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className={styles.frame}>
          <img src={asset('images/daniel/daniel-portrait.jpg')} alt="דניאל במטבח" loading="lazy" />
          <span className={styles.chip}>
            <span className={styles.dot} aria-hidden="true" />
            נאפה בעבודת יד
          </span>
        </div>
        <div className={styles.text}>
          <span className="eyebrow">הסיפור שלנו</span>
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
