const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.post("/", protect, authorizeRoles("seller", "admin"), upload.array("images", 6), addProduct);
router.put("/:id", protect, authorizeRoles("seller", "admin"), upload.array("images", 6), updateProduct);
router.delete("/:id", protect, authorizeRoles("seller", "admin"), deleteProduct);

module.exports = router;
