export const protectedActionPaths = {
  dashboard: '/dashboard',
  account: '/account',
  orders: '/orders',
  cancellations: '/cancellations',
  reviews: '/reviews',
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',
  'sell-product': '/sell-product',
  'add-product': '/add-product',
}

export function getProtectedActionPath(actionKey) {
  return protectedActionPaths[actionKey] ?? '/dashboard'
}

export function getProtectedNavigation({ actionKey, isAuthenticated, label, authenticatedState }) {
  if (isAuthenticated) {
    return {
      to: getProtectedActionPath(actionKey),
      state: authenticatedState,
    }
  }

  return {
    to: '/signup',
    state: {
      actionKey,
      requestedAction: label,
    },
  }
}

export function getStorefrontNavigation({
  authenticatedTo,
  authenticatedState,
}) {
  return {
    to: authenticatedTo,
    state: authenticatedState,
  }
}

export function formatSlugLabel(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
