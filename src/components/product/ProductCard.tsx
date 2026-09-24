import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'
import { asset } from '../../utils/asset'
import { formatPrice } from '../../utils/format'
import { MinusIcon, PlusIcon } from '../icons'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { items, addItem, increment, decrement } = useCart()
  const inCart = items.find((item) => item.productId === product.id)

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img className={styles.image} src={asset(product.image)} alt={product.name} loading="lazy" />
        {product.bestSeller && <span className={styles.badge}>מומלץ</span>}
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {inCart ? (
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => decrement(product.id)}
                aria-label={`הפחתת כמות ל${product.name}`}
              >
                <MinusIcon size={14} />
              </button>
              <span className={styles.qty}>{inCart.quantity}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => increment(product.id)}
                aria-label={`הוספת כמות ל${product.name}`}
              >
                <PlusIcon size={14} />
              </button>
            </div>
          ) : (
            <button type="button" className={styles.addBtn} onClick={() => addItem(product.id)}>
              הוספה לסל
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
