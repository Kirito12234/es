const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("sellerId", "name email").sort({ createdAt: -1 });
  res.json(products);
});

const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("userId", "name email")
    .populate("items.productId")
    .sort({ createdAt: -1 });
  res.json(orders);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Admin cannot delete their own account");
  }
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

const deleteProductAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = { getAllUsers, getAllProductsAdmin, getAllOrdersAdmin, deleteUser, deleteProductAdmin };
