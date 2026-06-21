import { Eye, Heart, Star } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { formatCurrency } from '../utils/formatters.js'
import { getStorefrontNavigation } from '../utils/routes.js'
import ProductVisual from './ProductVisual.jsx'

function ProductCard({
  title,
  price,
  oldPrice,
  rating,
  reviews,
  sale,
  icon: Icon,
  accentClassName = 'text-black',
  ctaLabel = 'Add To Cart',
  requestedAction = 'Cart',
  productSlug = '',
  media,
  thumbnailUrl,
  brand,
  brandLogoUrl,
}) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart, addToWishlist, isInWishlist } = useCommerce()
  const [wishlistMessage, setWishlistMessage] = useState('')
  const productPreview = {
    title,
    icon: Icon,
    accentClassName,
    media,
    thumbnailUrl,
    brand,
    brandLogoUrl,
  }
  const productState = {
    product: {
      title,
      price,
      oldPrice,
      rating,
      reviews,
      icon: Icon,
      accentClassName,
      media,
      thumbnailUrl,
      brand,
      brandLogoUrl,
    },
  }
  const productNavigation = getStorefrontNavigation({
    isAuthenticated,
    label: title,
    authenticatedTo: `/products/${productSlug}`,
    authenticatedState: productState,
  })
  const isWishlisted = isInWishlist(productSlug)

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

    const result = await addToWishlist(productSlug)
    setWishlistMessage(result.success ? 'OK' : result.message || 'Failed')

    window.setTimeout(() => {
      setWishlistMessage('')
    }, 1800)
  }

  return (
    <div className="group">
      <div className="relative bg-[#f5f5f5] px-5 pb-0 pt-4">
        {sale ? (
          <span className="absolute left-3 top-3 inline-flex rounded bg-brand px-2 py-1 text-[10px] font-medium text-white">
            -{sale}%
          </span>
        ) : null}

        {brand || brandLogoUrl ? (
          <div className="absolute left-3 top-12 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-black shadow-soft">
            {brandLogoUrl ? (
              <img alt={`${brand ?? title} logo`} className="h-4 w-4 rounded-full object-cover" src={brandLogoUrl} />
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] text-white">
                {(brand ?? title).charAt(0)}
              </span>
            )}
            <span>{brand}</span>
          </div>
        ) : null}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            aria-label="Wishlist"
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white transition ${
              isWishlisted ? 'text-brand' : 'text-black hover:text-brand'
            }`}
            onClick={handleWishlistClick}
            type="button"
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
          {wishlistMessage ? (
            <span className="absolute right-10 top-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 shadow-soft">
              {wishlistMessage}
            </span>
          ) : null}
          <Link
            aria-label="Quick view"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:text-brand"
            state={productNavigation.state}
            to={productNavigation.to}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Link
          aria-label={`View details for ${title}`}
          className="flex h-44 items-center justify-center px-6 pt-4"
          state={productNavigation.state}
          to={productNavigation.to}
        >
          <ProductVisual
            iconClassName={`h-16 w-16 ${accentClassName}`}
            imageClassName="max-h-40 w-full object-contain transition duration-300 group-hover:scale-105"
            placeholderClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black/40"
            product={productPreview}
            videoClassName="max-h-40 w-full object-contain"
          />
        </Link>

        <button
          className="mt-4 block bg-black py-2 text-center text-xs font-medium text-white transition hover:bg-brand"
          onClick={() =>
            handleProtectedProductAction({
              actionLabel: requestedAction,
              onSuccess: () => addToCart(productSlug),
              to: '/cart',
            })
          }
          type="button"
        >
          {ctaLabel}
        </button>
      </div>

      <div className="pt-4">
        <Link
          className="text-sm font-medium text-black transition hover:text-brand"
          state={productNavigation.state}
          to={productNavigation.to}
        >
          {title}
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-medium text-brand">{formatCurrency(price)}</span>
          {oldPrice ? <span className="text-black/50 line-through">{formatCurrency(oldPrice)}</span> : null}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-black/50">
          <div className="flex items-center gap-1 text-[#ffad33]">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                className="h-3.5 w-3.5"
                fill={index < Math.round(rating) ? 'currentColor' : 'none'}
                key={`${title}-${index}`}
                strokeWidth={1.8}
              />
            ))}
          </div>
          <span>({reviews})</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
