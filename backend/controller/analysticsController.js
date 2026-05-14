const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");

const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue = totalRevenueData[0]
      ? totalRevenueData[0].totalRevenue
      : 0;
    res.status(200).json({
      success: true,
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
