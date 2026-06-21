import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AccountSidebar from '../components/AccountSidebar.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

function OrdersPage() {
  const navigate = useNavigate()
  const { activeOrders, addOrderToCart, cancelOrder } = useCommerce()
  const [orderMessage, setOrderMessage] = useState('')

  const handleOrderAgain = async (orderId) => {
    setOrderMessage('')
    const result = await addOrderToCart(orderId)

    if (!result.success) {
      setOrderMessage(result.message)
      return
    }

    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">My Orders</span>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-[220px,1fr]">
          <AccountSidebar />

          <div>
            <h1 className="text-2xl font-medium">My Orders</h1>
            {orderMessage ? (
              <div className="mt-5 border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
                {orderMessage}
              </div>
            ) : null}

            {activeOrders.length ? (
              <div className="mt-8 space-y-6">
                {activeOrders.map((order) => (
                  <article className="border border-black/10 bg-white p-6 shadow-soft" key={order.id}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-black/40">{order.id}</p>
                        <h2 className="mt-2 text-lg font-medium">Placed on {formatDate(order.placedAt)}</h2>
                        <p className="mt-2 text-sm text-black/60">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.paymentMethod === 'bank' ? 'Bank transfer' : 'Cash on delivery'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-xs font-medium text-brand">
                          {order.status}
                        </span>
                        <button
                          className="text-sm font-medium text-brand"
                          onClick={() => cancelOrder(order.id)}
                          type="button"
                        >
                          Cancel Order
                        </button>
                        <button
                          className="inline-flex items-center justify-center bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
                          onClick={() => handleOrderAgain(order.id)}
                          type="button"
                        >
                          Order Again
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {order.items.map((item) => (
                        <div className="flex items-center justify-between gap-4 text-sm" key={`${order.id}-${item.productSlug}`}>
                          <span>
                            {item.title} x {item.quantity}
                          </span>
                          <span>{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-black/10 pt-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        <span className="font-medium">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 border border-black/10 bg-[#faf7f4] px-6 py-14 text-center">
                <h2 className="text-2xl font-semibold">No orders yet</h2>
                <p className="mt-3 text-sm text-black/60">
                  Place your first order from checkout and it will appear here.
                </p>
                <Link
                  className="mt-8 inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                  to="/shop"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default OrdersPage
