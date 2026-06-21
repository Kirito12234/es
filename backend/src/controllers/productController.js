const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const { createProductSlug, toFrontendProduct } = require("../utils/productView");

const parseBoolean = (value) => value === true || value === "true";

const parseImages = (bodyImages, files = []) => {
  const uploadedImages = files.map((file) => `/uploads/${file.filename}`);

  if (!bodyImages) return uploadedImages;
  if (Array.isArray(bodyImages)) return [...bodyImages, ...uploadedImages].filter(Boolean);

  try {
    const parsed = JSON.parse(bodyImages);
    if (Array.isArray(parsed)) return [...parsed, ...uploadedImages].filter(Boolean);
  } catch (error) {
    return [
      ...bodyImages
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean),
      ...uploadedImages
    ];
  }

  return uploadedImages;
};

const parseArray = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const parseMedia = (bodyMedia, images) => {
  const explicitMedia = parseArray(bodyMedia, []);
  if (explicitMedia.length) return explicitMedia;

  return images.map((image, index) => ({
    id: `image-${Date.now()}-${index}`,
    kind: "image",
    name: `Product image ${index + 1}`,
    url: image
  }));
};

const buildProductPayload = (req, existingProduct = null) => {
  const title = req.body.title ?? req.body.name;
  const currentPrice = req.body.price !== undefined ? Number(req.body.price) : undefined;
  const oldPrice = req.body.oldPrice !== undefined && req.body.oldPrice !== "" ? Number(req.body.oldPrice) : undefined;
  const discountPrice =
    req.body.discountPrice !== undefined && req.body.discountPrice !== "" ? Number(req.body.discountPrice) : undefined;
  const stockQuantity = req.body.stockQuantity ?? req.body.stock;
  const images = parseImages(req.body.images, req.files);
  const productSlug = req.body.productSlug || (title ? createProductSlug(title) : existingProduct?.productSlug);
  const payload = {};

  if (title !== undefined) payload.name = title;
  if (req.body.description !== undefined) payload.description = req.body.description;
  if (req.body.category !== undefined) payload.category = req.body.category;
  if (req.body.brand !== undefined) payload.brand = req.body.brand;
  if (req.body.brandLogoUrl !== undefined) payload.brandLogoUrl = req.body.brandLogoUrl;
  if (req.body.sku !== undefined) payload.sku = req.body.sku;
  if (req.body.highlights !== undefined) payload.highlights = parseArray(req.body.highlights, []);
  if (req.body.warranty !== undefined) payload.warranty = req.body.warranty;
  if (req.body.delivery !== undefined) payload.delivery = req.body.delivery;
  if (req.body.returnPolicy !== undefined) payload.returnPolicy = req.body.returnPolicy;
  if (req.body.tags !== undefined) payload.tags = parseArray(req.body.tags, []);
  if (stockQuantity !== undefined) payload.stock = Number(stockQuantity);
  if (productSlug !== undefined) payload.productSlug = productSlug;
  if (images.length || req.body.images !== undefined || req.files?.length) {
    payload.images = images;
    payload.media = parseMedia(req.body.media, images);
    payload.thumbnailUrl = req.body.thumbnailUrl || images[0] || "";
  } else if (req.body.media !== undefined) {
    payload.media = parseMedia(req.body.media, existingProduct?.images || []);
    payload.thumbnailUrl = req.body.thumbnailUrl || payload.media[0]?.url || existingProduct?.thumbnailUrl || "";
  }
  if (req.body.sizes !== undefined) payload.sizes = parseArray(req.body.sizes, ["Standard"]);
  if (req.body.colors !== undefined) {
    payload.colors = parseArray(req.body.colors, []).map((color) =>
      typeof color === "string"
        ? {
            value: color,
            ringClassName: color.toLowerCase() === "#111111" || color.toLowerCase() === "black"
              ? "ring-black/80"
              : "ring-black/10"
          }
        : color
    );
  }

  if (currentPrice !== undefined) {
    if (oldPrice !== undefined && oldPrice > currentPrice && discountPrice === undefined) {
      payload.price = oldPrice;
      payload.discountPrice = currentPrice;
    } else {
      payload.price = currentPrice;
      if (discountPrice !== undefined) payload.discountPrice = discountPrice;
    }
  }

  ["isFlashSale", "isBestSelling", "isNewArrival"].forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = parseBoolean(req.body[field]);
  });

  return payload;
};

const addProduct = asyncHandler(async (req, res) => {
  const payload = buildProductPayload(req);

  if (!payload.name || !payload.description || payload.price === undefined || !payload.category || payload.stock === undefined) {
    res.status(400);
    throw new Error("Title, description, price, category and stock quantity are required");
  }

  const product = await Product.create({
    ...payload,
    discountPrice: payload.discountPrice || 0,
    sellerId: req.user._id
  });

  res.status(201).json(toFrontendProduct(product));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { keyword, category, flashSale, bestSelling, newArrival } = req.query;
  const filter = {};

  if (keyword) filter.name = { $regex: keyword, $options: "i" };
  if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
  if (flashSale !== undefined) filter.isFlashSale = parseBoolean(flashSale);
  if (bestSelling !== undefined) filter.isBestSelling = parseBoolean(bestSelling);
  if (newArrival !== undefined) filter.isNewArrival = parseBoolean(newArrival);

  const products = await Product.find(filter).populate("sellerId", "name email").sort({ createdAt: -1 });
  res.json(products.map(toFrontendProduct));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("sellerId", "name email");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(toFrontendProduct(product));
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ productSlug: req.params.slug }).populate("sellerId", "name email");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(toFrontendProduct(product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const isOwner = product.sellerId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only update your own products");
  }

  Object.assign(product, buildProductPayload(req, product));

  res.json(toFrontendProduct(await product.save()));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const isOwner = product.sellerId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only delete your own products");
  }

  await Promise.all([
    Cart.updateMany({}, { $pull: { items: { productId: product._id } } }),
    Wishlist.updateMany({}, { $pull: { products: product._id } })
  ]);
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

const searchProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || "";
  const products = await Product.find({ name: { $regex: keyword, $options: "i" } }).sort({ createdAt: -1 });
  res.json(products.map(toFrontendProduct));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: { $regex: `^${req.params.category}$`, $options: "i" }
  }).sort({ createdAt: -1 });
  res.json(products.map(toFrontendProduct));
});

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
};
