const express = require("express");
const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/seller-orders", authorizeRoles("seller", "admin"), getSellerOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
