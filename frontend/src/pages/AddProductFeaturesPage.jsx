import React from 'react'
import { CheckCircle2, ListChecks, PackagePlus, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

const PRODUCT_FEATURE_TEMPLATE_KEY = 'redcart_product_feature_template'

const inputClassName =
  'w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-brand'
const labelClassName = 'mb-2 block text-sm font-medium text-black/70'

const defaultTemplate = {
  sizes: 'S, M, L',
  colors: '#DB4444, #111111',
  highlights: 'Premium quality, Ready to ship, Easy returns',
  warranty: '1 year seller warranty',
  delivery: 'Ships within 24 hours',
  returnPolicy: '7 day easy return',
  tags: 'new, premium',
  isFlashSale: false,
  isBestSelling: false,
  isNewArrival: true,
}

const loadTemplate = () => {
  if (typeof window === 'undefined') return defaultTemplate

  try {
    return {
      ...defaultTemplate,
      ...JSON.parse(window.localStorage.getItem(PRODUCT_FEATURE_TEMPLATE_KEY) || '{}'),
    }
  } catch {
    return defaultTemplate
  }
}

function AddProductFeaturesPage() {
  const [formData, setFormData] = React.useState(loadTemplate)
  const [message, setMessage] = React.useState('')

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    window.localStorage.setItem(PRODUCT_FEATURE_TEMPLATE_KEY, JSON.stringify(formData))
    setMessage('Product feature defaults saved. New listings will use these values automatically.')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          /{' '}
          <Link className="hover:text-black" to="/dashboard">
            Dashboard
          </Link>{' '}
          / <span className="text-black">Product Features</span>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr,360px]">
          <form className="rounded-[28px] bg-white p-8 shadow-soft sm:p-10" onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-brand">Dashboard Tools</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight">Product feature defaults</h1>
                <p className="mt-4 max-w-[680px] text-sm leading-7 text-black/60">
                  Manage reusable product details inside your seller dashboard. These defaults are applied
                  when you open the add-product page, and can still be edited per product.
                </p>
              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand sm:flex">
                <ListChecks className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>

            {message ? (
              <div className="mt-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5" aria-hidden="true" />
                <span>{message}</span>
              </div>
            ) : null}

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className={labelClassName}>Default Sizes</span>
                <input
                  className={inputClassName}
                  name="sizes"
                  onChange={handleChange}
                  placeholder="S, M, L"
                  type="text"
                  value={formData.sizes}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Default Colours</span>
                <input
                  className={inputClassName}
                  name="colors"
                  onChange={handleChange}
                  placeholder="#DB4444, #111111"
                  type="text"
                  value={formData.colors}
                />
              </label>

              <label className="block md:col-span-2">
                <span className={labelClassName}>Feature Highlights</span>
                <textarea
                  className="min-h-[130px] w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-brand"
                  name="highlights"
                  onChange={handleChange}
                  placeholder="Premium quality, Ready to ship, Easy returns"
                  value={formData.highlights}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Warranty</span>
                <input
                  className={inputClassName}
                  name="warranty"
                  onChange={handleChange}
                  placeholder="1 year seller warranty"
                  type="text"
                  value={formData.warranty}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Delivery Promise</span>
                <input
                  className={inputClassName}
                  name="delivery"
                  onChange={handleChange}
                  placeholder="Ships within 24 hours"
                  type="text"
                  value={formData.delivery}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Return Policy</span>
                <input
                  className={inputClassName}
                  name="returnPolicy"
                  onChange={handleChange}
                  placeholder="7 day easy return"
                  type="text"
                  value={formData.returnPolicy}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Default Tags</span>
                <input
                  className={inputClassName}
                  name="tags"
                  onChange={handleChange}
                  placeholder="new, premium"
                  type="text"
                  value={formData.tags}
                />
              </label>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['isNewArrival', 'New Arrival'],
                ['isBestSelling', 'Best Selling'],
                ['isFlashSale', 'Flash Sale'],
              ].map(([name, label]) => (
                <label
                  className="flex items-center gap-3 border border-black/10 bg-[#fcfcfc] px-4 py-3 text-sm text-black/70"
                  key={name}
                >
                  <input checked={formData[name]} name={name} onChange={handleChange} type="checkbox" />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                className="inline-flex items-center gap-2 bg-brand px-8 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                type="submit"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save Defaults</span>
              </button>
              <Link
                className="inline-flex items-center justify-center border border-black/15 px-8 py-4 text-sm font-medium transition hover:border-black"
                to="/add-product"
              >
                Back To Add Product
              </Link>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-black px-8 py-10 text-white shadow-panel">
              <p className="text-sm font-medium text-brand">How It Works</p>
              <h2 className="mt-3 text-3xl font-semibold">Professional product setup</h2>
              <div className="mt-8 space-y-4 text-sm leading-7 text-white/70">
                <p>1. Save reusable feature values once.</p>
                <p>2. Open Add Product and the fields are pre-filled.</p>
                <p>3. Edit any product-specific detail before saving.</p>
                <p>4. The product appears on home, shop, dashboard, product page, and category pages.</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-8 shadow-soft">
              <PackagePlus className="h-8 w-8 text-brand" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-semibold">Ready to list?</h2>
              <p className="mt-3 text-sm leading-7 text-black/60">
                After saving defaults, create a product with category, price, stock, images, and all feature details.
              </p>
              <Link
                className="mt-6 inline-flex items-center justify-center bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to="/add-product"
              >
                Add Product
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AddProductFeaturesPage
