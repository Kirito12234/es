import { ArrowRight, ListChecks, PackagePlus, ShoppingBag, Store, Trash2, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

function SellerDashboardPage() {
  const { user } = useAuth()
  const { activeOrders, deleteProduct, sellerProducts } = useCommerce()
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleteMessage, setDeleteMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    setDeleteMessage('')
    const result = await deleteProduct(productToDelete.productSlug)
    setIsDeleting(false)
    setDeleteMessage(result.message)

    if (result.success) setProductToDelete(null)
  }

  const totalInventoryValue = sellerProducts.reduce(
    (runningTotal, product) => runningTotal + product.price * (product.stockQuantity ?? 0),
    0,
  )
  const lowStockProducts = sellerProducts.filter(
    (product) => Number(product.stockQuantity ?? 0) > 0 && Number(product.stockQuantity ?? 0) <= 5,
  )

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">Dashboard</span>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[32px] bg-black px-8 py-10 text-white shadow-panel sm:px-10">
            <p className="text-sm font-medium text-brand">Seller Dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Welcome back, {user?.firstName || user?.name || 'Seller'}
            </h1>
            <p className="mt-4 max-w-[620px] text-sm leading-7 text-white/72">
              Manage your product listings, review store activity, and add new items
              with full product details, images, and video from one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center gap-3 bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to="/add-product"
              >
                <PackagePlus className="h-4 w-4" aria-hidden="true" />
                <span>Add Product</span>
              </Link>
              <Link
                className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-white/35"
                to="/dashboard/product-features"
              >
                <ListChecks className="h-4 w-4" aria-hidden="true" />
                <span>Product Features</span>
              </Link>
              <Link
                className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-white/35"
                to="/shop"
              >
                <span>View Storefront</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <article className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Store className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm text-black/55">Active Listings</p>
              <p className="mt-2 text-3xl font-semibold">{sellerProducts.length}</p>
            </article>

            <article className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Wallet className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm text-black/55">Inventory Value</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalInventoryValue)}</p>
            </article>

            <article className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm text-black/55">Customer Orders</p>
              <p className="mt-2 text-3xl font-semibold">{activeOrders.length}</p>
            </article>

            <article className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <PackagePlus className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm text-black/55">Low Stock Alerts</p>
              <p className="mt-2 text-3xl font-semibold">{lowStockProducts.length}</p>
            </article>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1fr,340px]">
          <div className="rounded-[32px] bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-brand">Your Products</p>
                <h2 className="mt-2 text-3xl font-semibold">Product listings</h2>
              </div>

              <Link
                className="inline-flex items-center justify-center border border-black/15 px-5 py-3 text-sm font-medium transition hover:border-black"
                to="/add-product"
              >
                Add New Product
              </Link>
              <Link
                className="inline-flex items-center justify-center border border-black/15 px-5 py-3 text-sm font-medium transition hover:border-black"
                to="/dashboard/product-features"
              >
                Feature Defaults
              </Link>
            </div>

            {sellerProducts.length ? (
              <>
                {deleteMessage ? (
                  <div className="mt-6 border border-brand/20 bg-brand-soft px-5 py-4 text-sm text-brand">
                    {deleteMessage}
                  </div>
                ) : null}
              <div className="mt-8 overflow-hidden rounded-[24px] border border-black/10">
                <div className="hidden grid-cols-[1.6fr,0.7fr,0.65fr,0.7fr] gap-4 bg-[#fafafa] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-black/45 md:grid">
                  <p>Product</p>
                  <p>Category</p>
                  <p>Stock</p>
                  <p>Price</p>
                </div>

                <div className="divide-y divide-black/10">
                  {sellerProducts.map((product) => (
                    <article
                      className="grid gap-4 px-6 py-5 md:grid-cols-[1.6fr,0.7fr,0.65fr,0.7fr] md:items-center"
                      key={product.id}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f5f5] p-2">
                          <ProductVisual
                            iconClassName={`h-8 w-8 ${product.accentClassName}`}
                            imageClassName="max-h-12 max-w-full object-contain"
                            placeholderClassName="flex h-8 w-8 items-center justify-center text-black/40"
                            product={product}
                            videoClassName="max-h-12 max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <Link
                            className="text-sm font-medium text-black transition hover:text-brand"
                            to={`/products/${product.productSlug}`}
                          >
                            {product.title}
                          </Link>
                          <p className="mt-1 text-xs text-black/50">
                            Added {formatDate(product.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-black/65">{product.category}</div>
                      <div className="text-sm text-black/65">
                        {product.stockQuantity ?? 0}
                        {product.isNewArrival ? (
                          <span className="ml-2 text-xs font-medium text-brand">New</span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-brand">
                        <span>{formatCurrency(product.price)}</span>
                        <div className="flex items-center gap-2">
                          <Link
                            className="border border-black/15 px-3 py-2 text-xs font-medium text-black transition hover:border-brand hover:text-brand"
                            to={`/edit-product/${product.productSlug}`}
                          >
                            Edit
                          </Link>
                          <button
                            aria-label={`Delete ${product.title}`}
                            className="inline-flex items-center gap-1 border border-brand/30 px-3 py-2 text-xs font-medium text-brand transition hover:bg-brand hover:text-white"
                            onClick={() => {
                              setDeleteMessage('')
                              setProductToDelete(product)
                            }}
                            type="button"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              </>
            ) : (
              <div className="mt-8 rounded-[24px] border border-dashed border-black/15 bg-[#fcfcfc] px-6 py-16 text-center">
                <h3 className="text-2xl font-semibold">No products added yet</h3>
                <p className="mt-3 text-sm text-black/60">
                  Create your first listing with title, price, description, images, and video.
                </p>
                <Link
                  className="mt-8 inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                  to="/add-product"
                >
                  Add Your First Product
                </Link>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] bg-white p-8 shadow-soft">
              <p className="text-sm font-medium text-brand">Seller Notes</p>
              <h2 className="mt-2 text-2xl font-semibold">What the add-product page supports</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-black/60">
                <p>1. Product title with auto-generated product slug.</p>
                <p>2. Price, previous price, category, stock quantity, colors, and size options.</p>
                <p>3. Product description for full listing details.</p>
                <p>4. Upload images and one product video with instant preview before saving.</p>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-soft">
              <p className="text-sm font-medium text-brand">Low Stock</p>
              <h2 className="mt-2 text-2xl font-semibold">Attention needed</h2>

              {lowStockProducts.length ? (
                <div className="mt-6 space-y-4">
                  {lowStockProducts.map((product) => (
                    <div className="flex items-center justify-between gap-4" key={product.id}>
                      <div>
                        <p className="text-sm font-medium">{product.title}</p>
                        <p className="mt-1 text-xs text-black/50">{product.stockQuantity} left</p>
                      </div>
                      <Link className="text-sm font-medium text-brand" to={`/products/${product.productSlug}`}>
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-black/60">
                  No low-stock products right now.
                </p>
              )}
            </div>
          </aside>
        </section>

        {productToDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
            <div className="w-full max-w-md bg-white p-8 shadow-panel">
              <p className="text-sm font-medium text-brand">Delete Product</p>
              <h2 className="mt-3 text-2xl font-semibold">Delete {productToDelete.title}?</h2>
              <p className="mt-4 text-sm leading-7 text-black/60">
                This permanently removes the product from the storefront and database.
              </p>
              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  className="border border-black/15 px-5 py-3 text-sm font-medium"
                  disabled={isDeleting}
                  onClick={() => setProductToDelete(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="bg-brand px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                  disabled={isDeleting}
                  onClick={handleDeleteProduct}
                  type="button"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default SellerDashboardPage
