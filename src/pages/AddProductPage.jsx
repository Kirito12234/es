import React from 'react'
import {
  CheckCircle2,
  Film,
  ImagePlus,
  PackagePlus,
  Settings2,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommerce } from '../hooks/useCommerce.jsx'
import { createProductSlug, STORE_CATEGORIES } from '../utils/product-helpers.js'

const inputClassName =
  'w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-brand'
const labelClassName = 'mb-2 block text-sm font-medium text-black/70'
const PRODUCT_FEATURE_TEMPLATE_KEY = 'redcart_product_feature_template'

const getFeatureTemplate = () => {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(PRODUCT_FEATURE_TEMPLATE_KEY) || '{}')
  } catch {
    return {}
  }
}

const readFilesAsDataUrls = async (files, kind) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = () => {
            resolve({
              id:
                globalThis.crypto?.randomUUID?.() ??
                `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
              kind,
              name: file.name,
              url: String(reader.result),
            })
          }

          reader.onerror = () => {
            reject(new Error(`Unable to read ${file.name}.`))
          }

          reader.readAsDataURL(file)
        }),
    ),
  )

function AddProductPage() {
  const { slug: editingSlug } = useParams()
  const { user } = useAuth()
  const { addProduct, getProductBySlug, updateProduct } = useCommerce()
  const editingProduct = editingSlug ? getProductBySlug(editingSlug) : null
  const isEditing = Boolean(editingSlug)
  const imageInputRef = React.useRef(null)
  const videoInputRef = React.useRef(null)
  const [formData, setFormData] = React.useState(() => {
    const template = getFeatureTemplate()

    return {
      title: '',
      category: '',
      price: '',
      oldPrice: '',
      stockQuantity: '10',
      sizes: template.sizes || 'S, M, L',
      colors: template.colors || '#DB4444, #111111',
      description: '',
      brand: '',
      brandLogoUrl: '',
      sku: '',
      highlights: template.highlights || '',
      warranty: template.warranty || '',
      delivery: template.delivery || '',
      returnPolicy: template.returnPolicy || '',
      tags: template.tags || '',
      isFlashSale: Boolean(template.isFlashSale),
      isBestSelling: Boolean(template.isBestSelling),
      isNewArrival: template.isNewArrival !== false,
    }
  })
  const [media, setMedia] = React.useState([])
  const [error, setError] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')
  const [createdProduct, setCreatedProduct] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!editingProduct) return

    const hydrateForm = window.setTimeout(() => {
      setFormData({
        title: editingProduct.title || '',
        category: editingProduct.category || '',
        price: String(editingProduct.price ?? ''),
        oldPrice: String(editingProduct.oldPrice ?? ''),
        stockQuantity: String(editingProduct.stockQuantity ?? 0),
        sizes: (editingProduct.sizes || []).join(', '),
        colors: (editingProduct.colors || []).map((color) => color?.value || color).join(', '),
        description: editingProduct.description || '',
        brand: editingProduct.brand || '',
        brandLogoUrl: editingProduct.brandLogoUrl || '',
        sku: editingProduct.sku || '',
        highlights: (editingProduct.highlights || []).join(', '),
        warranty: editingProduct.warranty || '',
        delivery: editingProduct.delivery || '',
        returnPolicy: editingProduct.returnPolicy || '',
        tags: (editingProduct.tags || []).join(', '),
        isFlashSale: Boolean(editingProduct.isFlashSale),
        isBestSelling: Boolean(editingProduct.isBestSelling),
        isNewArrival: Boolean(editingProduct.isNewArrival),
      })
      setMedia(editingProduct.media || [])
    }, 0)

    return () => window.clearTimeout(hydrateForm)
  }, [editingProduct])

  const slugPreview = createProductSlug(formData.title) || 'product-title'
  const imageCount = media.filter((item) => item.kind === 'image').length
  const videoCount = media.filter((item) => item.kind === 'video').length

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleUpload = async (kind, files) => {
    if (!files.length) {
      return
    }

    setError('')
    setSuccessMessage('')

    const allowedCount = kind === 'image' ? 4 - imageCount : 1 - videoCount

    if (allowedCount <= 0) {
      setError(kind === 'image' ? 'You can upload up to 4 images.' : 'Only 1 video is allowed.')
      return
    }

    try {
      const selectedFiles = Array.from(files).slice(0, allowedCount)
      const uploadedMedia = await readFilesAsDataUrls(selectedFiles, kind)
      setMedia((currentMedia) => [...currentMedia, ...uploadedMedia])
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Media upload failed.')
    }
  }

  const handleImagesSelected = async (event) => {
    await handleUpload('image', event.target.files ?? [])
    event.target.value = ''
  }

  const handleVideoSelected = async (event) => {
    await handleUpload('video', event.target.files ?? [])
    event.target.value = ''
  }

  const handleRemoveMedia = (mediaId) => {
    setMedia((currentMedia) => currentMedia.filter((item) => item.id !== mediaId))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      price: '',
      oldPrice: '',
      stockQuantity: '10',
      sizes: 'S, M, L',
      colors: '#DB4444, #111111',
      description: '',
      brand: '',
      brandLogoUrl: '',
      sku: '',
      highlights: '',
      warranty: '',
      delivery: '',
      returnPolicy: '',
      tags: '',
      isFlashSale: false,
      isBestSelling: false,
      isNewArrival: true,
    })
    setMedia([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const productData = { ...formData, media }
      const result = isEditing
        ? await updateProduct(editingSlug, productData)
        : await addProduct(productData)

      if (!result.success) {
        setError(result.message)
        return
      }

      setCreatedProduct(result.product)
      setSuccessMessage(result.message)
      if (!isEditing) resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Product could not be saved.')
    } finally {
      setIsSubmitting(false)
    }
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
          / <span className="text-black">{isEditing ? 'Edit Product' : 'Add Product'}</span>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[28px] bg-white p-8 shadow-soft sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-brand">Seller Tools</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight">
                  {isEditing ? 'Edit product listing' : 'Create a new product listing'}
                </h1>
                <p className="mt-4 max-w-[680px] text-sm leading-7 text-black/60">
                  Add the product title, category, price, stock, full description, and
                  upload product images or one video. The title automatically generates
                  the product URL slug. If the category is not exact, the
                  product is placed by its title, tags, and description.
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition hover:text-brand-dark"
                  to="/dashboard/product-features"
                >
                  <Settings2 className="h-4 w-4" aria-hidden="true" />
                  <span>Open advanced feature defaults</span>
                </Link>
              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand sm:flex">
                <PackagePlus className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>

            {successMessage && createdProduct ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
                    <p className="mt-1 text-sm text-emerald-700">
                      {createdProduct.title} is now available from your dashboard and product route.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        className="inline-flex items-center justify-center bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                        to={`/products/${createdProduct.productSlug}`}
                      >
                        View Product
                      </Link>
                      <Link
                        className="inline-flex items-center justify-center border border-emerald-300 px-5 py-3 text-sm font-medium text-emerald-800 transition hover:border-emerald-400"
                        to="/dashboard"
                      >
                        Back To Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-soft px-5 py-4 text-sm text-brand">
                {error}
              </div>
            ) : null}

            <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>Product Title*</span>
                  <input
                    className={inputClassName}
                    name="title"
                    onChange={handleChange}
                    placeholder="Premium Gaming Headset"
                    type="text"
                    value={formData.title}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>Category or page description</span>
                  <input
                    className={inputClassName}
                    list="product-categories"
                    name="category"
                    onChange={handleChange}
                    placeholder="Gaming, Electronics, Beauty..."
                    type="text"
                    value={formData.category}
                  />
                  <datalist id="product-categories">
                    {STORE_CATEGORIES.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="block">
                  <span className={labelClassName}>Current Price*</span>
                  <input
                    className={inputClassName}
                    min="0"
                    name="price"
                    onChange={handleChange}
                    placeholder="149"
                    step="0.01"
                    type="number"
                    value={formData.price}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>Previous Price</span>
                  <input
                    className={inputClassName}
                    min="0"
                    name="oldPrice"
                    onChange={handleChange}
                    placeholder="199"
                    step="0.01"
                    type="number"
                    value={formData.oldPrice}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>Stock Quantity</span>
                  <input
                    className={inputClassName}
                    min="0"
                    name="stockQuantity"
                    onChange={handleChange}
                    placeholder="10"
                    type="number"
                    value={formData.stockQuantity}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>Size Options</span>
                  <input
                    className={inputClassName}
                    name="sizes"
                    onChange={handleChange}
                    placeholder="S, M, L"
                    type="text"
                    value={formData.sizes}
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-black/10 bg-[#fcfcfc] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Professional Product Features</h2>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      These details improve product pages, category browsing, dashboard review, and homepage placement.
                    </p>
                  </div>
                  <Link
                    className="inline-flex items-center justify-center border border-black/15 px-4 py-3 text-sm font-medium transition hover:border-black"
                    to="/dashboard/product-features"
                  >
                    Manage Defaults
                  </Link>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className={labelClassName}>Brand</span>
                    <input
                      className={inputClassName}
                      name="brand"
                      onChange={handleChange}
                      placeholder="RedCart Essentials"
                      type="text"
                      value={formData.brand}
                    />
                  </label>

                  <label className="block">
                    <span className={labelClassName}>Brand Logo URL</span>
                    <input
                      className={inputClassName}
                      name="brandLogoUrl"
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                      type="url"
                      value={formData.brandLogoUrl}
                    />
                  </label>

                  <label className="block">
                    <span className={labelClassName}>SKU</span>
                    <input
                      className={inputClassName}
                      name="sku"
                      onChange={handleChange}
                      placeholder="RC-2026-001"
                      type="text"
                      value={formData.sku}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className={labelClassName}>Feature Highlights</span>
                    <textarea
                      className="min-h-[110px] w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-brand"
                      name="highlights"
                      onChange={handleChange}
                      placeholder="Premium materials, Fast delivery, Easy returns"
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
                    <span className={labelClassName}>Tags</span>
                    <input
                      className={inputClassName}
                      name="tags"
                      onChange={handleChange}
                      placeholder="new, premium, gift"
                      type="text"
                      value={formData.tags}
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ['isNewArrival', 'Show as New Arrival'],
                    ['isBestSelling', 'Feature as Best Selling'],
                    ['isFlashSale', 'Feature in Flash Sale'],
                  ].map(([name, label]) => (
                    <label
                      className="flex items-center gap-3 border border-black/10 bg-white px-4 py-3 text-sm text-black/70"
                      key={name}
                    >
                      <input checked={formData[name]} name={name} onChange={handleChange} type="checkbox" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className={labelClassName}>Colour Options</span>
                <input
                  className={inputClassName}
                  name="colors"
                  onChange={handleChange}
                  placeholder="#DB4444, #111111"
                  type="text"
                  value={formData.colors}
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Product Description*</span>
                <textarea
                  className="min-h-[180px] w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-brand"
                  name="description"
                  onChange={handleChange}
                  placeholder="Describe the product, materials, usage, standout features, and who it is for."
                  value={formData.description}
                />
              </label>

              <div className="rounded-3xl border border-dashed border-black/15 bg-[#fcfcfc] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Upload Product Media</h2>
                    <p className="mt-2 text-sm text-black/60">
                      Add up to 4 images and 1 video. Images will appear first in the product gallery.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-sm font-medium transition hover:border-black"
                      onClick={() => imageInputRef.current?.click()}
                      type="button"
                    >
                      <ImagePlus className="h-4 w-4" aria-hidden="true" />
                      <span>Upload Images</span>
                    </button>
                    <button
                      className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-sm font-medium transition hover:border-black"
                      onClick={() => videoInputRef.current?.click()}
                      type="button"
                    >
                      <Film className="h-4 w-4" aria-hidden="true" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                </div>

                <input
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={handleImagesSelected}
                  ref={imageInputRef}
                  type="file"
                />
                <input
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoSelected}
                  ref={videoInputRef}
                  type="file"
                />

                {media.length ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {media.map((item) => (
                      <article
                        className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                        key={item.id}
                      >
                        <div className="flex h-48 items-center justify-center bg-[#f5f5f5] p-3">
                          {item.kind === 'video' ? (
                            <video
                              className="h-full w-full object-contain"
                              controls
                              playsInline
                              src={item.url}
                            />
                          ) : (
                            <img
                              alt={item.name}
                              className="h-full w-full object-contain"
                              src={item.url}
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-black">{item.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/40">
                              {item.kind}
                            </p>
                          </div>
                          <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-brand hover:text-brand"
                            onClick={() => handleRemoveMedia(item.id)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white px-6 text-center">
                    <UploadCloud className="h-10 w-10 text-black/30" aria-hidden="true" />
                    <p className="mt-4 text-sm font-medium text-black">No media uploaded yet</p>
                    <p className="mt-2 text-sm text-black/50">
                      Use the upload buttons above to attach product images and video.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center justify-center bg-brand px-8 py-4 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? isEditing ? 'Updating Product...' : 'Saving Product...'
                    : isEditing ? 'Update Product' : 'Save Product'}
                </button>
                <Link
                  className="inline-flex items-center justify-center border border-black/15 px-8 py-4 text-sm font-medium transition hover:border-black"
                  to="/dashboard"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-black px-8 py-10 text-white shadow-panel">
              <p className="text-sm text-white/65">Seller</p>
              <h2 className="mt-3 text-3xl font-semibold">{user?.name ?? 'Seller'}</h2>
              <p className="mt-3 text-sm text-white/70">{user?.email}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Generated slug</p>
                  <p className="mt-2 text-sm font-medium text-white">/products/{slugPreview}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Media status</p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {imageCount} image{imageCount !== 1 ? 's' : ''} and {videoCount} video
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-8 shadow-soft">
              <h2 className="text-2xl font-semibold">Listing checklist</h2>
              <div className="mt-6 space-y-4 text-sm text-black/60">
                <p>1. Add a clear product title so the product URL is generated correctly.</p>
                <p>2. Set the current price and optional previous price to show a discount badge.</p>
                <p>3. Upload strong product images first, then add one product video if needed.</p>
                <p>4. Use the description field for materials, features, use cases, and fit.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AddProductPage
