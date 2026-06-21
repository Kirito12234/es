const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Contact = require("./models/Contact");

const products = [
  {
    name: "Urban Runner Sneakers",
    description: "Lightweight everyday sneakers with breathable mesh and cushioned soles.",
    price: 89.99,
    discountPrice: 69.99,
    category: "Shoes",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772"
    ],
    brand: "Stride",
    isFlashSale: true,
    isBestSelling: true,
    isNewArrival: false
  },
  {
    name: "Minimal Smart Watch",
    description: "A sleek smart watch with activity tracking, notifications and long battery life.",
    price: 149.99,
    discountPrice: 129.99,
    category: "Electronics",
    stock: 22,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
    brand: "Pulse",
    isFlashSale: false,
    isBestSelling: true,
    isNewArrival: true
  },
  {
    name: "Classic Denim Jacket",
    description: "A regular fit denim jacket designed for layering across seasons.",
    price: 74.99,
    discountPrice: 0,
    category: "Fashion",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1543076447-215ad9ba6923"],
    brand: "Northline",
    isFlashSale: false,
    isBestSelling: false,
    isNewArrival: true
  },
  {
    name: "Ceramic Pour Over Set",
    description: "Hand-finished ceramic coffee dripper with matching cup and reusable filter.",
    price: 39.99,
    discountPrice: 29.99,
    category: "Home",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"],
    brand: "Brewly",
    isFlashSale: true,
    isBestSelling: false,
    isNewArrival: false
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with rich sound and active noise cancellation.",
    price: 199.99,
    discountPrice: 169.99,
    category: "Electronics",
    stock: 18,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
    brand: "Auralux",
    isFlashSale: false,
    isBestSelling: true,
    isNewArrival: true
  }
];

const seedData = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Contact.deleteMany({})
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin"
  });

  const seller = await User.create({
    name: "Demo Seller",
    email: "seller@example.com",
    password: "password123",
    role: "seller"
  });

  await User.create({
    name: "Demo Customer",
    email: "customer@example.com",
    password: "password123",
    role: "customer"
  });

  await Product.insertMany(products.map((product) => ({ ...product, sellerId: seller._id })));

  console.log("Seed data imported successfully");
  console.log("Admin: admin@example.com / password123");
  console.log("Seller: seller@example.com / password123");
  console.log("Customer: customer@example.com / password123");
  console.log(`Created by admin user: ${admin.email}`);
  process.exit(0);
};

seedData().catch((error) => {
  console.error(error);
  process.exit(1);
});
