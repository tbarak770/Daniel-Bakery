import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import ProductCard from '../product/ProductCard'
import styles from './ProductsSection.module.css'

interface Props {
  eyebrow: string
  title: string
  products: Product[]
  altBg?: boolean
}

export default function ProductsSection({ eyebrow, title, products, altBg }: Props) {
  return (
    <section className={`section ${altBg ? styles.altBg : ''}`}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link to="/products" className={styles.viewAll}>
            לכל המוצרים ←
          </Link>
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
