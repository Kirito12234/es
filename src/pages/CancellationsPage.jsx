import { Link } from 'react-router-dom'
import AccountSidebar from '../components/AccountSidebar.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

function CancellationsPage() {
  const { cancelledOrders } = useCommerce()

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">My Cancellations</span>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-[220px,1fr]">
          <AccountSidebar />

          <div>
            <h1 className="text-2xl font-medium">My Cancellations</h1>

            {cancelledOrders.length ? (
              <div className="mt-8 space-y-6">
                {cancelledOrders.map((order) => (
                  <article className="border border-black/10 bg-white p-6 shadow-soft" key={order.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-black/40">{order.id}</p>
                        <h2 className="mt-2 text-lg font-medium">Cancelled order</h2>
                        <p className="mt-2 text-sm text-black/60">
                          Placed on {formatDate(order.placedAt)}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-black/5 px-4 py-2 text-xs font-medium text-black/60">
                        Cancelled
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 text-sm">
                      {order.items.map((item) => (
                        <div className="flex items-center justify-between" key={`${order.id}-${item.productSlug}`}>
                          <span>
                            {item.title} x {item.quantity}
                          </span>
                          <span>{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 border border-black/10 bg-[#faf7f4] px-6 py-14 text-center">
                <h2 className="text-2xl font-semibold">No cancelled orders</h2>
                <p className="mt-3 text-sm text-black/60">
                  Cancelled orders will appear here for quick review.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CancellationsPage
