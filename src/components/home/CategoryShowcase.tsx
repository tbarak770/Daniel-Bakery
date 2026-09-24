import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import styles from './CategoryShowcase.module.css'

const CATEGORIES = [
  { name: 'עוגות', image: 'images/categories/cakes.jpg' },
  { name: 'עוגיות', image: 'images/categories/cookies.jpg' },
  { name: 'קינוחים', image: 'images/categories/desserts.jpg' },
] as const

export default function CategoryShowcase() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">הקטגוריות שלנו</span>
          <h2>בחרו לפי מה שמתחשק לכם</h2>
        </div>
        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`} className={styles.card}>
              <img src={asset(cat.image)} alt={cat.name} loading="lazy" />
              <div className={styles.label}>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.cta}>לצפייה במוצרים ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
