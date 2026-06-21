const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true
    },
    productSlug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    media: [
      {
        id: String,
        kind: {
          type: String,
          enum: ["image", "video"],
          default: "image"
        },
        name: String,
        url: String
      }
    ],
    thumbnailUrl: {
      type: String,
      default: ""
    },
    sizes: {
      type: [String],
      default: ["Standard"]
    },
    colors: [
      {
        value: String,
        ringClassName: String
      }
    ],
    brand: {
      type: String,
      trim: true,
      default: ""
    },
    brandLogoUrl: { type: String, default: "" },
    sku: { type: String, trim: true, default: "" },
    highlights: { type: [String], default: [] },
    warranty: { type: String, default: "" },
    delivery: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
    tags: { type: [String], default: [] },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isFlashSale: {
      type: Boolean,
      default: false
    },
    isBestSelling: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", brand: "text", productSlug: "text" });

module.exports = mongoose.model("Product", productSchema);
