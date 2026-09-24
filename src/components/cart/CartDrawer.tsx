import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'
import { ChevronIcon, CloseIcon } from '../icons'
import styles from './CartDrawer.module.css'
import CartLineItem from './CartLineItem'
import OrderForm from './OrderForm'

export default function CartDrawer() {
  const { isOpen, closeCart, lines, totalPrice } = useCart()
  const [step, setStep] = useState<'cart' | 'form'>('cart')
  const location = useLocation()

  function handleClose() {
    closeCart()
    setStep('cart')
  }

  // Navigating to a different page (e.g. a header nav link) while the
  // drawer is open should not leave it stuck covering the new page.
  useEffect(() => {
    handleClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="הסל שלי"
      >
        <div className={styles.header}>
          <span className={styles.title}>{step === 'cart' ? 'הסל שלי' : 'סיכום הזמנה'}</span>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="סגירת הסל">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          {lines.length === 0 ? (
            <div className={styles.empty}>
              <strong>הסל שלכם עדיין ריק</strong>
              <span>חזרו למוצרים ובחרו משהו מתוק</span>
              <Link to="/products" className="btn btn-secondary" onClick={handleClose}>
                המשך בקניות
              </Link>
            </div>
          ) : step === 'cart' ? (
            <div className={styles.lines}>
              {lines.map((line) => (
                <CartLineItem key={line.product.id} product={line.product} quantity={line.quantity} />
              ))}
            </div>
          ) : (
            <>
              <button type="button" className={styles.backBtn} onClick={() => setStep('cart')}>
                <ChevronIcon size={16} /> חזרה לסל
              </button>
              <OrderForm />
            </>
          )}
        </div>

        {lines.length > 0 && step === 'cart' && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>סיכום ביניים</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>סה"כ</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button type="button" className="btn btn-primary btn-full" onClick={() => setStep('form')}>
              המשך להזמנה
            </button>
            <Link to="/products" className={styles.continueLink} onClick={handleClose}>
              המשך בקניות
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
