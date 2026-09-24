import type { Product } from '../types'

export const products: Product[] = [
  {
    id: 'chocolate-cake',
    name: 'עוגת שוקולד',
    price: 85,
    category: 'עוגות',
    image: 'images/products/chocolate-cake.jpg',
    description: 'עוגת שוקולד עשירה ולחה, אפויה בשכבות עם קרם שוקולד קטיפתי.',
    bestSeller: true,
  },
  {
    id: 'biscuit-cake',
    name: 'עוגת ביסקוויטים',
    price: 80,
    category: 'עוגות',
    image: 'images/products/biscuit-cake.jpg',
    description: 'עוגת ביסקוויטים ביתית בשכבות עדינות עם קרם חלק ומפנק.',
  },
  {
    id: 'cheesecake',
    name: 'עוגת גבינה',
    price: 90,
    category: 'עוגות',
    image: 'images/products/cheesecake.jpg',
    description: 'עוגת גבינה אפויה, קלאסית ונימוחה, על בסיס פריך.',
  },
  {
    id: 'choc-chip-cookies',
    name: 'עוגיות שוקולד צ\'יפס',
    price: 35,
    category: 'עוגיות',
    image: 'images/products/choc-chip-cookies.jpg',
    description: 'עוגיות ביתיות פריכות מבחוץ ורכות מבפנים, עמוסות שוקולד.',
    bestSeller: true,
  },
  {
    id: 'alfajores',
    name: 'עוגיות אלפחורס',
    price: 40,
    category: 'עוגיות',
    image: 'images/products/alfajores.jpg',
    description: 'עוגיות נמסות בפה במילוי דולסה דה לצ׳ה, מסוכרות באבקת סוכר.',
  },
  {
    id: 'brownies',
    name: 'בראוניז',
    price: 45,
    category: 'קינוחים',
    image: 'images/products/brownies.jpg',
    description: 'בראוניז עשיר ואגוזי, עם לב שוקולד נימוח.',
    bestSeller: true,
  },
  {
    id: 'dessert-cups',
    name: 'קינוחי כוסות',
    price: 18,
    category: 'קינוחים',
    image: 'images/products/dessert-cups.jpg',
    description: 'קינוח כוס אישי, שכבות עדינות של קרם ופירות טריים.',
  },
  {
    id: 'mousse-cup',
    name: 'מוס שוקולד בכוס',
    price: 20,
    category: 'קינוחים',
    image: 'images/products/mousse-cup.jpg',
    description: 'מוס שוקולד אוורירי ועשיר, מוגש בכוס אישית.',
  },
]

export const categories: Product['category'][] = ['עוגות', 'עוגיות', 'קינוחים']
