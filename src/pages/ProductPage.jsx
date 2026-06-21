import React from 'react'
import {
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { formatCurrency } from '../utils/formatters.js'
import { formatSlugLabel } from '../utils/routes.js'

function ProductPageContent({ slug }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart, addToWishlist, catalogProducts, getProductBySlug, isInWishlist } =
    useCommerce()
  const location = useLocation()
  const product = {
    ...(getProductBySlug(slug) ?? {}),
    ...(location.state?.product ?? {}),
  }

  const productTitle = product.title ?? formatSlugLabel(slug)
  const productPrice = product.price ?? 199
  const oldPrice = product.oldPrice
  const rating = product.rating ?? 5
  const reviews = product.reviews ?? 88
  const ProductIcon = product.icon
  const colors = product.colors ?? [
    { value: '#A0BCE0', ringClassName: 'ring-black/10' },
    { value: '#DB4444', ringClassName: 'ring-black/10' },
  ]
  const sizes = product.sizes ?? ['XS', 'S', 'M', 'L']
  const galleryBackgrounds = product.galleryBackgrounds ?? [
    'bg-[#f5f5f5]',
    'bg-[#fff2f2]',
    'bg-[#eef7fb]',
    'bg-[#f8f3ff]',
  ]
  const productMedia = Array.isArray(product.media) ? product.media : []
  const isWishlisted = isInWishlist(slug)
  const relatedProducts = catalogProducts
    .filter((candidate) => candidate.productSlug !== slug)
    .slice(0, 4)
  const productHighlights = product.highlights?.length
    ? product.highlights
    : [
        `${productTitle} is ready for everyday use with reliable quality.`,
        product.category ? `Designed for ${product.category.toLowerCase()} shoppers.` : 'Built with a practical, purchase-ready setup.',
        oldPrice ? `Limited offer saves ${formatCurrency(oldPrice - productPrice)} compared with the regular price.` : 'Available at a clear storefront price.',
      ]
  const colorLabels = colors.map((color) => color.value).join(', ')
  const productSpecifications = [
    ['Brand', product.brand],
    ['SKU', product.sku || slug.toUpperCase()],
    ['Category', product.category ?? 'Products'],
    ['Availability', product.stockLabel ?? 'In Stock'],
    ['Price', formatCurrency(productPrice)],
    oldPrice ? ['Regular Price', formatCurrency(oldPrice)] : null,
    ['Rating', `${rating}/5 from ${reviews} reviews`],
    ['Sizes', sizes.join(', ')],
    ['Colours', colorLabels],
    ['Delivery', product.delivery || 'Free delivery is available on eligible orders.'],
    ['Warranty', product.warranty || 'Standard product warranty applies.'],
    ['Return Policy', product.returnPolicy || 'Free 30 days return delivery after purchase.'],
  ].filter(Boolean)

  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0)
  const [selectedColor, setSelectedColor] = React.useState(colors[0]?.value ?? '#A0BCE0')
  const [selectedSize, setSelectedSize] = React.useState(sizes[0] ?? 'M')
  const [quantity, setQuantity] = React.useState(1)
  const [wishlistMessage, setWishlistMessage] = React.useState('')

  const handleProtectedProductAction = async ({ actionLabel, onSuccess, to }) => {
    if (!isAuthenticated) {
      navigate('/signup', {
        state: {
          requestedAction: actionLabel,
          actionKey: actionLabel.toLowerCase(),
        },
      })
      return
    }

    const result = await onSuccess?.()
    if (result && result.success === false) {
      return
    }
    navigate(to)
  }

  const handleAddQuantity = () => {
    setQuantity((currentQuantity) => Math.min(99, currentQuantity + 1))
  }

  const handleRemoveQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      navigate('/signup', {
        state: {
          requestedAction: 'Wishlist',
          actionKey: 'wishlist',
        },
      })
      return
    }

    const result = await addToWishlist(slug)
    setWishlistMessage(result.success ? 'OK' : result.message || 'Failed')

    window.setTimeout(() => {
      setWishlistMessage('')
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <Link className="hover:text-black" to="/shop">
            {product.category ?? 'Products'}
          </Link>{' '}
          / <span className="text-black">{productTitle}</span>
        </div>

        <section className="mt-12 grid gap-10 lg:grid-cols-[0.94fr,1.06fr]">
          <div className="grid gap-4 md:grid-cols-[170px,1fr]">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {(productMedia.length ? productMedia : galleryBackgrounds).map((galleryItem, index) => (
                <button
                  className={`flex h-[138px] items-center justify-center border transition ${
                    activeGalleryIndex === index
                      ? 'border-brand bg-white'
                      : 'border-transparent bg-[#f5f5f5]'
                  }`}
                  key={`${productTitle}-thumb-${index}`}
                  onClick={() => setActiveGalleryIndex(index)}
                  type="button"
                >
                  {productMedia.length ? (
                    <ProductVisual
                      imageClassName="h-24 w-full object-contain"
                      media={galleryItem}
                      placeholderClassName="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f5f5f5] text-black/40"
                      product={product}
                      videoClassName="h-24 w-full object-contain"
                    />
                  ) : ProductIcon ? (
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-2xl ${galleryItem}`}
                    >
                      <ProductIcon
                        className={`h-12 w-12 ${product.accentClassName ?? 'text-black'} ${
                          index % 2 === 0 ? 'scale-100' : 'scale-90'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="flex min-h-[600px] items-center justify-center bg-[#f5f5f5] p-8">
              {productMedia.length ? (
                <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-white p-8">
                  <ProductVisual
                    imageClassName="h-full w-full object-contain"
                    media={productMedia[activeGalleryIndex] ?? productMedia[0]}
                    product={product}
                    showVideoControls={(productMedia[activeGalleryIndex] ?? productMedia[0])?.kind === 'video'}
                    videoClassName="h-full w-full object-contain"
                  />
                </div>
              ) : ProductIcon ? (
                <div
                  className={`flex h-full w-full items-center justify-center rounded-[28px] ${
                    galleryBackgrounds[activeGalleryIndex] ?? 'bg-[#f5f5f5]'
                  }`}
                >
                  <ProductIcon
                    className={`h-48 w-48 ${product.accentClassName ?? 'text-black'} sm:h-56 sm:w-56`}
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-semibold">{productTitle}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-[#ffad33]">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    className="h-4 w-4"
                    fill={index < Math.round(rating) ? 'currentColor' : 'none'}
                    key={`${productTitle}-${index}`}
                    strokeWidth={1.8}
                  />
                ))}
              </div>
              <span className="text-black/50">({reviews} Reviews)</span>
              <span className="text-[#00ff66]">{product.stockLabel ?? 'In Stock'}</span>
            </div>

            <div className="mt-6 flex items-center gap-4 text-2xl">
              <span className="font-medium text-brand">{formatCurrency(productPrice)}</span>
              {oldPrice ? <span className="text-base text-black/40 line-through">{formatCurrency(oldPrice)}</span> : null}
            </div>

            <p className="mt-6 border-b border-black/10 pb-6 text-sm leading-7 text-black/65">
              {product.description ??
                'This product page now supports working variant selection, quantity controls, cart flow, wishlist flow, and related items.'}
            </p>

            <div className="mt-6 flex items-center gap-6">
              <span className="text-xl font-medium">Colours:</span>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    aria-label={`Select colour ${color.value}`}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                      selectedColor === color.value ? 'border-black' : 'border-transparent'
                    }`}
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    type="button"
                  >
                    <span
                      className={`block h-4 w-4 rounded-full ring-1 ${color.ringClassName}`}
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <span className="text-xl font-medium">Size:</span>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    className={`inline-flex h-8 min-w-8 items-center justify-center border px-3 text-sm font-medium transition ${
                      selectedSize === size
                        ? 'border-brand bg-brand text-white'
                        : 'border-black/20 bg-white text-black hover:border-black'
                    }`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-black/20">
                <button
                  className="flex h-11 w-10 items-center justify-center transition hover:bg-brand hover:text-white"
                  onClick={handleRemoveQuantity}
                  type="button"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="flex h-11 min-w-14 items-center justify-center border-x border-black/20 text-base font-medium">
                  {quantity}
                </span>
                <button
                  className="flex h-11 w-10 items-center justify-center bg-brand text-white transition hover:bg-brand-dark"
                  onClick={handleAddQuantity}
                  type="button"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                className="inline-flex h-11 items-center justify-center bg-brand px-12 text-sm font-medium text-white transition hover:bg-brand-dark"
                onClick={() =>
                  handleProtectedProductAction({
                    actionLabel: 'Checkout',
                    onSuccess: () => addToCart(slug, quantity),
                    to: '/checkout',
                  })
                }
                type="button"
              >
                Buy Now
              </button>

              <button
                className="inline-flex h-11 w-11 items-center justify-center border border-black/20 text-black transition hover:border-black"
                onClick={handleWishlistClick}
                type="button"
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
              {wishlistMessage ? (
                <span className="inline-flex h-11 items-center border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-700">
                  {wishlistMessage}
                </span>
              ) : null}
            </div>

            <button
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-black/65 transition hover:text-brand"
              onClick={() =>
                handleProtectedProductAction({
                  actionLabel: 'Cart',
                  onSuccess: () => addToCart(slug, quantity),
                  to: '/cart',
                })
              }
              type="button"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              <span>Add {quantity} to Cart</span>
            </button>

            <div className="mt-10 overflow-hidden border border-black/20">
              <div className="border-b border-black/20 px-4 py-6">
                <p className="text-base font-medium">Product Features</p>
                <div className="mt-4 grid gap-2 text-sm text-black/65">
                  {productHighlights.map((highlight) => (
                    <div className="flex items-center gap-2" key={highlight}>
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-black/20 px-4 py-6">
                <p className="text-base font-medium">All Specifications</p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {productSpecifications.map(([label, value]) => (
                    <div className="border border-black/10 px-3 py-3" key={label}>
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">{label}</p>
                      <p className="mt-1 text-black/75">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-b border-black/20 px-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                  <Truck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-base font-medium">Free Delivery</p>
                  <p className="mt-1 text-xs text-black/60">
                    {product.delivery || 'Enter your postal code for delivery availability.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 px-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                  <RefreshCcw className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-base font-medium">Return Delivery</p>
                  <p className="mt-1 text-xs text-black/60">
                    {product.returnPolicy || product.warranty || 'Free 30 days delivery returns. Details inside your order history.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-20">
          <div className="flex items-center gap-4">
            <span className="inline-block h-10 w-5 bg-brand" />
            <p className="text-sm font-semibold text-brand">Related Item</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.productSlug} {...relatedProduct} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ProductPage() {
  const { slug = 'product' } = useParams()

  return <ProductPageContent key={slug} slug={slug} />
}

export default ProductPage
