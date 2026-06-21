import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import AccountPage from './pages/AccountPage.jsx'
import AddProductPage from './pages/AddProductPage.jsx'
import AddProductFeaturesPage from './pages/AddProductFeaturesPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CancellationsPage from './pages/CancellationsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LogInPage from './pages/LogInPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ProtectedFeaturePage from './pages/ProtectedFeaturePage.jsx'
import SellerDashboardPage from './pages/SellerDashboardPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'

const protectedFeatureRoutes = [
  {
    path: '/reviews',
    requestedAction: 'My Reviews',
    title: 'My Reviews',
    eyebrow: 'Reviews',
    description:
      'Keep review management in its own protected page for signed-in users.',
    summary:
      'The navbar dropdown now includes a connected reviews route instead of a placeholder action.',
  },
]

function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<ShopPage />} path="/shop" />
        <Route element={<CatalogPage />} path="/categories/:slug" />
        <Route element={<CatalogPage type="collection" />} path="/collections/:slug" />
        <Route element={<ProductPage />} path="/products/:slug" />
        <Route element={<SignUpPage />} path="/signup" />
        <Route element={<LogInPage />} path="/login" />
        <Route
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']} requestedAction="Dashboard">
              <SellerDashboardPage />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
        <Route
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']} requestedAction="Add Product">
              <AddProductPage />
            </ProtectedRoute>
          }
          path="/add-product"
        />
        <Route
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']} requestedAction="Edit Product">
              <AddProductPage />
            </ProtectedRoute>
          }
          path="/edit-product/:slug"
        />
        <Route
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']} requestedAction="Product Features">
              <AddProductFeaturesPage />
            </ProtectedRoute>
          }
          path="/dashboard/product-features"
        />
        <Route
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']} requestedAction="Sell Product">
              <AddProductPage />
            </ProtectedRoute>
          }
          path="/sell-product"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="Wishlist">
              <WishlistPage />
            </ProtectedRoute>
          }
          path="/wishlist"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="Cart">
              <CartPage />
            </ProtectedRoute>
          }
          path="/cart"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="Checkout">
              <CheckoutPage />
            </ProtectedRoute>
          }
          path="/checkout"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="Account">
              <AccountPage />
            </ProtectedRoute>
          }
          path="/account"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="My Order">
              <OrdersPage />
            </ProtectedRoute>
          }
          path="/orders"
        />
        <Route
          element={
            <ProtectedRoute requestedAction="My Cancellations">
              <CancellationsPage />
            </ProtectedRoute>
          }
          path="/cancellations"
        />
        {protectedFeatureRoutes.map((route) => (
          <Route
            element={
              <ProtectedRoute requestedAction={route.requestedAction}>
                <ProtectedFeaturePage
                  description={route.description}
                  eyebrow={route.eyebrow}
                  summary={route.summary}
                  title={route.title}
                />
              </ProtectedRoute>
            }
            key={route.path}
            path={route.path}
          />
        ))}
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </>
  )
}

export default App
