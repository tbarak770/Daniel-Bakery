export type Category = 'עוגות' | 'עוגיות' | 'קינוחים'

export interface Product {
  id: string
  name: string
  price: number
  category: Category
  image: string
  description: string
  bestSeller?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
}
