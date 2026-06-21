const asyncHandler = require("../utils/asyncHandler");
const calculateCartTotals = require("../utils/cartTotals");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
};

const populatedCart = (userId) => Cart.findOne({ userId }).populate("items.productId");

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.productId.toString() === productId);
  const requestedQuantity = Number(quantity);

  if (requestedQuantity < 1 || requestedQuantity > product.stock) {
    res.status(400);
    throw new Error("Invalid quantity for available stock");
  }

  if (item) item.quantity += requestedQuantity;
  else cart.items.push({ productId, quantity: requestedQuantity });

  await cart.save();
  res.status(201).json(calculateCartTotals(await populatedCart(req.user._id)));
});

const getCart = asyncHandler(async (req, res) => {
  await getOrCreateCart(req.user._id);
  res.json(calculateCartTotals(await populatedCart(req.user._id)));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { action, quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.productId.toString() === req.params.productId);

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  if (quantity !== undefined) item.quantity = Number(quantity);
  else if (action === "decrease") item.quantity -= 1;
  else item.quantity += 1;

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (item.quantity > product.stock) {
    res.status(400);
    throw new Error("Quantity exceeds available stock");
  }

  if (item.quantity < 1) {
    cart.items = cart.items.filter((cartItem) => cartItem.productId.toString() !== req.params.productId);
  }

  await cart.save();
  res.json(calculateCartTotals(await populatedCart(req.user._id)));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
  await cart.save();
  res.json(calculateCartTotals(await populatedCart(req.user._id)));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ items: [], subtotal: 0, total: 0 });
});

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
