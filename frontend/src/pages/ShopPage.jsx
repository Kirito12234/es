import React from 'react'
import { ArrowRight, PackagePlus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { getProductSearchText } from '../utils/product-helpers.js'

function ShopPage() {
  const { isSeller } = useAuth()
  const { catalogProducts, sellerProducts } = useCommerce()
  const [query, setQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const categories = React.useMemo(
    () => ['All', ...new Set(catalogProducts.map((product) => product.category).filter(Boolean))],
    [catalogProducts],
  )

  const filteredProducts = React.useMemo(
    () =>
      catalogProducts.filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          !normalizedQuery ||
          getProductSearchText(product).includes(normalizedQuery)

        return matchesCategory && matchesQuery
      }),
    [catalogProducts, query, selectedCategory],
  )

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">Shop</span>
        </div>

        <section className="mt-10 rounded-[32px] bg-black px-8 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-brand">Storefront</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight">Explore all products</h1>
              <p className="mt-4 max-w-[620px] text-sm leading-7 text-white/72">
                Browse the connected product catalog, including custom listings added from
                the seller dashboard with image and video support.
              </p>
            </div>

            {isSeller ? <div className="flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-white/35"
                to="/dashboard"
              >
                <span>Seller Dashboard</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex items-center gap-3 bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to="/add-product"
              >
                <PackagePlus className="h-4 w-4" aria-hidden="true" />
                <span>Add Product</span>
              </Link>
            </div> : null}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-black/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Product Catalog</h2>
              <p className="mt-2 text-sm text-black/60">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found.
                {isSeller && sellerProducts.length
                  ? ` ${sellerProducts.length} from your seller account.`
                  : ''}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-3 border border-black/15 px-4 py-3">
                <Search className="h-4 w-4 text-black/45" aria-hidden="true" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-black/35 sm:w-[220px]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  type="text"
                  value={query}
                />
              </div>

              <select
                className="border border-black/15 px-4 py-3 text-sm outline-none"
                onChange={(event) => setSelectedCategory(event.target.value)}
                value={selectedCategory}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productSlug} {...product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-black/15 bg-[#fcfcfc] px-6 py-16 text-center">
              <h3 className="text-2xl font-semibold">No products match this filter</h3>
              <p className="mt-3 text-sm text-black/60">
                Try another search term or clear the category filter.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ShopPage
