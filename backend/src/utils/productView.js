const createProductSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";

const calculateSalePercentage = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

const normalizeMedia = (product) => {
  const explicitMedia = Array.isArray(product.media) ? product.media : [];
  if (explicitMedia.length) return explicitMedia;

  return (product.images || []).map((image, index) => ({
    id: `${product._id}-image-${index}`,
    kind: "image",
    name: product.name,
    url: image
  }));
};

const toFrontendProduct = (product) => {
  const plainProduct = typeof product.toObject === "function" ? product.toObject() : product;
  const activePrice =
    plainProduct.discountPrice && plainProduct.discountPrice > 0
      ? plainProduct.discountPrice
      : plainProduct.price;
  const oldPrice =
    plainProduct.discountPrice && plainProduct.discountPrice > 0
      ? plainProduct.price
      : plainProduct.oldPrice || null;
  const productSlug = plainProduct.productSlug || createProductSlug(plainProduct.name);
  const media = normalizeMedia(plainProduct);

  return {
    ...plainProduct,
    id: plainProduct._id,
    title: plainProduct.name,
    oldPrice,
    sale: calculateSalePercentage(activePrice, oldPrice),
    productSlug,
    stockQuantity: plainProduct.stock,
    stockLabel: plainProduct.stock > 0 ? "In Stock" : "Out of Stock",
    media,
    thumbnailUrl: plainProduct.thumbnailUrl || media[0]?.url || plainProduct.images?.[0] || null,
    breadcrumbs: ["Home", plainProduct.category || "Storefront"],
    sizes: plainProduct.sizes?.length ? plainProduct.sizes : ["Standard"],
    colors: plainProduct.colors?.length
      ? plainProduct.colors
      : [
          { value: "#DB4444", ringClassName: "ring-black/10" },
          { value: "#111111", ringClassName: "ring-black/80" }
        ],
    accentClassName: "text-brand"
  };
};

module.exports = { createProductSlug, toFrontendProduct };
