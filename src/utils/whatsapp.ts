import { siteConfig } from '../config/siteConfig'
import type { Product } from '../types'
import { formatPrice, isoToDisplayDate } from './format'

export interface OrderDetails {
  customerName: string
  phone: string
  date: string
  notes: string
}

export interface OrderLine {
  product: Product
  quantity: number
}

export function buildWhatsappUrl(order: OrderDetails, lines: OrderLine[], total: number): string {
  const itemsText = lines
    .map((line) => `${line.product.name} x${line.quantity} - ${formatPrice(line.product.price * line.quantity)}`)
    .join('\n')

  const message = `שלום דניאל,
אני רוצה לבצע הזמנה מ-Daniel Bakery.

שם: ${order.customerName}
טלפון: ${order.phone}
תאריך רצוי: ${isoToDisplayDate(order.date)}

המוצרים שהזמנתי:
${itemsText}

סה"כ לתשלום: ${formatPrice(total)}

הערות:
${order.notes || 'אין'}

אשמח לאישור ההזמנה ולפרטי התשלום.`

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
