import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import ProductCard from '../product/ProductCard'
import styles from './ProductsSection.module.css'

interface Props {
  eyebrow: string
  title: string
  description?: string
  products: Product[]
  /** which of the alternating section grounds to use (reference rhythm) */
  ground?: 1 | 2
}

export default function ProductsSection({ eyebrow, title, description, products, ground = 1 }: Props) {
  return (
    <section className={`section ${ground === 2 ? styles.ground2 : ''}`}>
      <div className="container">
        <div className="section-header-split">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <div className={styles.side}>
            {description && <p>{description}</p>}
            <Link to="/products" className={styles.viewAll}>
              לכל המוצרים ←
            </Link>
          </div>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
