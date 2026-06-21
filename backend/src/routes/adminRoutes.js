const express = require("express");
const {
  getAllUsers,
  getAllProductsAdmin,
  getAllOrdersAdmin,
  deleteUser,
  deleteProductAdmin
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));
router.get("/users", getAllUsers);
router.get("/products", getAllProductsAdmin);
router.get("/orders", getAllOrdersAdmin);
router.delete("/users/:id", deleteUser);
router.delete("/products/:id", deleteProductAdmin);

module.exports = router;
