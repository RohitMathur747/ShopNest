const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAdminStats } = require("../controller/analysticsController");

const router = express.Router();

router.post("/", protect, admin, getAdminStats);

module.exports = router;
