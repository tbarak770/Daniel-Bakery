import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/products'
import type { CartItem, Product } from '../types'

const STORAGE_KEY = 'daniel-bakery-cart'

interface CartLine {
  product: Product
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  lines: CartLine[]
  totalCount: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (productId: string) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const increment = (productId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  const decrement = (productId: string) => {
    setItems((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const clearCart = () => setItems([])

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return null
          return { product, quantity: item.quantity }
        })
        .filter((line): line is CartLine => line !== null),
    [items],
  )

  const totalCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])
  const totalPrice = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0),
    [lines],
  )

  const value: CartContextValue = {
    items,
    lines,
    totalCount,
    totalPrice,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
