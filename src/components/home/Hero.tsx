import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { asset } from '../../utils/asset'
import styles from './Hero.module.css'

export default function Hero() {
  const { openCart } = useCart()

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <img src={asset('images/hero/hero.jpg')} alt="" />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Daniel Bakery | דניאל בייקרי</span>
        <h1 className={styles.title}>מתוק יותר כשזה נאפה באהבה</h1>
        <p className={styles.subtitle}>עוגות, עוגיות וקינוחים שנאפים טריים ומוכנים במיוחד בשבילכם.</p>
        <div className={styles.actions}>
          <Link to="/products" className="btn btn-primary">
            לכל המוצרים
          </Link>
          <button type="button" className="btn btn-secondary" onClick={openCart}>
            להזמנה מהירה
          </button>
        </div>
      </div>
    </section>
  )
}
