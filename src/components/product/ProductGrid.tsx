import type { Product } from '../../types'
import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <strong>לא נמצאו מוצרים</strong>
        <span>נסו לבחור קטגוריה אחרת או לחפש משהו אחר</span>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
