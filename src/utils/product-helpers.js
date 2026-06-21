const DEFAULT_GALLERY_BACKGROUNDS = [
  'bg-[#f5f5f5]',
  'bg-[#fff2f2]',
  'bg-[#eef7fb]',
  'bg-[#f8f3ff]',
]

export const STORE_CATEGORIES = [
  "Women's Fashion",
  "Men's Fashion",
  'Electronics',
  'Home & Lifestyle',
  'Medicine',
  'Sports & Outdoor',
  "Baby's & Toys",
  'Groceries & Pets',
  'Health & Beauty',
]

const CATEGORY_KEYWORDS = [
  {
    category: 'Electronics',
    keywords: [
      'electronics',
      'phone',
      'mobile',
      'computer',
      'laptop',
      'watch',
      'smartwatch',
      'camera',
      'headphone',
      'earbud',
      'speaker',
      'gaming',
      'gamepad',
      'keyboard',
      'monitor',
      'cpu',
      'charger',
      'usb',
    ],
  },
  {
    category: "Women's Fashion",
    keywords: ['women', 'woman', 'female', 'dress', 'saree', 'kurti', 'skirt', 'jacket', 'duffle', 'bag'],
  },
  {
    category: "Men's Fashion",
    keywords: ['men', 'man', 'male', 'shirt', 'coat', 'pant', 'trouser', 'jeans', 'formal', 'oxford'],
  },
  {
    category: 'Home & Lifestyle',
    keywords: ['home', 'lifestyle', 'chair', 'sofa', 'table', 'bookshelf', 'dinnerware', 'kitchen', 'decor'],
  },
  {
    category: 'Medicine',
    keywords: ['medicine', 'medical', 'health monitor', 'blood pressure', 'first aid', 'tablet', 'capsule'],
  },
  {
    category: 'Sports & Outdoor',
    keywords: ['sports', 'outdoor', 'soccer', 'football', 'cleat', 'boot', 'dumbbell', 'running', 'fitness', 'gym'],
  },
  {
    category: "Baby's & Toys",
    keywords: ['baby', 'toy', 'kids', 'kid', 'children', 'child', 'activity mat', 'ride-on'],
  },
  {
    category: 'Groceries & Pets',
    keywords: ['grocery', 'groceries', 'pet', 'dog', 'cat', 'food', 'pantry', 'organic'],
  },
  {
    category: 'Health & Beauty',
    keywords: ['beauty', 'skin', 'skincare', 'serum', 'perfume', 'curology', 'glow', 'cosmetic'],
  },
]

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const normalizeCategoryLabel = (value = '') => {
  const normalizedValue = normalizeText(value)

  return STORE_CATEGORIES.find((category) => normalizeText(category) === normalizedValue) ?? ''
}

export function getProductSearchText(product = {}) {
  return normalizeText(
    [
      product.title,
      product.name,
      product.category,
      product.description,
      product.brand,
      product.sku,
      ...(Array.isArray(product.highlights) ? product.highlights : []),
      ...(Array.isArray(product.tags) ? product.tags : []),
    ]
      .filter(Boolean)
      .join(' '),
  )
}

export function inferProductCategory(category = '', product = {}) {
  const explicitCategory = normalizeCategoryLabel(category)

  if (explicitCategory) return explicitCategory

  const searchText = getProductSearchText({ ...product, category })
  const matchedRule = CATEGORY_KEYWORDS.find((rule) =>
    rule.keywords.some((keyword) => searchText.includes(normalizeText(keyword))),
  )

  return matchedRule?.category || category?.trim() || 'Storefront'
}

export function productMatchesCatalogPage(product = {}, label = '', type = 'category') {
  const normalizedLabel = normalizeText(label)
  const productCategory = normalizeText(inferProductCategory(product.category, product))
  const searchText = getProductSearchText(product)

  if (type === 'collection') {
    const collectionLabel = normalizedLabel.replace(/\bcollections?\b/g, '').trim()
    return Boolean(collectionLabel && (productCategory.includes(collectionLabel) || searchText.includes(collectionLabel)))
  }

  const exactCategory = normalizeCategoryLabel(label)
  if (exactCategory) {
    return productCategory === normalizeText(exactCategory)
  }

  return Boolean(normalizedLabel && (productCategory.includes(normalizedLabel) || searchText.includes(normalizedLabel)))
}

export function createProductSlug(title = '') {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildUniqueProductSlug(title = '', existingSlugs = []) {
  const baseSlug = createProductSlug(title) || `product-${Date.now()}`

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let nextSlug = `${baseSlug}-${suffix}`

  while (existingSlugs.includes(nextSlug)) {
    suffix += 1
    nextSlug = `${baseSlug}-${suffix}`
  }

  return nextSlug
}

export function parseCommaSeparatedValues(value = '') {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeColorValues(values = []) {
  return values.map((color) => {
    const value = typeof color === 'string' ? color : color?.value || '#DB4444'

    return {
      value,
      ringClassName: value.toLowerCase() === '#111111' || value.toLowerCase() === 'black'
        ? 'ring-black/80'
        : 'ring-black/10',
    }
  })
}

export function calculateSalePercentage(price, oldPrice) {
  const numericPrice = Number(price)
  const numericOldPrice = Number(oldPrice)

  if (
    !Number.isFinite(numericPrice) ||
    !Number.isFinite(numericOldPrice) ||
    numericPrice <= 0 ||
    numericOldPrice <= numericPrice
  ) {
    return null
  }

  return Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100)
}

export function getStockLabel(stockQuantity) {
  const numericStock = Number(stockQuantity)

  if (!Number.isFinite(numericStock) || numericStock <= 0) {
    return 'Out of Stock'
  }

  return 'In Stock'
}

export function getDefaultGalleryBackgrounds() {
  return [...DEFAULT_GALLERY_BACKGROUNDS]
}

export function getProductPrimaryMedia(product = {}) {
  if (Array.isArray(product.media) && product.media.length) {
    return product.media[0]
  }

  if (product.thumbnailUrl) {
    return {
      kind: 'image',
      url: product.thumbnailUrl,
      name: product.title ?? 'Product image',
    }
  }

  return null
}
