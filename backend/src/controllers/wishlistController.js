const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const { toFrontendProduct } = require("../utils/productView");

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) wishlist = await Wishlist.create({ userId, products: [] });
  return wishlist;
};

const wishlistResponse = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate("products");
  return {
    ...wishlist.toObject(),
    products: wishlist.products.map(toFrontendProduct)
  };
};

const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  if (!wishlist.products.some((id) => id.toString() === req.params.productId)) {
    wishlist.products.push(req.params.productId);
    await wishlist.save();
  }

  res.status(201).json(await wishlistResponse(req.user._id));
});

const getWishlist = asyncHandler(async (req, res) => {
  await getOrCreateWishlist(req.user._id);
  res.json(await wishlistResponse(req.user._id));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
  await wishlist.save();
  res.json(await wishlistResponse(req.user._id));
});

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
