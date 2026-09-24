import { useCart } from '../../context/CartContext'
import { WhatsappIcon } from '../icons'
import styles from './FloatingWhatsAppButton.module.css'

export default function FloatingWhatsAppButton() {
  const { openCart } = useCart()

  return (
    <button type="button" className={styles.fab} onClick={openCart} aria-label="להזמנה מהירה בוואטסאפ">
      <WhatsappIcon />
      <span className={styles.label}>להזמנה מהירה</span>
    </button>
  )
}
