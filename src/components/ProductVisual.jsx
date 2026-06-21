import { ImageOff } from 'lucide-react'
import { getProductPrimaryMedia } from '../utils/product-helpers.js'

function ProductVisual({
  product,
  media = null,
  imageClassName = '',
  videoClassName = '',
  iconClassName = '',
  placeholderClassName = '',
  showVideoControls = false,
}) {
  const previewMedia = media ?? getProductPrimaryMedia(product)

  if (previewMedia?.kind === 'video' && previewMedia.url) {
    return (
      <video
        autoPlay={!showVideoControls}
        className={videoClassName}
        controls={showVideoControls}
        loop={!showVideoControls}
        muted={!showVideoControls}
        playsInline
        src={previewMedia.url}
      />
    )
  }

  if (previewMedia?.url) {
    return <img alt={product.title ?? 'Product preview'} className={imageClassName} src={previewMedia.url} />
  }

  if (product.icon) {
    const Icon = product.icon
    return <Icon className={iconClassName} aria-hidden="true" />
  }

  return (
    <div className={placeholderClassName}>
      <ImageOff className="h-6 w-6" aria-hidden="true" />
    </div>
  )
}

export default ProductVisual
