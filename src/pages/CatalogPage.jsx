import React from 'react'
import { ArrowRight, Search, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { getProductSearchText, productMatchesCatalogPage } from '../utils/product-helpers.js'
import { formatSlugLabel } from '../utils/routes.js'

function CatalogPage({ type = 'category' }) {
  const location = useLocation()
  const params = useParams()
  const { catalogProducts } = useCommerce()
  const [query, setQuery] = React.useState('')
  const slug = params.slug ?? 'shop'
  const label =
    location.state?.label ??
    location.state?.categoryName ??
    location.state?.collectionName ??
    formatSlugLabel(slug)

  const eyebrow = type === 'collection' ? 'Featured Collection' : 'Category'
  const title = type === 'collection' ? `${label} Collection` : label
  const description =
    type === 'collection'
      ? `Explore products selected for the ${label} collection.`
      : `Browse products in ${label} with the same cart, wishlist, checkout, and order flow as the main shop.`
  const normalizedQuery = query.trim().toLowerCase()
  const categoryProducts = React.useMemo(
    () =>
      catalogProducts.filter((product) => {
        const matchesQuery =
          !normalizedQuery ||
          getProductSearchText(product).includes(normalizedQuery)

        return productMatchesCatalogPage(product, label, type) && matchesQuery
      }),
    [catalogProducts, label, normalizedQuery, type],
  )

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">{title}</span>
        </div>

        <section className="mt-10 bg-black px-8 py-12 text-white sm:px-12">
          <p className="text-sm font-medium text-brand">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight">{title}</h1>
          <p className="mt-5 max-w-[540px] text-sm leading-7 text-white/75">{description}</p>
          <Link
            className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-white underline underline-offset-4"
            to="/shop"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="mt-10 border border-black/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{label} Products</h2>
              <p className="mt-2 text-sm text-black/60">
                {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-black/15 px-4 py-3">
              <Search className="h-4 w-4 text-black/45" aria-hidden="true" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/35 sm:w-[240px]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this page"
                type="text"
                value={query}
              />
            </div>
          </div>

          {categoryProducts.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.productSlug} {...product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-black/15 bg-[#fcfcfc] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">No products found</h3>
              <p className="mt-3 text-sm text-black/60">
                Clear the search or open the full shop to browse every category.
              </p>
              <Link className="mt-6 inline-flex text-sm font-medium text-brand" to="/shop">
                View all products
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CatalogPage
