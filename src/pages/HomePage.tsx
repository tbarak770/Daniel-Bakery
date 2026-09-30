import AboutPreview from '../components/home/AboutPreview'
import CategoryShowcase from '../components/home/CategoryShowcase'
import CinematicHero from '../components/home/CinematicHero'
import CtaBanner from '../components/home/CtaBanner'
import Gallery from '../components/home/Gallery'
import Hero from '../components/home/Hero'
import ProductsSection from '../components/home/ProductsSection'
import VideoStrip from '../components/home/VideoStrip'
import { products } from '../data/products'
import { useIsDesktop } from '../hooks/useIsDesktop'

const bestSellers = products.filter((p) => p.bestSeller)
const featured = products.filter((p) => !p.bestSeller).slice(0, 4)

export default function HomePage() {
  const isDesktop = useIsDesktop()

  return (
    <>
      {isDesktop ? <CinematicHero /> : <Hero />}
      <CategoryShowcase />
      <ProductsSection eyebrow="הכי אהובים" title="מומלצים ביותר" products={bestSellers} altBg />
      <ProductsSection eyebrow="בחירה שלנו" title="מוצרים נבחרים" products={featured} />
      {!isDesktop && <VideoStrip />}
      <AboutPreview />
      <Gallery />
      <CtaBanner />
    </>
  )
}
