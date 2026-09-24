import { useState, type FormEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice, todayIsoDate } from '../../utils/format'
import { buildWhatsappUrl } from '../../utils/whatsapp'
import { WhatsappIcon } from '../icons'
import styles from './OrderForm.module.css'

interface FormState {
  customerName: string
  phone: string
  date: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const PHONE_PATTERN = /^0\d{1,2}-?\d{6,7}$/

export default function OrderForm() {
  const { lines, totalPrice, clearCart, closeCart } = useCart()
  const [form, setForm] = useState<FormState>({ customerName: '', phone: '', date: '', notes: '' })
  const [errors, setErrors] = useState<FormErrors>({})

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.customerName.trim()) next.customerName = 'נא להזין שם מלא'
    if (!form.phone.trim()) next.phone = 'נא להזין מספר טלפון'
    else if (!PHONE_PATTERN.test(form.phone.trim())) next.phone = 'מספר הטלפון אינו תקין'
    if (!form.date) next.date = 'נא לבחור תאריך רצוי'
    return next
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const url = buildWhatsappUrl(form, lines, totalPrice)
    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
    closeCart()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.summaryBox}>
        <span className={styles.summaryTitle}>המוצרים שבחרתם</span>
        {lines.map((line) => (
          <div className={styles.summaryItem} key={line.product.id}>
            <span>
              {line.product.name} x{line.quantity}
            </span>
            <span>{formatPrice(line.product.price * line.quantity)}</span>
          </div>
        ))}
        <div className={styles.summaryTotal}>
          <span>סה"כ</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className={`${styles.field} ${errors.customerName ? styles.fieldError : ''}`}>
        <label htmlFor="customerName">שם מלא</label>
        <input
          id="customerName"
          type="text"
          value={form.customerName}
          onChange={(e) => updateField('customerName', e.target.value)}
          placeholder="לדוגמה: ישראל ישראלי"
        />
        {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
      </div>

      <div className={`${styles.field} ${errors.phone ? styles.fieldError : ''}`}>
        <label htmlFor="phone">מספר טלפון</label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="050-1234567"
          dir="ltr"
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      <div className={`${styles.field} ${errors.date ? styles.fieldError : ''}`}>
        <label htmlFor="date">תאריך רצוי</label>
        <input
          id="date"
          type="date"
          min={todayIsoDate()}
          value={form.date}
          onChange={(e) => updateField('date', e.target.value)}
        />
        {errors.date && <span className={styles.errorText}>{errors.date}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="notes">הערות להזמנה</label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="לדוגמה: בקשות מיוחדות, כתובת למסירה וכו׳"
        />
      </div>

      <button type="submit" className="btn btn-whatsapp btn-full">
        <WhatsappIcon size={20} />
        שליחת הזמנה בוואטסאפ
      </button>
    </form>
  )
}
