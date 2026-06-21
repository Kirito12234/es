import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

function CartPage() {
  const location = useLocation()
  const {
    activeOrders,
    appliedCoupon,
    applyCoupon,
    cartItems,
    removeFromCart,
    shipping,
    updateCartQuantity,
  } = useCommerce()

  const [couponCode, setCouponCode] = React.useState(appliedCoupon?.code ?? '')
  const [couponMessage, setCouponMessage] = React.useState('')
  const [draftQuantities, setDraftQuantities] = React.useState({})
  const placedOrderId = location.state?.placedOrderId
  const displayedCartItems = React.useMemo(
    () =>
      cartItems.map((item) => {
        const quantity = Math.max(1, Number(draftQuantities[item.productSlug] ?? item.quantity) || 1)

        return {
          ...item,
          quantity,
          subtotal: item.price * quantity,
        }
      }),
    [cartItems, draftQuantities],
  )
  const displayedSubtotal = displayedCartItems.reduce(
    (runningTotal, item) => runningTotal + item.subtotal,
    0,
  )
  const displayedDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (displayedSubtotal * appliedCoupon.value) / 100
      : Math.min(displayedSubtotal, appliedCoupon.value)
    : 0
  const displayedTotal = Math.max(0, displayedSubtotal - displayedDiscount + shipping)

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode)
    if (result.success && result.code) setCouponCode(result.code)
    setCouponMessage(result.message)
  }

  const handleUpdateCart = () => {
    cartItems.forEach((item) => {
      const nextQuantity = Number(draftQuantities[item.productSlug] ?? item.quantity)
      updateCartQuantity(item.productSlug, nextQuantity)
    })

    setDraftQuantities({})
  }

  const handleQuantityChange = async (item, value) => {
    setDraftQuantities((currentDrafts) => ({
      ...currentDrafts,
      [item.productSlug]: value,
    }))

    const result = await updateCartQuantity(item.productSlug, Number(value))
    if (result.success) {
      setDraftQuantities((currentDrafts) => {
        const nextDrafts = { ...currentDrafts }
        delete nextDrafts[item.productSlug]
        return nextDrafts
      })
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">Cart</span>
        </div>

        {cartItems.length ? (
          <>
            <section className="mt-12 overflow-x-auto">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[2.1fr,1fr,1fr,1fr] gap-4 border border-black/10 px-6 py-5 text-sm font-medium">
                  <p>Product</p>
                  <p>Price</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>

                <div className="mt-10 space-y-10">
                  {displayedCartItems.map((item) => {
                    const maxQuantity = Math.max(item.quantity, 10)

                    return (
                      <div
                        className="grid grid-cols-[2.1fr,1fr,1fr,1fr] items-center gap-4 border border-black/10 px-6 py-6"
                        key={item.productSlug}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center bg-[#f5f5f5]">
                            <ProductVisual
                              iconClassName={`h-8 w-8 ${item.accentClassName}`}
                              imageClassName="max-h-12 max-w-full object-contain"
                              placeholderClassName="flex h-8 w-8 items-center justify-center text-black/40"
                              product={item}
                              videoClassName="max-h-12 max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <button
                              className="mt-2 text-xs text-brand"
                              onClick={() => removeFromCart(item.productSlug)}
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-brand">{formatCurrency(item.price)}</p>

                        <div>
                          <select
                            className="w-[78px] border border-black/20 px-3 py-2 text-sm outline-none"
                            onChange={(event) => handleQuantityChange(item, event.target.value)}
                            value={draftQuantities[item.productSlug] ?? String(item.quantity)}
                          >
                            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((quantity) => (
                              <option key={`${item.productSlug}-${quantity}`} value={String(quantity)}>
                                {quantity.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        <p className="text-sm text-brand">{formatCurrency(item.subtotal)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                className="inline-flex items-center justify-center border border-black/20 px-10 py-4 text-sm font-medium text-black transition hover:border-black"
                to="/shop"
              >
                Return To Shop
              </Link>

              <button
                className="inline-flex items-center justify-center border border-black/20 px-10 py-4 text-sm font-medium text-black transition hover:border-black"
                onClick={handleUpdateCart}
                type="button"
              >
                Update Cart
              </button>
            </section>

            <section className="mt-20 grid gap-8 lg:grid-cols-[1fr,470px] lg:items-start">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    className="w-full border border-black/20 px-4 py-4 text-sm outline-none"
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Coupon Code"
                    type="text"
                    value={couponCode}
                  />
                  <button
                    className="inline-flex items-center justify-center bg-brand px-8 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                    onClick={handleApplyCoupon}
                    type="button"
                  >
                    Apply Coupon
                  </button>
                </div>

                {couponMessage ? <p className="mt-4 text-sm text-black/60">{couponMessage}</p> : null}
              </div>

              <div className="border border-black/20 p-8">
                <h2 className="text-xl font-medium">Cart Total</h2>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(displayedSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  {displayedDiscount > 0 ? (
                    <div className="flex items-center justify-between border-b border-black/10 pb-4">
                      <span>Discount:</span>
                      <span>-{formatCurrency(displayedDiscount)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <span>Total:</span>
                    <span>{formatCurrency(displayedTotal)}</span>
                  </div>
                </div>

                <Link
                  className="mt-8 inline-flex items-center justify-center bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                  to="/checkout"
                >
                  Proceed to checkout
                </Link>
              </div>
            </section>
          </>
        ) : activeOrders.length ? (
          <section className="mt-12">
            {placedOrderId ? (
              <div className="border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-800">
                <h1 className="text-xl font-semibold">Order placed successfully</h1>
                <p className="mt-2 text-sm">Order {placedOrderId} is shown below.</p>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-brand">Your Orders</p>
                <h1 className="mt-2 text-3xl font-semibold">Recent placed orders</h1>
              </div>
              <Link className="text-sm font-medium text-brand" to="/orders">
                View All Orders
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {activeOrders.slice(0, 3).map((order) => (
                <article className="border border-black/10 bg-white p-6 shadow-soft" key={order.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-black/40">{order.id}</p>
                      <h2 className="mt-2 text-lg font-medium">Placed on {formatDate(order.placedAt)}</h2>
                    </div>
                    <span className="inline-flex self-start rounded-full bg-brand-soft px-4 py-2 text-xs font-medium text-brand">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {order.items.map((item) => (
                      <div
                        className="flex items-center justify-between gap-4 text-sm"
                        key={`${order.id}-${item.productSlug}`}
                      >
                        <span>{item.title} x {item.quantity}</span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                    <span>Total</span>
                    <span className="font-medium text-brand">{formatCurrency(order.total)}</span>
                  </div>
                </article>
              ))}
            </div>

            <Link
              className="mt-8 inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
              to="/shop"
            >
              Continue Shopping
            </Link>
          </section>
        ) : (
          <section className="mt-12 border border-black/10 bg-[#faf7f4] px-6 py-14 text-center">
            <h1 className="text-3xl font-semibold">Your cart is empty</h1>
            <p className="mt-4 text-sm text-black/60">
              Add products from the store, then come back here to update quantities and checkout.
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
              to="/shop"
            >
              Return To Shop
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
