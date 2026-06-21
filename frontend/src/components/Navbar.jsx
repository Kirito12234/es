import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Star,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { getProtectedNavigation } from '../utils/routes.js'

const navLinkClassName = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-black underline underline-offset-4' : 'text-black hover:text-brand'
  }`

function Navbar() {
  const { isAuthenticated, isSeller, logout, user } = useAuth()
  const { cartCount, wishlistCount } = useCommerce()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const userInitial = user?.name?.trim()?.charAt(0)?.toLowerCase() ?? 'u'
  const dashboardNavigation = getProtectedNavigation({
    actionKey: 'dashboard',
    isAuthenticated,
    label: 'Dashboard',
    authenticatedState: {
      title: 'Dashboard',
    },
  })
  const wishlistNavigation = getProtectedNavigation({
    actionKey: 'wishlist',
    isAuthenticated,
    label: 'Wishlist',
  })
  const cartNavigation = getProtectedNavigation({
    actionKey: 'cart',
    isAuthenticated,
    label: 'Cart',
  })

  const handleLogout = () => {
    setIsMenuOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const accountMenuItems = [
    {
      actionKey: 'account',
      label: 'Manage My Account',
      icon: UserRound,
    },
    {
      actionKey: 'orders',
      label: 'My Order',
      icon: Package,
    },
    {
      actionKey: 'cancellations',
      label: 'My Cancellations',
      icon: LayoutDashboard,
    },
    {
      actionKey: 'reviews',
      label: 'My Reviews',
      icon: Star,
    },
  ]

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-[1170px] items-center justify-between gap-4 px-4 py-3 text-[10px] sm:text-xs">
          <p className="flex-1 text-center text-white/90">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{' '}
            <Link className="font-semibold underline underline-offset-2" to="/">
              ShopNow
            </Link>
          </p>
          <div className="hidden items-center gap-1 text-white/90 sm:flex">
            <span>English</span>
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4">
        <div className="flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-3 text-2xl font-semibold tracking-wide text-black" to="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>Exclusive</span>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-5 sm:gap-8">
            <NavLink className={navLinkClassName} to="/">
              Home
            </NavLink>
            <NavLink className={navLinkClassName} to="/contact">
              Contact
            </NavLink>
            <NavLink className={navLinkClassName} to="/about">
              About
            </NavLink>
            {isSeller ? (
              <NavLink
                className={navLinkClassName}
                state={dashboardNavigation.state}
                to={dashboardNavigation.to}
              >
                Dashboard
              </NavLink>
            ) : !isAuthenticated ? (
              <NavLink className={navLinkClassName} to="/signup">
                Sign Up
              </NavLink>
            ) : null}
          </nav>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex w-full items-center justify-between gap-3 bg-[#f5f5f5] px-3 py-2 sm:w-[243px]">
              <input
                className="w-full bg-transparent text-xs text-black outline-none placeholder:text-black/40"
                placeholder="What are you looking for?"
                type="text"
              />
              <Search className="h-4 w-4 text-black" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-3">
              <Link
                aria-label="Wishlist"
                className="relative inline-flex h-8 w-8 items-center justify-center text-black transition hover:text-brand"
                state={wishlistNavigation.state}
                to={wishlistNavigation.to}
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>
              <Link
                aria-label="Cart"
                className="relative inline-flex h-8 w-8 items-center justify-center text-black transition hover:text-brand"
                state={cartNavigation.state}
                to={cartNavigation.to}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    aria-label="Account menu"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
                    onClick={() => setIsMenuOpen((currentState) => !currentState)}
                    type="button"
                  >
                    <span className="text-sm font-semibold">{userInitial}</span>
                  </button>

                  {isMenuOpen ? (
                    <div className="absolute right-0 top-11 w-[224px] bg-[#3c3142]/90 p-4 text-white shadow-panel backdrop-blur">
                      <div className="space-y-1">
                        {accountMenuItems.map((item) => {
                          const Icon = item.icon
                          const navigation = getProtectedNavigation({
                            actionKey: item.actionKey,
                            isAuthenticated,
                            label: item.label,
                            authenticatedState: {
                              title: item.label,
                            },
                          })

                          return (
                            <Link
                              className="flex items-center gap-3 px-2 py-2 text-sm text-white/90 transition hover:text-white"
                              key={item.actionKey}
                              onClick={() => setIsMenuOpen(false)}
                              state={navigation.state}
                              to={navigation.to}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}

                        <button
                          className="flex w-full items-center gap-3 px-2 py-2 text-left text-sm text-white/90 transition hover:text-white"
                          onClick={handleLogout}
                          type="button"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
