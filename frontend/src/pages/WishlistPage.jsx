import { Eye, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency } from '../utils/formatters.js'

function WishlistCard({ product, onPrimaryAction, onRemove }) {
  return (
    <div>
      <div className="relative bg-[#f5f5f5] px-5 pb-0 pt-4">
        {product.sale ? (
          <span className="absolute left-3 top-3 inline-flex rounded bg-brand px-2 py-1 text-[10px] font-medium text-white">
            -{product.sale}%
          </span>
        ) : null}

        <button
          aria-label={`Remove ${product.title}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:text-brand"
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex h-36 items-center justify-center">
          <ProductVisual
            iconClassName={`h-16 w-16 ${product.accentClassName}`}
            imageClassName="max-h-32 max-w-full object-contain"
            placeholderClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black/40"
            product={product}
            videoClassName="max-h-32 max-w-full object-contain"
          />
        </div>

        <button
          className="mt-4 flex w-full items-center justify-center gap-2 bg-black py-2 text-center text-xs font-medium text-white transition hover:bg-brand"
          onClick={onPrimaryAction}
          type="button"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          <span>Add To Cart</span>
        </button>
      </div>

      <div className="pt-4">
        <Link
          className="text-sm font-medium text-black transition hover:text-brand"
          to={`/products/${product.productSlug}`}
        >
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-medium text-brand">{formatCurrency(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-black/50 line-through">{formatCurrency(product.oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ product, onAddToCart }) {
  return (
    <div>
      <div className="relative bg-[#f5f5f5] px-5 pb-0 pt-4">
        {product.sale ? (
          <span className="absolute left-3 top-3 inline-flex rounded bg-brand px-2 py-1 text-[10px] font-medium text-white">
            -{product.sale}%
          </span>
        ) : null}

        <Link
          aria-label={`View ${product.title}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:text-brand"
          to={`/products/${product.productSlug}`}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="flex h-36 items-center justify-center">
          <ProductVisual
            iconClassName={`h-16 w-16 ${product.accentClassName}`}
            imageClassName="max-h-32 max-w-full object-contain"
            placeholderClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black/40"
            product={product}
            videoClassName="max-h-32 max-w-full object-contain"
          />
        </div>

        <button
          className="mt-4 flex w-full items-center justify-center gap-2 bg-black py-2 text-center text-xs font-medium text-white transition hover:bg-brand"
          onClick={onAddToCart}
          type="button"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          <span>Add To Cart</span>
        </button>
      </div>

      <div className="pt-4">
        <Link
          className="text-sm font-medium text-black transition hover:text-brand"
          to={`/products/${product.productSlug}`}
        >
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-medium text-brand">{formatCurrency(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-black/50 line-through">{formatCurrency(product.oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function WishlistPage() {
  const navigate = useNavigate()
  const {
    addToCart,
    catalogProducts,
    moveAllWishlistToCart,
    moveWishlistItemToCart,
    removeFromWishlist,
    wishlistProducts,
  } = useCommerce()

  const recommendations = catalogProducts
    .filter(
      (product) =>
        !wishlistProducts.some((wishlistProduct) => wishlistProduct.productSlug === product.productSlug),
    )
    .slice(0, 4)

  const handleMoveAll = async () => {
    if (!wishlistProducts.length) {
      return
    }

    await moveAllWishlistToCart()
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-medium">Wishlist ({wishlistProducts.length})</h1>
            <button
              className="inline-flex items-center justify-center border border-black/20 px-10 py-4 text-sm font-medium text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!wishlistProducts.length}
              onClick={handleMoveAll}
              type="button"
            >
              Move All To Bag
            </button>
          </div>

          {wishlistProducts.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistProducts.map((product) => (
                <WishlistCard
                  key={product.productSlug}
                  onPrimaryAction={async () => {
                    await moveWishlistItemToCart(product.productSlug)
                    navigate('/cart')
                  }}
                  onRemove={() => removeFromWishlist(product.productSlug)}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-black/10 bg-[#faf7f4] px-6 py-14 text-center">
              <Heart className="mx-auto h-10 w-10 text-brand" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
              <p className="mt-3 text-sm text-black/60">
                Save products here and move them into the cart any time.
              </p>
              <Link
                className="mt-8 inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to="/shop"
              >
                Browse Products
              </Link>
            </div>
          )}
        </section>

        <section className="pt-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-block h-10 w-5 bg-brand" />
              <p className="text-sm font-semibold text-black">Just For You</p>
            </div>

            <Link
              className="inline-flex items-center justify-center border border-black/20 px-10 py-4 text-sm font-medium text-black transition hover:border-black"
              to="/shop"
            >
              See All
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product) => (
              <RecommendationCard
                key={product.productSlug}
                onAddToCart={() => addToCart(product.productSlug)}
                product={product}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default WishlistPage
