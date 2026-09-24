import { HashRouter, Route, Routes } from 'react-router-dom'
import CartDrawer from './components/cart/CartDrawer'
import FloatingWhatsAppButton from './components/layout/FloatingWhatsAppButton'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { CartProvider } from './context/CartContext'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsAppButton />
        <CartDrawer />
      </HashRouter>
    </CartProvider>
  )
}

export default App
