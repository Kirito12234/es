const asyncHandler = require("../utils/asyncHandler");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { toFrontendOrder } = require("../utils/orderView");

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping address and payment method are required");
  }

  if (!["COD", "Online"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Payment method must be COD or Online");
  }

  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.productId;
    if (!product) {
      res.status(400);
      throw new Error("A product in your cart is no longer available");
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} does not have enough stock`);
    }

    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    subtotal += price * item.quantity;
    orderItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      name: product.name,
      image: product.images[0] || "",
      price,
      quantity: item.quantity
    });
  }

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    total: subtotal,
    status: paymentMethod === "Online" ? "paid" : "pending",
    paidAt: paymentMethod === "Online" ? new Date() : undefined
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(toFrontendOrder(order));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate("items.productId").sort({ createdAt: -1 });
  res.json(orders.map(toFrontendOrder));
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.sellerId": req.user._id })
    .populate("userId", "name email")
    .populate("items.productId")
    .sort({ createdAt: -1 });
  res.json(orders.map(toFrontendOrder));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email")
    .populate("items.productId");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isCustomer = order.userId._id.toString() === req.user._id.toString();
  const isSeller = order.items.some((item) => item.sellerId.toString() === req.user._id.toString());
  if (!isCustomer && !isSeller && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied for this order");
  }

  res.json(toFrontendOrder(order));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isSeller = order.items.some((item) => item.sellerId.toString() === req.user._id.toString());
  const isCustomer = order.userId.toString() === req.user._id.toString();
  const customerCancellingOwnOrder = isCustomer && status === "cancelled";

  if (!isSeller && !customerCancellingOwnOrder && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the seller, order customer, or admin can update this order");
  }

  order.status = status;
  if (status === "paid" && !order.paidAt) order.paidAt = new Date();
  if (status === "delivered" && !order.deliveredAt) order.deliveredAt = new Date();

  res.json(toFrontendOrder(await order.save()));
});

module.exports = { createOrder, getMyOrders, getSellerOrders, getOrderById, updateOrderStatus };
