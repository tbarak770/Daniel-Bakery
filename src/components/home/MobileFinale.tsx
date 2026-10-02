import LastBite from './LastBite'
import styles from './MobileFinale.module.css'

// Closing section of the phone home page: the cookie story already opened the
// page, so the ending is just the "last bite" call to action on a warm glow.
export default function MobileFinale() {
  return (
    <section className={styles.section} aria-label="סיום">
      <LastBite />
    </section>
  )
}
