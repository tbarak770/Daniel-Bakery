import { Link } from 'react-router-dom'
import styles from './CtaBanner.module.css'

export default function CtaBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.banner}>
          <h2>מוכנים להזמין משהו מתוק?</h2>
          <p>בחרו את המוצרים שאתם אוהבים, ואנחנו נדאג לשאר - הזמנה קלה, ישירות בוואטסאפ.</p>
          <div className={styles.actions}>
            <Link to="/products" className="btn btn-primary">
              לכל המוצרים
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
