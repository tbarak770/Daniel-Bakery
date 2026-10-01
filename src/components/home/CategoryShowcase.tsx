import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import styles from './CategoryShowcase.module.css'

const CATEGORIES = [
  { name: 'עוגות', image: 'images/categories/cakes.jpg' },
  { name: 'עוגיות', image: 'images/categories/cookies.jpg' },
  { name: 'קינוחים', image: 'images/categories/desserts.jpg' },
] as const

// First section after the croissant opening: it slides up over the pinned
// final frame (.section is position:relative + z-index above the stage).
export default function CategoryShowcase() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header-split">
          <div>
            <span className="eyebrow">הקטגוריות שלנו</span>
            <h2>בחרו לפי מה שמתחשק לכם</h2>
          </div>
          <p>עוגות, עוגיות וקינוחים שנאפים בעבודת יד, טריים ומוכנים במיוחד בשבילכם.</p>
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
