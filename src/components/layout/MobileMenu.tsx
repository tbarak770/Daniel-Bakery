import { Link } from 'react-router-dom'
import { CloseIcon } from '../icons'
import styles from './MobileMenu.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
      >
        <div className={styles.top}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="סגירת תפריט">
            <CloseIcon />
          </button>
        </div>
        <nav className={styles.links}>
          <Link className={styles.link} to="/" onClick={onClose}>
            בית
          </Link>
          <Link className={styles.link} to="/products" onClick={onClose}>
            כל המוצרים
          </Link>
          <Link className={styles.link} to="/products?category=עוגות" onClick={onClose}>
            עוגות
          </Link>
          <Link className={styles.link} to="/products?category=עוגיות" onClick={onClose}>
            עוגיות
          </Link>
          <Link className={styles.link} to="/products?category=קינוחים" onClick={onClose}>
            קינוחים
          </Link>
          <Link className={styles.link} to="/about" onClick={onClose}>
            אודות
          </Link>
        </nav>
      </div>
    </>
  )
}
