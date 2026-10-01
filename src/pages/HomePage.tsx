import AboutPreview from '../components/home/AboutPreview'
import CategoryShowcase from '../components/home/CategoryShowcase'
import CinematicHero from '../components/home/CinematicHero'
import CookieStoryMobile from '../components/home/CookieStoryMobile'
import CroissantScrollSequence from '../components/home/CroissantScrollSequence'
import Gallery from '../components/home/Gallery'
import ProductsSection from '../components/home/ProductsSection'
import QuoteSection from '../components/home/QuoteSection'
import { products } from '../data/products'
import { useIsDesktop } from '../hooks/useIsDesktop'

const bestSellers = products.filter((p) => p.bestSeller)
const featured = products.filter((p) => !p.bestSeller).slice(0, 4)

export default function HomePage() {
  const isDesktop = useIsDesktop()

  return (
    <>
      <CroissantScrollSequence />
      <CategoryShowcase />
      <ProductsSection
        eyebrow="הכי אהובים"
        title="מומלצים ביותר"
        description="המאפים שהלקוחות חוזרים אליהם שוב ושוב. נאפים טריים, בעבודת יד."
        products={bestSellers}
        ground={2}
      />
      <ProductsSection
        eyebrow="בחירה שלנו"
        title="מוצרים נבחרים"
        description="עוד כמה מהדברים הטובים שיוצאים מהתנור של דניאל."
        products={featured}
        ground={1}
      />
      <AboutPreview />
      <QuoteSection />
      <Gallery />
      {/* the cookie story closes the page, like the reference's "last bite" */}
      {isDesktop ? <CinematicHero /> : <CookieStoryMobile />}
    </>
  )
}
