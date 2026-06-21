import { useEffect, useMemo, useState } from 'react'
import { catalogProducts as staticCatalogProducts } from '../data/products.js'
import { useAuth } from '../hooks/useAuth.jsx'
import { apiBaseUrl, apiRequest } from '../utils/api.js'
import {
  buildUniqueProductSlug,
  calculateSalePercentage,
  getDefaultGalleryBackgrounds,
  inferProductCategory,
  getStockLabel,
  normalizeColorValues,
  parseCommaSeparatedValues,
} from '../utils/product-helpers.js'
import CommerceContext from './commerce-context.js'

const coupons = {
  SAVE10: { code: 'SAVE10', type: 'percent', value: 10 },
}

const LOCAL_STORE_PREFIX = 'redcart_commerce'
const LOCAL_DATABASE_NAME = 'redcart_commerce_database'
const LOCAL_DATABASE_STORE = 'collections'

const getLocalStoreKey = (user, collection) => {
  const userKey = user?.id || user?.email || 'guest'
  return `${LOCAL_STORE_PREFIX}_${userKey}_${collection}`
}

const readLocalStore = (user, collection, fallback) => {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(getLocalStoreKey(user, collection))
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeLocalStore = (user, collection, value) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getLocalStoreKey(user, collection), JSON.stringify(value))
}

const openLocalDatabase = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('Browser database is unavailable.'))
      return
    }

    const request = window.indexedDB.open(LOCAL_DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(LOCAL_DATABASE_STORE)) {
        request.result.createObjectStore(LOCAL_DATABASE_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Browser database could not be opened.'))
  })

const readLargeLocalStore = async (user, collection, fallback) => {
  try {
    const database = await openLocalDatabase()
    const value = await new Promise((resolve, reject) => {
      const transaction = database.transaction(LOCAL_DATABASE_STORE, 'readonly')
      const request = transaction.objectStore(LOCAL_DATABASE_STORE).get(getLocalStoreKey(user, collection))
      request.onsuccess = () => resolve(request.result ?? fallback)
      request.onerror = () => reject(request.error)
    })
    database.close()
    return value
  } catch {
    return fallback
  }
}

const writeLargeLocalStore = async (user, collection, value) => {
  const database = await openLocalDatabase()

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCAL_DATABASE_STORE, 'readwrite')
    transaction.objectStore(LOCAL_DATABASE_STORE).put(value, getLocalStoreKey(user, collection))
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })

  database.close()
}

const stripProductMediaForLocalStorage = (product = {}) => ({
  ...product,
  media: [],
  thumbnailUrl: null,
})

const createProductSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'product'

const resolveImageUrl = (image = '') => {
  if (!image) return ''
  if (image.startsWith('http') || image.startsWith('data:')) return image
  return `${apiBaseUrl}${image}`
}

const getDiscountAmount = (subtotal, coupon) => {
  if (!coupon || subtotal <= 0) return 0
  if (coupon.type === 'percent') return (subtotal * coupon.value) / 100
  return Math.min(subtotal, coupon.value)
}

const mapProduct = (product = {}) => {
  const price = Number(product.discountPrice || product.price || 0)
  const oldPrice =
    product.discountPrice && product.discountPrice > 0 && product.price > product.discountPrice
      ? Number(product.price)
      : null
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []
  const media = images.map((image, index) => ({
    id: `${product._id || product.id}-image-${index}`,
    kind: 'image',
    name: product.name || 'Product image',
    url: resolveImageUrl(image),
  }))
  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['Standard']
  const colors = Array.isArray(product.colors) && product.colors.length
    ? normalizeColorValues(product.colors)
    : normalizeColorValues(['#DB4444', '#111111'])
  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : parseCommaSeparatedValues(product.highlights || '')
  const tags = Array.isArray(product.tags) ? product.tags : parseCommaSeparatedValues(product.tags || '')
  const category = inferProductCategory(product.category, {
    title: product.name || product.title,
    description: product.description,
    brand: product.brand,
    sku: product.sku,
    highlights,
    tags,
  })

  return {
    id: product._id || product.id,
    _id: product._id || product.id,
    ownerId: product.sellerId?._id || product.sellerId || '',
    createdAt: product.createdAt,
    title: product.name || product.title || 'Product',
    price,
    oldPrice,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    sale: oldPrice ? calculateSalePercentage(price, oldPrice) : product.sale,
    accentClassName: 'text-brand',
    productSlug: createProductSlug(product.name || product.title || product._id || product.id),
    category,
    description: product.description || '',
    sizes,
    colors,
    galleryBackgrounds: getDefaultGalleryBackgrounds(),
    stockLabel: getStockLabel(product.stock ?? product.stockQuantity ?? 0),
    stockQuantity: product.stock ?? product.stockQuantity ?? 0,
    breadcrumbs: ['Home', category],
    media,
    thumbnailUrl: media[0]?.url || null,
    isFlashSale: Boolean(product.isFlashSale),
    isBestSelling: Boolean(product.isBestSelling),
    isNewArrival: Boolean(product.isNewArrival),
    brand: product.brand || '',
    brandLogoUrl: product.brandLogoUrl || '',
    sku: product.sku || '',
    highlights,
    warranty: product.warranty || '',
    delivery: product.delivery || '',
    returnPolicy: product.returnPolicy || '',
    tags,
  }
}

const mapLocalProduct = (product = {}) => {
  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : parseCommaSeparatedValues(product.highlights || '')
  const tags = Array.isArray(product.tags) ? product.tags : parseCommaSeparatedValues(product.tags || '')
  const category = inferProductCategory(product.category, {
    title: product.title,
    description: product.description,
    brand: product.brand,
    sku: product.sku,
    highlights,
    tags,
  })

  return {
    ...product,
    id: product.id,
    _id: product._id || null,
    ownerId: product.ownerId || '',
    title: product.title || 'Product',
    price: Number(product.price || 0),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    rating: Number(product.rating || 5),
    reviews: Number(product.reviews || 0),
    sale: product.oldPrice ? calculateSalePercentage(product.price, product.oldPrice) : product.sale,
    accentClassName: product.accentClassName || 'text-brand',
    productSlug: product.productSlug || createProductSlug(product.title || product.id),
    category,
    description: product.description || '',
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['Standard'],
    colors: Array.isArray(product.colors) && product.colors.length ? product.colors : normalizeColorValues(['#DB4444']),
    galleryBackgrounds: product.galleryBackgrounds || getDefaultGalleryBackgrounds(),
    stockLabel: getStockLabel(product.stockQuantity ?? product.stock ?? 0),
    stockQuantity: Number(product.stockQuantity ?? product.stock ?? 0),
    breadcrumbs: ['Home', category],
    media: Array.isArray(product.media) ? product.media : [],
    thumbnailUrl: product.thumbnailUrl || product.media?.[0]?.url || null,
    brand: product.brand || '',
    brandLogoUrl: product.brandLogoUrl || '',
    sku: product.sku || '',
    highlights,
    warranty: product.warranty || '',
    delivery: product.delivery || '',
    returnPolicy: product.returnPolicy || '',
    tags,
    isFlashSale: Boolean(product.isFlashSale),
    isBestSelling: Boolean(product.isBestSelling),
    isNewArrival: Boolean(product.isNewArrival),
  }
}

const mapCartItem = (item = {}, productsById) => {
  const product = productsById.get(String(item.productId)) || {
    id: item.productId,
    _id: item.productId,
    title: item.name || 'Product',
    price: item.price || 0,
    productSlug: createProductSlug(item.name || item.productId),
    media: item.image
      ? [{ id: `${item.productId}-image`, kind: 'image', name: item.name, url: resolveImageUrl(item.image) }]
      : [],
  }

  return {
    ...product,
    quantity: item.quantity || 1,
    subtotal: item.lineTotal ?? (item.price || product.price || 0) * (item.quantity || 1),
  }
}

const mapOrder = (order = {}, productsById) => ({
  id: order._id,
  items: (order.items || []).map((item) =>
    mapCartItem(
      {
        productId: item.productId?._id || item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      },
      productsById,
    ),
  ),
  subtotal: order.subtotal || 0,
  discount: 0,
  shipping: 0,
  total: order.total || 0,
  couponCode: null,
  paymentMethod: order.paymentMethod === 'Online' ? 'bank' : 'cash',
  billingDetails: order.shippingAddress,
  status:
    {
      pending: 'Processing',
      paid: 'Paid',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }[order.status] || 'Processing',
  placedAt: order.createdAt,
})

const buildLocalCartItems = (entries = [], productsBySlug) =>
  entries
    .map((entry) => {
      const product = productsBySlug.get(entry.productSlug)
      if (!product) return null
      const quantity = Math.max(1, Number(entry.quantity) || 1)

      return {
        ...product,
        quantity,
        subtotal: product.price * quantity,
      }
    })
    .filter(Boolean)

const buildLocalWishlistProducts = (slugs = [], productsBySlug) =>
  slugs.map((slug) => productsBySlug.get(slug)).filter(Boolean)

const buildLocalOrder = ({ cartItems, subtotal, discount, shipping, total, appliedCoupon, billingDetails, paymentMethod }) => ({
  id: `LOCAL-${Date.now()}`,
  items: cartItems.map((item) => ({ ...item })),
  subtotal,
  discount,
  shipping,
  total,
  couponCode: appliedCoupon?.code ?? null,
  paymentMethod,
  billingDetails,
  status: 'Processing',
  placedAt: new Date().toISOString(),
})

export function CommerceProvider({ children }) {
  const { user } = useAuth()

  return (
    <CommerceStore key={user?.id ?? 'guest'} user={user}>
      {children}
    </CommerceStore>
  )
}

function CommerceStore({ children, user }) {
  const [apiProducts, setApiProducts] = useState([])
  const [localProducts, setLocalProducts] = useState(() =>
    readLocalStore(user, 'products', []).map(mapLocalProduct),
  )
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  useEffect(() => {
    let isMounted = true

    const hydrateLocalProducts = async () => {
      const storedProducts = await readLargeLocalStore(user, 'products', null)
      if (isMounted && Array.isArray(storedProducts)) {
        setLocalProducts(storedProducts.map(mapLocalProduct))
      }
    }

    hydrateLocalProducts()

    return () => {
      isMounted = false
    }
  }, [user])

  const productsById = useMemo(
    () => new Map(apiProducts.map((product) => [String(product._id), product])),
    [apiProducts],
  )

  const catalogProducts = useMemo(() => {
    const dynamicProducts = [...localProducts, ...apiProducts]
    const apiSlugs = new Set(dynamicProducts.map((product) => product.productSlug))
    const staticProductsNotInApi = staticCatalogProducts.filter(
      (product) => !apiSlugs.has(product.productSlug),
    )

    return [...dynamicProducts, ...staticProductsNotInApi]
  }, [apiProducts, localProducts])

  const productsBySlug = useMemo(
    () => new Map(catalogProducts.map((product) => [product.productSlug, product])),
    [catalogProducts],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((runningTotal, item) => runningTotal + item.subtotal, 0),
    [cartItems],
  )
  const discount = useMemo(() => getDiscountAmount(subtotal, appliedCoupon), [appliedCoupon, subtotal])
  const shipping = subtotal > 0 ? 0 : 0
  const total = Math.max(0, subtotal - discount + shipping)
  const cartCount = cartItems.reduce((runningTotal, item) => runningTotal + item.quantity, 0)
  const wishlistCount = wishlistProducts.length
  const activeOrders = useMemo(() => orders.filter((order) => order.status !== 'Cancelled'), [orders])
  const cancelledOrders = useMemo(() => orders.filter((order) => order.status === 'Cancelled'), [orders])
  const sellerProducts = useMemo(
    () =>
      user
        ? [...localProducts, ...apiProducts].filter(
            (product) => String(product.ownerId) === String(user.id),
          )
        : [],
    [apiProducts, localProducts, user],
  )

  const loadUserCollections = async () => {
    if (!user) {
      setWishlistProducts([])
      setCartItems([])
      setOrders([])
      return
    }

    const localWishlistSlugs = readLocalStore(user, 'wishlist', [])
    const localCartEntries = readLocalStore(user, 'cart', [])
    const localOrders = readLocalStore(user, 'orders', [])
    let nextWishlistProducts = buildLocalWishlistProducts(localWishlistSlugs, productsBySlug)
    let nextCartItems = buildLocalCartItems(localCartEntries, productsBySlug)
    let nextOrders = localOrders

    const [wishlistResult, cartResult, ordersResult] = await Promise.allSettled([
      apiRequest('/wishlist'),
      apiRequest('/cart'),
      apiRequest('/orders/my-orders'),
    ])

    if (wishlistResult.status === 'fulfilled') {
      nextWishlistProducts = [
        ...(wishlistResult.value.products || []).map(mapProduct),
        ...nextWishlistProducts,
      ]
    }

    if (cartResult.status === 'fulfilled') {
      nextCartItems = [
        ...(cartResult.value.items || []).map((item) => mapCartItem(item, productsById)),
        ...nextCartItems,
      ]
    }

    if (ordersResult.status === 'fulfilled') {
      nextOrders = [
        ...(ordersResult.value || []).map((order) => mapOrder(order, productsById)),
        ...nextOrders,
      ]
    }

    setWishlistProducts(nextWishlistProducts)
    setCartItems(nextCartItems)
    setOrders(nextOrders)
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const products = await apiRequest('/products')
        if (isMounted) setApiProducts(products.map(mapProduct))
      } catch {
        if (isMounted) setApiProducts([])
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!user) {
        setWishlistProducts([])
        setCartItems([])
        setOrders([])
        return
      }

      try {
        const localWishlistSlugs = readLocalStore(user, 'wishlist', [])
        const localCartEntries = readLocalStore(user, 'cart', [])
        const localOrders = readLocalStore(user, 'orders', [])
        let nextWishlistProducts = buildLocalWishlistProducts(localWishlistSlugs, productsBySlug)
        let nextCartItems = buildLocalCartItems(localCartEntries, productsBySlug)
        let nextOrders = localOrders

        const [wishlistResult, cartResult, ordersResult] = await Promise.allSettled([
          apiRequest('/wishlist'),
          apiRequest('/cart'),
          apiRequest('/orders/my-orders'),
        ])

        if (wishlistResult.status === 'fulfilled') {
          nextWishlistProducts = [
            ...(wishlistResult.value.products || []).map(mapProduct),
            ...nextWishlistProducts,
          ]
        }

        if (cartResult.status === 'fulfilled') {
          nextCartItems = [
            ...(cartResult.value.items || []).map((item) => mapCartItem(item, productsById)),
            ...nextCartItems,
          ]
        }

        if (ordersResult.status === 'fulfilled') {
          nextOrders = [
            ...(ordersResult.value || []).map((order) => mapOrder(order, productsById)),
            ...nextOrders,
          ]
        }

        if (!isMounted) return

        setWishlistProducts(nextWishlistProducts)
        setCartItems(nextCartItems)
        setOrders(nextOrders)
      } catch {
        if (!isMounted) return
        setWishlistProducts([])
        setCartItems([])
        setOrders([])
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [user, productsById, productsBySlug])

  const getProductBySlug = (slug) => productsBySlug.get(slug) ?? null

  const getBackendProductId = (slug) => {
    const product = getProductBySlug(slug)
    if (!product?._id) throw new Error('This product is not synced with the backend yet.')
    return product._id
  }

  const addToWishlist = async (slug) => {
    try {
      const product = getProductBySlug(slug)
      if (!product) throw new Error('Product was not found.')

      if (isInWishlist(slug)) {
        return { success: true, message: 'Already saved in wishlist.' }
      }

      if (product._id) {
        await apiRequest(`/wishlist/${getBackendProductId(slug)}`, { method: 'POST' })
      } else {
        const localWishlistSlugs = readLocalStore(user, 'wishlist', [])
        writeLocalStore(user, 'wishlist', [...new Set([...localWishlistSlugs, slug])])
      }

      await loadUserCollections()
      return { success: true, message: 'OK. Saved to wishlist.' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Wishlist update failed.' }
    }
  }

  const removeFromWishlist = async (slug) => {
    try {
      const product = getProductBySlug(slug)
      if (product?._id) {
        await apiRequest(`/wishlist/${getBackendProductId(slug)}`, { method: 'DELETE' })
      } else {
        const localWishlistSlugs = readLocalStore(user, 'wishlist', [])
        writeLocalStore(
          user,
          'wishlist',
          localWishlistSlugs.filter((productSlug) => productSlug !== slug),
        )
      }

      await loadUserCollections()
      return { success: true }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Wishlist update failed.' }
    }
  }

  const addToCart = async (slug, quantity = 1) => {
    try {
      const product = getProductBySlug(slug)
      if (!product) throw new Error('Product was not found.')

      if (product._id) {
        await apiRequest('/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: getBackendProductId(slug), quantity }),
        })
      } else {
        const localCartEntries = readLocalStore(user, 'cart', [])
        const existingEntry = localCartEntries.find((entry) => entry.productSlug === slug)
        const nextCartEntries = existingEntry
          ? localCartEntries.map((entry) =>
              entry.productSlug === slug
                ? { ...entry, quantity: Math.max(1, Number(entry.quantity) || 1) + quantity }
                : entry,
            )
          : [...localCartEntries, { productSlug: slug, quantity }]

        writeLocalStore(user, 'cart', nextCartEntries)
      }

      await loadUserCollections()
      return { success: true }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Cart update failed.' }
    }
  }

  const updateCartQuantity = async (slug, quantity) => {
    try {
      const product = getProductBySlug(slug)
      const nextQuantity = Math.max(1, Number(quantity) || 1)

      if (product?._id) {
        await apiRequest(`/cart/${getBackendProductId(slug)}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity: nextQuantity }),
        })
      } else {
        const localCartEntries = readLocalStore(user, 'cart', [])
        writeLocalStore(
          user,
          'cart',
          localCartEntries.map((entry) =>
            entry.productSlug === slug ? { ...entry, quantity: nextQuantity } : entry,
          ),
        )
      }

      await loadUserCollections()
      return { success: true }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Cart update failed.' }
    }
  }

  const removeFromCart = async (slug) => {
    try {
      const product = getProductBySlug(slug)
      if (product?._id) {
        await apiRequest(`/cart/${getBackendProductId(slug)}`, { method: 'DELETE' })
      } else {
        const localCartEntries = readLocalStore(user, 'cart', [])
        writeLocalStore(
          user,
          'cart',
          localCartEntries.filter((entry) => entry.productSlug !== slug),
        )
      }

      await loadUserCollections()
      return { success: true }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Cart update failed.' }
    }
  }

  const moveWishlistItemToCart = async (slug) => {
    await addToCart(slug, 1)
    await removeFromWishlist(slug)
  }

  const moveAllWishlistToCart = async () => {
    await Promise.all(wishlistProducts.map((product) => addToCart(product.productSlug, 1)))
    await Promise.all(wishlistProducts.map((product) => removeFromWishlist(product.productSlug)))
  }

  const addOrderToCart = async (orderId) => {
    const order = orders.find((currentOrder) => currentOrder.id === orderId)

    if (!order) {
      return { success: false, message: 'Order was not found.' }
    }

    const results = await Promise.all(
      order.items.map((item) => addToCart(item.productSlug, item.quantity || 1)),
    )
    const failedResult = results.find((result) => result?.success === false)

    if (failedResult) {
      return {
        success: false,
        message: failedResult.message || 'Some order items could not be added to cart.',
      }
    }

    return { success: true, message: 'Order items added to cart.' }
  }

  const clearCart = async () => {
    try {
      await apiRequest('/cart', { method: 'DELETE' })
    } catch {
      // Local clearing below still completes without the API.
    }
    writeLocalStore(user, 'cart', [])
    setCartItems([])
    setAppliedCoupon(null)
  }

  const addProduct = async ({
    title,
    category,
    price,
    oldPrice,
    description,
    stockQuantity,
    sizes,
    colors,
    brand,
    brandLogoUrl,
    sku,
    highlights,
    warranty,
    delivery,
    returnPolicy,
    tags,
    isFlashSale,
    isBestSelling,
    isNewArrival,
    media,
  }) => {
    if (!user) return { success: false, message: 'You need to log in first.' }
    if (!['seller', 'admin'].includes(user.role)) {
      return { success: false, message: 'Only seller accounts can add products.' }
    }

    const safeTitle = title.trim()
    const safeDescription = description.trim()
    const placementLabel = category.trim()
    const normalizedHighlights = parseCommaSeparatedValues(highlights)
    const submittedTags = parseCommaSeparatedValues(tags)
    const safeCategory = inferProductCategory(category, {
      title: safeTitle,
      description: safeDescription,
      tags: submittedTags,
      highlights: normalizedHighlights,
      brand,
      sku,
    })
    const normalizedTags = [...new Set([...submittedTags, placementLabel].filter(Boolean))]
    const numericPrice = Number(price)
    const numericOldPrice = Number(oldPrice)
    const normalizedSizes = parseCommaSeparatedValues(sizes).length
      ? parseCommaSeparatedValues(sizes)
      : ['Standard']
    const normalizedColors = normalizeColorValues(
      parseCommaSeparatedValues(colors).length ? parseCommaSeparatedValues(colors) : ['#DB4444'],
    )
    const normalizedMedia = Array.isArray(media)
      ? media.filter((item) => item?.url && ['image', 'video'].includes(item.kind)).slice(0, 5)
      : []
    const normalizedImages = normalizedMedia.filter((item) => item.kind === 'image')

    if (!safeTitle) return { success: false, message: 'Product title is required.' }
    if (!safeCategory) return { success: false, message: 'Category is required.' }
    if (!safeDescription) return { success: false, message: 'Product description is required.' }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return { success: false, message: 'Enter a valid product price.' }
    }
    if (!normalizedImages.length) {
      return { success: false, message: 'Upload at least one product image.' }
    }

    const localProduct = mapLocalProduct({
      id: `LOCAL-PRODUCT-${Date.now()}`,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      title: safeTitle,
      price: numericPrice,
      oldPrice: numericOldPrice > numericPrice ? numericOldPrice : null,
      rating: 5,
      reviews: 0,
      productSlug: createProductSlug(safeTitle),
      category: safeCategory,
      description: safeDescription,
      sizes: normalizedSizes,
      colors: normalizedColors,
      stockQuantity: Math.max(0, Number(stockQuantity) || 0),
      media: normalizedMedia,
      thumbnailUrl: normalizedImages[0]?.url || null,
      brand: brand?.trim() || '',
      brandLogoUrl: brandLogoUrl?.trim() || '',
      sku: sku?.trim() || '',
      highlights: normalizedHighlights,
      warranty: warranty?.trim() || '',
      delivery: delivery?.trim() || '',
      returnPolicy: returnPolicy?.trim() || '',
      tags: normalizedTags,
      isFlashSale: Boolean(isFlashSale),
      isBestSelling: Boolean(isBestSelling),
      isNewArrival: Boolean(isNewArrival),
    })

    try {
      const product = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: safeTitle,
          category: safeCategory,
          price: numericOldPrice > numericPrice ? numericOldPrice : numericPrice,
          discountPrice: numericOldPrice > numericPrice ? numericPrice : 0,
          description: safeDescription,
          stock: Math.max(0, Number(stockQuantity) || 0),
          images: normalizedImages.map((item) => item.url),
          media: normalizedMedia,
          thumbnailUrl: normalizedImages[0]?.url || '',
          brand: brand?.trim() || '',
          brandLogoUrl: brandLogoUrl?.trim() || '',
          sku: sku?.trim() || '',
          sizes: normalizedSizes,
          colors: normalizedColors.map((color) => color.value),
          highlights: normalizedHighlights,
          warranty: warranty?.trim() || '',
          delivery: delivery?.trim() || '',
          returnPolicy: returnPolicy?.trim() || '',
          tags: normalizedTags,
          isFlashSale: Boolean(isFlashSale),
          isBestSelling: Boolean(isBestSelling),
          isNewArrival: Boolean(isNewArrival),
        }),
      })

      const mappedProduct = {
        ...mapProduct(product),
        category: safeCategory,
        description: safeDescription,
        sizes: normalizedSizes,
        colors: normalizedColors,
        media: normalizedMedia,
        thumbnailUrl: normalizedImages[0]?.url || null,
        brand: brand?.trim() || '',
        brandLogoUrl: brandLogoUrl?.trim() || '',
        sku: sku?.trim() || '',
        highlights: normalizedHighlights,
        warranty: warranty?.trim() || '',
        delivery: delivery?.trim() || '',
        returnPolicy: returnPolicy?.trim() || '',
        tags: normalizedTags,
        isFlashSale: Boolean(isFlashSale),
        isBestSelling: Boolean(isBestSelling),
        isNewArrival: Boolean(isNewArrival),
      }
      setApiProducts((currentProducts) => [mappedProduct, ...currentProducts])

      return {
        success: true,
        product: mappedProduct,
        message: 'Product added successfully.',
      }
    } catch {
      const localStoredProducts = await readLargeLocalStore(
        user,
        'products',
        readLocalStore(user, 'products', []),
      )
      const existingSlugs = new Set([...catalogProducts, ...localStoredProducts].map((product) => product.productSlug))
      let nextProduct = localProduct
      let suffix = 2

      while (existingSlugs.has(nextProduct.productSlug)) {
        nextProduct = {
          ...nextProduct,
          id: `LOCAL-PRODUCT-${Date.now()}-${suffix}`,
          productSlug: `${localProduct.productSlug}-${suffix}`,
        }
        suffix += 1
      }

      const nextLocalProducts = [nextProduct, ...localStoredProducts]

      try {
        await writeLargeLocalStore(user, 'products', nextLocalProducts)
      } catch {
        return {
          success: false,
          message: 'The browser could not save this product. Try a smaller image or enable site storage.',
        }
      }

      const lightweightProducts = nextLocalProducts.map(stripProductMediaForLocalStorage)
      try {
        writeLocalStore(user, 'products', lightweightProducts)
      } catch {
        window.localStorage.removeItem(getLocalStoreKey(user, 'products'))
        try {
          writeLocalStore(user, 'products', lightweightProducts)
        } catch {
          // IndexedDB already contains the complete product records.
        }
      }
      setLocalProducts(nextLocalProducts.map(mapLocalProduct))

      return {
        success: true,
        product: nextProduct,
        message: 'Product added successfully.',
      }
    }
  }

  const updateProduct = async (productSlug, productData) => {
    if (!user) return { success: false, message: 'You need to log in first.' }
    if (!['seller', 'admin'].includes(user.role)) {
      return { success: false, message: 'Only seller accounts can edit products.' }
    }

    const existingProduct = getProductBySlug(productSlug)
    if (!existingProduct) return { success: false, message: 'Product was not found.' }
    if (String(existingProduct.ownerId) !== String(user.id)) {
      return { success: false, message: 'You can only edit your own products.' }
    }

    const safeTitle = productData.title.trim()
    const safeDescription = productData.description.trim()
    const normalizedHighlights = parseCommaSeparatedValues(productData.highlights)
    const submittedTags = parseCommaSeparatedValues(productData.tags)
    const placementLabel = productData.category.trim()
    const safeCategory = inferProductCategory(productData.category, {
      title: safeTitle,
      description: safeDescription,
      tags: submittedTags,
      highlights: normalizedHighlights,
      brand: productData.brand,
      sku: productData.sku,
    })
    const numericPrice = Number(productData.price)
    const numericOldPrice = Number(productData.oldPrice)
    const normalizedSizes = parseCommaSeparatedValues(productData.sizes).length
      ? parseCommaSeparatedValues(productData.sizes)
      : ['Standard']
    const normalizedColors = normalizeColorValues(
      parseCommaSeparatedValues(productData.colors).length
        ? parseCommaSeparatedValues(productData.colors)
        : ['#DB4444'],
    )
    const normalizedMedia = Array.isArray(productData.media)
      ? productData.media.filter((item) => item?.url && ['image', 'video'].includes(item.kind)).slice(0, 5)
      : []
    const normalizedImages = normalizedMedia.filter((item) => item.kind === 'image')
    const normalizedTags = [...new Set([...submittedTags, placementLabel].filter(Boolean))]

    if (!safeTitle) return { success: false, message: 'Product title is required.' }
    if (!safeCategory) return { success: false, message: 'Category is required.' }
    if (!safeDescription) return { success: false, message: 'Product description is required.' }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return { success: false, message: 'Enter a valid product price.' }
    }
    if (!normalizedImages.length) {
      return { success: false, message: 'Upload at least one product image.' }
    }

    const existingSlugs = catalogProducts
      .filter((product) => product.productSlug !== productSlug)
      .map((product) => product.productSlug)
    const nextSlug = buildUniqueProductSlug(safeTitle, existingSlugs)
    const updates = {
      title: safeTitle,
      price: numericPrice,
      oldPrice: numericOldPrice > numericPrice ? numericOldPrice : null,
      productSlug: nextSlug,
      category: safeCategory,
      description: safeDescription,
      sizes: normalizedSizes,
      colors: normalizedColors,
      stockQuantity: Math.max(0, Number(productData.stockQuantity) || 0),
      stockLabel: getStockLabel(productData.stockQuantity),
      media: normalizedMedia,
      thumbnailUrl: normalizedImages[0]?.url || null,
      brand: productData.brand?.trim() || '',
      brandLogoUrl: productData.brandLogoUrl?.trim() || '',
      sku: productData.sku?.trim() || '',
      highlights: normalizedHighlights,
      warranty: productData.warranty?.trim() || '',
      delivery: productData.delivery?.trim() || '',
      returnPolicy: productData.returnPolicy?.trim() || '',
      tags: normalizedTags,
      isFlashSale: Boolean(productData.isFlashSale),
      isBestSelling: Boolean(productData.isBestSelling),
      isNewArrival: Boolean(productData.isNewArrival),
    }

    if (existingProduct._id) {
      try {
        const product = await apiRequest(`/products/${existingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: safeTitle,
            category: safeCategory,
            price: numericOldPrice > numericPrice ? numericOldPrice : numericPrice,
            discountPrice: numericOldPrice > numericPrice ? numericPrice : 0,
            description: safeDescription,
            stock: updates.stockQuantity,
            images: normalizedImages.map((item) => item.url),
            media: normalizedMedia,
            thumbnailUrl: normalizedImages[0]?.url || '',
            brand: updates.brand,
            brandLogoUrl: updates.brandLogoUrl,
            sku: updates.sku,
            sizes: normalizedSizes,
            colors: normalizedColors.map((color) => color.value),
            highlights: normalizedHighlights,
            warranty: updates.warranty,
            delivery: updates.delivery,
            returnPolicy: updates.returnPolicy,
            tags: normalizedTags,
            isFlashSale: updates.isFlashSale,
            isBestSelling: updates.isBestSelling,
            isNewArrival: updates.isNewArrival,
          }),
        })
        const mappedProduct = { ...mapProduct(product), ...updates }
        setApiProducts((products) =>
          products.map((currentProduct) =>
            currentProduct._id === existingProduct._id ? mappedProduct : currentProduct,
          ),
        )
        return { success: true, product: mappedProduct, message: 'Product updated successfully.' }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Product could not be updated.',
        }
      }
    }

    const storedProducts = await readLargeLocalStore(
      user,
      'products',
      readLocalStore(user, 'products', []),
    )
    const updatedProduct = mapLocalProduct({ ...existingProduct, ...updates })
    const nextLocalProducts = storedProducts.map((product) =>
      product.id === existingProduct.id ? updatedProduct : product,
    )

    try {
      await writeLargeLocalStore(user, 'products', nextLocalProducts)
      writeLocalStore(user, 'products', nextLocalProducts.map(stripProductMediaForLocalStorage))
      setLocalProducts(nextLocalProducts.map(mapLocalProduct))
      return { success: true, product: updatedProduct, message: 'Product updated successfully.' }
    } catch {
      return { success: false, message: 'The browser could not save your product changes.' }
    }
  }

  const deleteProduct = async (productSlug) => {
    if (!user) return { success: false, message: 'You need to log in first.' }
    if (!['seller', 'admin'].includes(user.role)) {
      return { success: false, message: 'Only seller accounts can delete products.' }
    }

    const product = getProductBySlug(productSlug)
    if (!product) return { success: false, message: 'Product was not found.' }
    if (String(product.ownerId) !== String(user.id) && user.role !== 'admin') {
      return { success: false, message: 'You can only delete your own products.' }
    }

    try {
      if (product._id) {
        await apiRequest(`/products/${product._id}`, { method: 'DELETE' })
        setApiProducts((products) =>
          products.filter((currentProduct) => currentProduct._id !== product._id),
        )
      } else {
        const storedProducts = await readLargeLocalStore(
          user,
          'products',
          readLocalStore(user, 'products', []),
        )
        const nextLocalProducts = storedProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        )
        await writeLargeLocalStore(user, 'products', nextLocalProducts)
        writeLocalStore(user, 'products', nextLocalProducts.map(stripProductMediaForLocalStorage))
        setLocalProducts(nextLocalProducts.map(mapLocalProduct))
      }

      setCartItems((items) => items.filter((item) => item.productSlug !== productSlug))
      setWishlistProducts((products) =>
        products.filter((currentProduct) => currentProduct.productSlug !== productSlug),
      )

      const localCartEntries = readLocalStore(user, 'cart', [])
      writeLocalStore(
        user,
        'cart',
        localCartEntries.filter((entry) => entry.productSlug !== productSlug),
      )
      const localWishlistSlugs = readLocalStore(user, 'wishlist', [])
      writeLocalStore(
        user,
        'wishlist',
        localWishlistSlugs.filter((slug) => slug !== productSlug),
      )

      return { success: true, message: 'Product deleted successfully.' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Product could not be deleted.',
      }
    }
  }

  const placeOrder = async ({ billingDetails, paymentMethod }) => {
    if (!cartItems.length) return { success: false, message: 'Your cart is empty.' }
    const hasLocalCartItems = cartItems.some((item) => !item._id)

    try {
      if (hasLocalCartItems) {
        const order = buildLocalOrder({
          cartItems,
          subtotal,
          discount,
          shipping,
          total,
          appliedCoupon,
          billingDetails,
          paymentMethod,
        })
        const localOrders = readLocalStore(user, 'orders', [])
        writeLocalStore(user, 'orders', [order, ...localOrders])
        await clearCart()
        await loadUserCollections()

        return { success: true, order }
      }

      const order = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod: paymentMethod === 'bank' ? 'Online' : 'COD',
          shippingAddress: {
            fullName: billingDetails.firstName,
            phone: billingDetails.phoneNumber,
            address: [billingDetails.streetAddress, billingDetails.apartment].filter(Boolean).join(', '),
            city: billingDetails.townCity,
            state: '',
            postalCode: '00000',
            country: 'Nepal',
          },
        }),
      })
      const mappedOrder = mapOrder(order, productsById)
      await loadUserCollections()
      setAppliedCoupon(null)

      return { success: true, order: mappedOrder }
    } catch {
      const order = buildLocalOrder({
        cartItems,
        subtotal,
        discount,
        shipping,
        total,
        appliedCoupon,
        billingDetails,
        paymentMethod,
      })
      const localOrders = readLocalStore(user, 'orders', [])
      writeLocalStore(user, 'orders', [order, ...localOrders])
      await clearCart()
      await loadUserCollections()

      return { success: true, order }
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      if (String(orderId).startsWith('LOCAL-')) {
        const localOrders = readLocalStore(user, 'orders', [])
        writeLocalStore(
          user,
          'orders',
          localOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Cancelled', cancelledAt: new Date().toISOString() } : order,
          ),
        )
        await loadUserCollections()
        return
      }

      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' }),
      })
      await loadUserCollections()
    } catch {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled', cancelledAt: new Date().toISOString() } : order,
        ),
      )
    }
  }

  const isInWishlist = (slug) =>
    wishlistProducts.some((product) => product.productSlug === slug)

  const applyCoupon = (rawCode) => {
    const normalizedCode = rawCode.trim().toUpperCase() || 'SAVE10'
    const coupon = coupons[normalizedCode]
    if (!coupon) return { success: false, message: 'Coupon code is invalid.' }
    setAppliedCoupon(coupon)
    return {
      success: true,
      code: coupon.code,
      message: rawCode.trim()
        ? `${coupon.code} applied successfully.`
        : `${coupon.code} generated and applied successfully.`,
    }
  }

  const value = {
    addProduct,
    addOrderToCart,
    addToCart,
    addToWishlist,
    appliedCoupon,
    applyCoupon,
    activeOrders,
    cartCount,
    cartItems,
    cancelOrder,
    cancelledOrders,
    catalogProducts,
    clearCart,
    customProducts: apiProducts,
    discount,
    deleteProduct,
    getProductBySlug,
    isInWishlist,
    moveAllWishlistToCart,
    moveWishlistItemToCart,
    orders,
    placeOrder,
    removeFromCart,
    removeFromWishlist,
    sellerProducts,
    shipping,
    subtotal,
    total,
    updateProduct,
    updateCartQuantity,
    wishlistCount,
    wishlistProducts,
  }

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}
