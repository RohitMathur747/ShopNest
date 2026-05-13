const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controller/orderController");

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);

router.route("/my-orders").get(protect, getOrderById);

router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
