import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'
import { asset } from '../../utils/asset'
import { formatPrice } from '../../utils/format'
import { MinusIcon, PlusIcon, TrashIcon } from '../icons'
import styles from './CartLineItem.module.css'

interface Props {
  product: Product
  quantity: number
}

export default function CartLineItem({ product, quantity }: Props) {
  const { increment, decrement, removeItem } = useCart()

  return (
    <div className={styles.line}>
      <div className={styles.imageWrap}>
        <img src={asset(product.image)} alt={product.name} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.price}>{formatPrice(product.price)} ליחידה</div>
        <div className={styles.controls}>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => decrement(product.id)}
              aria-label={`הפחתת כמות ל${product.name}`}
            >
              <MinusIcon size={14} />
            </button>
            <span className={styles.qty}>{quantity}</span>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => increment(product.id)}
              aria-label={`הוספת כמות ל${product.name}`}
            >
              <PlusIcon size={14} />
            </button>
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => removeItem(product.id)}
            aria-label={`הסרה מהסל: ${product.name}`}
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </div>
      <div className={styles.lineTotal}>{formatPrice(product.price * quantity)}</div>
    </div>
  )
}
