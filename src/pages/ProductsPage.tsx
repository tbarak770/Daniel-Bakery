import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import { categories, products } from '../data/products'
import type { Category } from '../types'
import styles from './ProductsPage.module.css'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') as Category | null
  const query = searchParams.get('q')?.trim() ?? ''

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory
      const matchesQuery =
        !query ||
        product.name.includes(query) ||
        product.description.includes(query) ||
        product.category.includes(query)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  function selectCategory(category: Category | null) {
    const next = new URLSearchParams(searchParams)
    if (category) {
      next.set('category', category)
    } else {
      next.delete('category')
    }
    setSearchParams(next)
  }

  function clearSearch() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    setSearchParams(next)
  }

  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <h1>כל המוצרים</h1>
          <p>עוגות, עוגיות וקינוחים - הכל נאפה טרי ובאהבה</p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${!activeCategory ? styles.tabActive : ''}`}
            onClick={() => selectCategory(null)}
          >
            הכל
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.tab} ${activeCategory === category ? styles.tabActive : ''}`}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {query && (
          <p className={styles.searchNotice}>
            תוצאות חיפוש עבור: <strong>{query}</strong>{' '}
            <button type="button" onClick={clearSearch}>
              ניקוי חיפוש
            </button>
          </p>
        )}

        <ProductGrid products={filtered} />
      </div>
    </div>
  )
}
