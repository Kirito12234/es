import {
  Armchair,
  ArrowRight,
  BookOpen,
  Camera,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Gamepad2,
  Headphones,
  Keyboard,
  LaptopMinimal,
  Monitor,
  PackageCheck,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Speaker,
  Smartphone,
  Sparkles,
  Truck,
  Watch,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProtectedActionLink from '../components/ProtectedActionLink.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { getStorefrontNavigation } from '../utils/routes.js'

const sidebarItems = [
  { label: "Women's Fashion", slug: 'womens-fashion' },
  { label: "Men's Fashion", slug: 'mens-fashion' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Home & Lifestyle', slug: 'home-lifestyle' },
  { label: 'Medicine', slug: 'medicine' },
  { label: 'Sports & Outdoor', slug: 'sports-outdoor' },
  { label: "Baby's & Toys", slug: 'babys-toys' },
  { label: 'Groceries & Pets', slug: 'groceries-pets' },
  { label: 'Health & Beauty', slug: 'health-beauty' },
]

const flashSaleProducts = [
  {
    title: 'HAVIT HV-G92 Gamepad',
    price: 120,
    oldPrice: 160,
    rating: 5,
    reviews: 88,
    sale: 40,
    icon: Gamepad2,
    accentClassName: 'text-[#db4444]',
    productSlug: 'havit-hv-g92-gamepad',
  },
  {
    title: 'AK-900 Wired Keyboard',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 75,
    sale: 35,
    icon: Keyboard,
    accentClassName: 'text-[#5f8a1b]',
    productSlug: 'ak-900-wired-keyboard',
  },
  {
    title: 'IPS LCD Gaming Monitor',
    price: 370,
    oldPrice: 400,
    rating: 5,
    reviews: 99,
    sale: 30,
    icon: Monitor,
    accentClassName: 'text-[#db4444]',
    productSlug: 'ips-lcd-gaming-monitor',
  },
  {
    title: 'S-Series Comfort Chair',
    price: 375,
    oldPrice: 400,
    rating: 4,
    reviews: 99,
    sale: 25,
    icon: Armchair,
    accentClassName: 'text-[#9d9d9d]',
    productSlug: 's-series-comfort-chair',
  },
  {
    title: 'Jr. Zoom Soccer Boots',
    price: 1160,
    oldPrice: 1400,
    rating: 5,
    reviews: 35,
    sale: 25,
    icon: Footprints,
    accentClassName: 'text-[#d9ab00]',
    productSlug: 'jr-zoom-soccer-boots',
  },
]

const categoryCards = [
  { label: 'Phones', icon: Smartphone, slug: 'phones' },
  { label: 'Computers', icon: Monitor, slug: 'computers' },
  { label: 'SmartWatch', icon: Watch, slug: 'smartwatch' },
  { label: 'Camera', icon: Camera, slug: 'camera', active: true },
  { label: 'HeadPhones', icon: Headphones, slug: 'headphones' },
  { label: 'Gaming', icon: Gamepad2, slug: 'gaming' },
]

const bestSellingProducts = [
  {
    title: 'The north coat',
    price: 260,
    oldPrice: 360,
    rating: 5,
    reviews: 65,
    icon: Shirt,
    accentClassName: 'text-[#f26f8b]',
    productSlug: 'the-north-coat',
  },
  {
    title: 'Gucci duffle bag',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 65,
    icon: ShoppingBag,
    accentClassName: 'text-[#7b6b62]',
    productSlug: 'gucci-duffle-bag',
  },
  {
    title: 'RGB liquid CPU Cooler',
    price: 160,
    oldPrice: 170,
    rating: 4,
    reviews: 65,
    icon: Headphones,
    accentClassName: 'text-[#7e57c2]',
    productSlug: 'rgb-liquid-cpu-cooler',
  },
  {
    title: 'Small BookSelf',
    price: 360,
    rating: 5,
    reviews: 65,
    icon: BookOpen,
    accentClassName: 'text-[#c68b55]',
    productSlug: 'small-bookshelf',
  },
]

const exploreProducts = [
  {
    title: 'Breed Dry Dog Food',
    price: 100,
    rating: 3,
    reviews: 35,
    icon: PackageCheck,
    accentClassName: 'text-[#7d5e4c]',
    productSlug: 'breed-dry-dog-food',
  },
  {
    title: 'CANON EOS DSLR Camera',
    price: 360,
    rating: 4,
    reviews: 95,
    icon: Camera,
    accentClassName: 'text-[#454545]',
    productSlug: 'canon-eos-dslr-camera',
  },
  {
    title: 'ASUS FHD Gaming Laptop',
    price: 700,
    rating: 5,
    reviews: 325,
    icon: LaptopMinimal,
    accentClassName: 'text-[#0087b3]',
    productSlug: 'asus-fhd-gaming-laptop',
  },
  {
    title: 'Curology Product Set',
    price: 500,
    rating: 4,
    reviews: 145,
    icon: Sparkles,
    accentClassName: 'text-[#7251d0]',
    productSlug: 'curology-product-set',
  },
  {
    title: 'Kids Electric Car',
    price: 960,
    rating: 5,
    reviews: 65,
    sale: 30,
    icon: CarFront,
    accentClassName: 'text-[#db4444]',
    productSlug: 'kids-electric-car',
  },
  {
    title: 'Jr. Zoom Soccer Cleats',
    price: 1160,
    rating: 4,
    reviews: 35,
    icon: Footprints,
    accentClassName: 'text-[#c4cf00]',
    productSlug: 'jr-zoom-soccer-cleats',
  },
  {
    title: 'GP11 Shooter USB Gamepad',
    price: 660,
    rating: 5,
    reviews: 55,
    sale: 20,
    icon: Gamepad2,
    accentClassName: 'text-[#1c1c1c]',
    productSlug: 'gp11-shooter-usb-gamepad',
  },
  {
    title: 'Quilted Satin Jacket',
    price: 660,
    rating: 4,
    reviews: 55,
    icon: Shirt,
    accentClassName: 'text-[#47634d]',
    productSlug: 'quilted-satin-jacket',
  },
]

const services = [
  {
    title: 'FREE AND FAST DELIVERY',
    copy: 'Free delivery for all orders over $140',
    icon: Truck,
  },
  {
    title: '24/7 CUSTOMER SERVICE',
    copy: 'Friendly 24/7 customer support',
    icon: Headphones,
  },
  {
    title: 'MONEY BACK GUARANTEE',
    copy: 'We return money within 30 days',
    icon: ShieldCheck,
  },
]

function HomePage() {
  const { isAuthenticated } = useAuth()
  const { catalogProducts } = useCommerce()
  const productsBySlug = new Map(catalogProducts.map((product) => [product.productSlug, product]))
  const mergeProductLists = (...lists) => {
    const products = lists.flat().filter(Boolean)
    const slugs = new Set()

    return products.filter((product) => {
      if (slugs.has(product.productSlug)) return false
      slugs.add(product.productSlug)
      return true
    })
  }
  const visibleFlashSaleProducts = mergeProductLists(
    catalogProducts.filter((product) => product.isFlashSale),
    flashSaleProducts.map((product) => productsBySlug.get(product.productSlug) ?? product),
  ).slice(0, 5)
  const visibleBestSellingProducts = mergeProductLists(
    catalogProducts.filter((product) => product.isBestSelling),
    bestSellingProducts.map((product) => productsBySlug.get(product.productSlug) ?? product),
  ).slice(0, 4)
  const visibleExploreProducts = mergeProductLists(
    catalogProducts.filter((product) => product.isNewArrival),
    exploreProducts.map((product) => productsBySlug.get(product.productSlug) ?? product),
  ).slice(0, 8)
  const heroProductState = {
    product: {
      title: 'iPhone 14 Series',
      price: 899,
      oldPrice: 999,
      rating: 5,
      reviews: 120,
    },
  }
  const heroNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: 'iPhone 14 Series',
    authenticatedTo: '/products/iphone-14-series',
    authenticatedState: heroProductState,
  })
  const shopNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: 'Shop',
    authenticatedTo: '/shop',
  })
  const playstationNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: 'PlayStation 5',
    authenticatedTo: '/products/playstation-5',
    authenticatedState: {
      product: {
        title: 'PlayStation 5',
        price: 799,
        rating: 5,
        reviews: 64,
      },
    },
  })
  const womensCollectionNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: "Women's Collections",
    authenticatedTo: '/collections/womens-collections',
    authenticatedState: {
      collectionName: "Women's Collections",
      label: "Women's Collections",
    },
  })
  const speakersNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: 'Speakers',
    authenticatedTo: '/products/speakers',
    authenticatedState: {
      product: {
        title: 'Speakers',
        price: 299,
        rating: 5,
        reviews: 48,
      },
    },
  })
  const perfumeNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: 'Perfume',
    authenticatedTo: '/products/perfume',
    authenticatedState: {
      product: {
        title: 'Perfume',
        price: 180,
        rating: 4,
        reviews: 28,
      },
    },
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20">
        <section className="grid gap-7 pt-10 lg:grid-cols-[220px,1fr]">
          <aside className="border-r border-black/10 pr-4">
            <div className="space-y-4 text-sm">
              {sidebarItems.map((item) => (
                (() => {
                  const categoryNavigation = getStorefrontNavigation({
                    isAuthenticated,
                    label: item.label,
                    authenticatedTo: `/categories/${item.slug}`,
                    authenticatedState: {
                      categoryName: item.label,
                      label: item.label,
                    },
                  })

                  return (
                    <Link
                      className="flex items-center justify-between transition hover:text-brand"
                      key={item.slug}
                      state={categoryNavigation.state}
                      to={categoryNavigation.to}
                    >
                      <span>{item.label}</span>
                      {item.label.includes('Fashion') ? (
                        <ArrowRight className="h-3.5 w-3.5 text-black/50" aria-hidden="true" />
                      ) : null}
                    </Link>
                  )
                })()
              ))}
            </div>
          </aside>

          <div className="overflow-hidden bg-black">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr,420px]">
              <div className="px-8 py-10 sm:px-14 sm:py-14">
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <Smartphone className="h-8 w-8" aria-hidden="true" />
                  <span>iPhone 14 Series</span>
                </div>

                <h1 className="mt-5 max-w-[294px] text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Up to 10% off Voucher
                </h1>

                <Link
                  className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-white underline underline-offset-4 transition hover:text-white/80"
                  state={heroNavigation.state}
                  to={heroNavigation.to}
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="flex justify-end">
                <img
                  alt="Featured phone banner"
                  className="w-full max-w-[420px]"
                  src="/hero-phone-dark.svg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pt-24">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">Today&apos;s</p>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              <h2 className="text-3xl font-semibold">Flash Sales</h2>
              <div className="flex gap-4">
                {[
                  ['Days', '03'],
                  ['Hours', '23'],
                  ['Minutes', '19'],
                  ['Seconds', '56'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium">{label}</p>
                    <p className="mt-1 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {visibleFlashSaleProducts.map((product) => (
              <ProductCard key={product.productSlug} {...product} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              className="inline-flex items-center justify-center bg-brand px-12 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
              state={shopNavigation.state}
              to={shopNavigation.to}
            >
              View All Products
            </Link>
          </div>
        </section>

        <section className="border-t border-black/10 pt-20">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">Categories</p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold">Browse By Category</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categoryCards.map((category) => {
              const Icon = category.icon
              const categoryNavigation = getStorefrontNavigation({
                isAuthenticated,
                label: category.label,
                authenticatedTo: `/categories/${category.slug}`,
                authenticatedState: {
                  categoryName: category.label,
                  label: category.label,
                },
              })

              return (
                <Link
                  className={`flex flex-col items-center justify-center border px-4 py-7 text-center transition ${
                    category.active
                      ? 'border-brand bg-brand text-white'
                      : 'border-black/20 bg-white text-black'
                  }`}
                  key={category.slug}
                  state={categoryNavigation.state}
                  to={categoryNavigation.to}
                >
                  <Icon className="h-8 w-8" aria-hidden="true" />
                  <p className="mt-4 text-sm">{category.label}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="border-t border-black/10 pt-20">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">This Month</p>
          </div>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-semibold">Best Selling Products</h2>
            <Link
              className="inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
              state={shopNavigation.state}
              to={shopNavigation.to}
            >
              View All
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleBestSellingProducts.map((product) => (
              <ProductCard key={product.productSlug} {...product} />
            ))}
          </div>
        </section>

        <section className="pt-20">
          <div className="grid items-center gap-8 bg-black px-8 py-10 text-white sm:px-14 lg:grid-cols-[1fr,420px]">
            <div>
              <p className="text-base font-semibold text-[#00ff66]">Categories</p>
              <h2 className="mt-8 max-w-[443px] text-4xl font-semibold leading-tight">
                Enhance Your Music Experience
              </h2>

              <div className="mt-8 flex gap-4">
                {[
                  ['23', 'Hours'],
                  ['05', 'Days'],
                  ['59', 'Minutes'],
                  ['35', 'Seconds'],
                ].map(([value, label]) => (
                  <div
                    className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white text-black"
                    key={label}
                  >
                    <span className="text-base font-semibold">{value}</span>
                    <span className="text-[11px]">{label}</span>
                  </div>
                ))}
              </div>

              <ProtectedActionLink
                actionKey="checkout"
                className="mt-10 bg-[#00ff66] px-12 text-black hover:bg-[#00e55c]"
                label="Buy Now"
                variant="button"
              />
            </div>

            <div>
              <img
                alt="Speaker promotion banner"
                className="w-full"
                src="/speaker-scene.svg"
              />
            </div>
          </div>
        </section>

        <section className="pt-20">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">Our Products</p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold">Explore Our Products</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleExploreProducts.map((product) => (
              <ProductCard key={product.productSlug} {...product} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              className="inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
              state={shopNavigation.state}
              to={shopNavigation.to}
            >
              View All Products
            </Link>
          </div>
        </section>

        <section className="pt-20">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">Featured</p>
          </div>

          <h2 className="mt-5 text-3xl font-semibold">New Arrival</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="relative flex min-h-[600px] items-end overflow-hidden bg-black p-8 text-white">
              <img
                alt="Playstation feature artwork"
                className="absolute inset-0 h-full w-full object-cover opacity-85"
                src="/playstation-scene.svg"
              />
              <div className="relative z-10 max-w-[242px]">
                <h3 className="text-2xl font-semibold">PlayStation 5</h3>
                <p className="mt-4 text-sm leading-6 text-white/80">
                  Black and White version of the PS5 coming out on sale.
                </p>
                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
                  state={playstationNavigation.state}
                  to={playstationNavigation.to}
                >
                  <span>Shop Now</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="relative flex min-h-[284px] items-end overflow-hidden bg-black px-8 py-7 text-white">
                <div className="absolute right-8 top-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
                  <ShoppingBag className="h-14 w-14" aria-hidden="true" />
                </div>
                <div className="relative z-10 max-w-[255px]">
                  <h3 className="text-2xl font-semibold">Women&apos;s Collections</h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Featured woman collections that give you another vibe.
                  </p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
                    state={womensCollectionNavigation.state}
                    to={womensCollectionNavigation.to}
                  >
                    <span>Shop Now</span>
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative flex min-h-[284px] items-end overflow-hidden bg-black px-8 py-7 text-white">
                  <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                    <Speaker className="h-12 w-12" aria-hidden="true" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold">Speakers</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">Amazon wireless speakers</p>
                    <Link
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
                      state={speakersNavigation.state}
                      to={speakersNavigation.to}
                    >
                      <span>Shop Now</span>
                    </Link>
                  </div>
                </div>

                <div className="relative flex min-h-[284px] items-end overflow-hidden bg-black px-8 py-7 text-white">
                  <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                    <Sparkles className="h-12 w-12" aria-hidden="true" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold">Perfume</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">GUCCI INTENSE OUD EDP</p>
                    <Link
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
                      state={perfumeNavigation.state}
                      to={perfumeNavigation.to}
                    >
                      <span>Shop Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-4 pt-24">
          <div className="grid gap-10 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <div className="text-center" key={service.title}>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-black/60">{service.copy}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
