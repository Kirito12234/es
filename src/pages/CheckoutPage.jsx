import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { formatCurrency } from '../utils/formatters.js'

const inputClassName =
  'w-full bg-[#f5f5f5] px-4 py-4 text-sm text-black outline-none placeholder:text-black/35'

function CheckoutPage() {
  const navigate = useNavigate()
  const { saveBillingDetails, user } = useAuth()
  const { appliedCoupon, applyCoupon, cartItems, discount, placeOrder, shipping, subtotal, total } =
    useCommerce()
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName ?? '',
    companyName: user?.companyName ?? '',
    streetAddress: user?.address ?? '',
    apartment: user?.apartment ?? '',
    townCity: user?.city ?? '',
    phoneNumber: user?.phone ?? '',
    emailAddress: user?.email ?? '',
    paymentMethod: 'cash',
  })
  const [couponCode, setCouponCode] = React.useState(appliedCoupon?.code ?? '')
  const [error, setError] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [completedOrder, setCompletedOrder] = React.useState(null)
  const [saveInfo, setSaveInfo] = React.useState(true)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!cartItems.length) {
      setError('Your cart is empty.')
      return
    }

    if (
      !formData.firstName.trim() ||
      !formData.streetAddress.trim() ||
      !formData.townCity.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.emailAddress.trim()
    ) {
      setError('Please complete the billing details before placing the order.')
      return
    }

    if (saveInfo) {
      const billingResult = await saveBillingDetails(formData)

      if (!billingResult.success) {
        setError(billingResult.message)
        return
      }
    }

    const result = await placeOrder({
      billingDetails: formData,
      paymentMethod: formData.paymentMethod,
    })

    if (!result.success) {
      setError(result.message)
      return
    }

    setCompletedOrder(result.order)
    navigate('/cart', {
      replace: true,
      state: { placedOrderId: result.order.id },
    })
  }

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode)

    if (result.success) {
      if (result.code) setCouponCode(result.code)
      setMessage(result.message)
      setError('')
      return
    }

    setError(result.message)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">Checkout</span>
        </div>

        {completedOrder ? (
          <section className="mt-12 border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
            <h1 className="text-3xl font-semibold text-emerald-800">Order placed successfully</h1>
            <p className="mt-4 text-sm text-emerald-700">
              Order <span className="font-medium">{completedOrder.id}</span> is now in your account history.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                className="inline-flex items-center justify-center bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to="/orders"
              >
                View My Orders
              </Link>
              <Link
                className="inline-flex items-center justify-center border border-emerald-300 px-8 py-3 text-sm font-medium text-emerald-800 transition hover:border-emerald-400"
                to="/"
              >
                Back To Home
              </Link>
            </div>
          </section>
        ) : (
          <form className="mt-12 grid gap-10 lg:grid-cols-[1fr,0.85fr]" onSubmit={handlePlaceOrder}>
            <section>
              <h1 className="text-4xl font-medium">Billing Details</h1>

              <div className="mt-12 grid gap-8">
                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">First Name*</span>
                  <input
                    className={inputClassName}
                    name="firstName"
                    onChange={handleChange}
                    type="text"
                    value={formData.firstName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Company Name</span>
                  <input
                    className={inputClassName}
                    name="companyName"
                    onChange={handleChange}
                    type="text"
                    value={formData.companyName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Street Address*</span>
                  <input
                    className={inputClassName}
                    name="streetAddress"
                    onChange={handleChange}
                    type="text"
                    value={formData.streetAddress}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Apartment, floor, etc. (optional)</span>
                  <input
                    className={inputClassName}
                    name="apartment"
                    onChange={handleChange}
                    type="text"
                    value={formData.apartment}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Town/City*</span>
                  <input
                    className={inputClassName}
                    name="townCity"
                    onChange={handleChange}
                    type="text"
                    value={formData.townCity}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Phone Number*</span>
                  <input
                    className={inputClassName}
                    name="phoneNumber"
                    onChange={handleChange}
                    type="text"
                    value={formData.phoneNumber}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Email Address*</span>
                  <input
                    className={inputClassName}
                    name="emailAddress"
                    onChange={handleChange}
                    type="email"
                    value={formData.emailAddress}
                  />
                </label>

                <label className="flex items-center gap-3 text-sm text-black/60">
                  <input
                    checked={saveInfo}
                    onChange={() => setSaveInfo((currentState) => !currentState)}
                    type="checkbox"
                  />
                  <span>Save this information for faster check-out next time</span>
                </label>
              </div>
            </section>

            <section>
              <div className="space-y-6 pt-10 lg:pt-16">
                {cartItems.length ? (
                  cartItems.map((item) => (
                    <div className="flex items-center justify-between gap-4" key={item.productSlug}>
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
                        <p className="text-sm">{item.title}</p>
                      </div>
                      <span className="text-sm">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))
                ) : (
                  <div className="border border-black/10 bg-[#faf7f4] px-6 py-10 text-center">
                    <p className="text-sm text-black/60">Your cart is empty.</p>
                    <Link className="mt-5 inline-block text-sm font-medium text-brand" to="/cart">
                      Return to cart
                    </Link>
                  </div>
                )}

                <div className="border-t border-black/10 pt-6 text-sm">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 ? (
                    <div className="flex items-center justify-between border-b border-black/10 py-4">
                      <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between border-b border-black/10 py-4">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <input
                        checked={formData.paymentMethod === 'bank'}
                        name="paymentMethod"
                        onChange={handleChange}
                        type="radio"
                        value="bank"
                      />
                      <span>Bank</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-black/60">
                      <span className="rounded bg-[#f5f5f5] px-2 py-1">Visa</span>
                      <span className="rounded bg-[#f5f5f5] px-2 py-1">MC</span>
                      <span className="rounded bg-[#f5f5f5] px-2 py-1">PayPal</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <input
                        checked={formData.paymentMethod === 'cash'}
                        name="paymentMethod"
                        onChange={handleChange}
                        type="radio"
                        value="cash"
                      />
                      <span>Cash on delivery</span>
                    </div>
                  </label>
                </div>

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

                {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
                {error ? <p className="text-sm text-brand">{error}</p> : null}

                <button
                  className="inline-flex items-center justify-center bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!cartItems.length}
                  type="submit"
                >
                  Place Order
                </button>
              </div>
            </section>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CheckoutPage
