import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from '../icons'
import styles from './Header.module.css'
import MobileMenu from './MobileMenu'

const NAV = [
  { label: 'בית', to: '/' },
  { label: 'כל המוצרים', to: '/products' },
  { label: 'עוגות', to: '/products?category=עוגות' },
  { label: 'עוגיות', to: '/products?category=עוגיות' },
  { label: 'קינוחים', to: '/products?category=קינוחים' },
  { label: 'אודות', to: '/about' },
]

// Floating, transparent navbar like the reference; gains a dark glass backdrop
// once the page scrolls so it stays readable over content.
export default function Header() {
  const { totalCount, openCart } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(to: string) {
    const [path, search = ''] = to.split('?')
    if (path !== location.pathname) return false
    const want = new URLSearchParams(search).get('category')
    const have = new URLSearchParams(location.search).get('category')
    return want === have
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
    setSearchOpen(false)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.bar}>
        <Link to="/" className={styles.logo} aria-label="דניאל בייקרי - דף הבית">
          <span className={styles.logoMain}>Daniel Bakery</span>
          <span className={styles.logoSub}>דניאל בייקרי</span>
        </Link>

        <nav className={styles.nav} aria-label="ניווט ראשי">
          {NAV.map((item) => (
            <Link
              key={item.to}
              className={`${styles.navLink} ${isActive(item.to) ? styles.navLinkActive : ''}`}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
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
            {searchOpen ? <CloseIcon size={18} /> : <SearchIcon size={18} />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={openCart} aria-label="לצפייה בסל">
            <CartIcon size={18} />
            {totalCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {totalCount}
              </span>
            )}
          </button>
          <button type="button" className={styles.orderPill} onClick={openCart}>
            להזמנה
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen(true)}
            aria-label="פתיחת תפריט"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
