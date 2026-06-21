const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const Review = require("../models/Review");

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }
  ]);

  const rating = stats[0] ? Number(stats[0].averageRating.toFixed(1)) : 0;
  const reviews = stats[0] ? stats[0].reviewCount : 0;
  await Product.findByIdAndUpdate(productId, { rating, reviews });
};

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error("Rating and comment are required");
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = await Review.findOneAndUpdate(
    { productId: req.params.productId, userId: req.user._id },
    { rating, comment },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await updateProductRating(product._id);
  res.status(201).json(review);
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = { addReview, getProductReviews };
