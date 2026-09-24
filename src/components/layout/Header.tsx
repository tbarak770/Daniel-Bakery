import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from '../icons'
import styles from './Header.module.css'
import MobileMenu from './MobileMenu'

export default function Header() {
  const { totalCount, openCart } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
    setSearchOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMain}>Daniel Bakery</span>
          <span className={styles.logoSub}>דניאל בייקרי</span>
        </Link>

        <nav className={styles.nav} aria-label="ניווט ראשי">
          <Link className={styles.navLink} to="/">
            בית
          </Link>
          <Link className={styles.navLink} to="/products">
            כל המוצרים
          </Link>
          <Link className={styles.navLink} to="/products?category=עוגות">
            עוגות
          </Link>
          <Link className={styles.navLink} to="/products?category=עוגיות">
            עוגיות
          </Link>
          <Link className={styles.navLink} to="/products?category=קינוחים">
            קינוחים
          </Link>
          <Link className={styles.navLink} to="/about">
            אודות
          </Link>
        </nav>

        <div className={styles.actions}>
          <form
            className={`${styles.searchForm} ${searchOpen ? styles.searchFormOpen : ''}`}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              className={styles.searchInput}
              type="search"
              placeholder="חיפוש מוצרים..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="חיפוש מוצרים"
            />
          </form>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? 'סגירת חיפוש' : 'פתיחת חיפוש'}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={openCart} aria-label="לצפייה בסל">
            <CartIcon />
            {totalCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {totalCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen(true)}
            aria-label="פתיחת תפריט"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
