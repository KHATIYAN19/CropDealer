const Request = require("../models/requestModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// 🔹 Function to Fetch Stats for a Date Range
const getStatsForDateRange = async (productIds, startDate = null, endDate = null) => {
  let matchStage = { product: { $in: productIds } };

  if (startDate && endDate) {
    matchStage.statusChangeDate = { $gte: startDate, $lte: endDate };
  }

  const result = await Request.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        totalAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
        totalQuantity: { $sum: "$quantity" },
        totalRequests: { $sum: 1 },
      },
    },
  ]);

  let stats = { totalAmount: 0, totalQuantity: 0, totalRequests: 0 };
  result.forEach((entry) => {
    stats.totalAmount += entry.totalAmount || 0;
    stats.totalQuantity += entry.totalQuantity || 0;
    stats.totalRequests += entry.totalRequests || 0;
  });

  return stats;
};

// 🔹 Main API to Get Stats
exports.getAllData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch product IDs owned by user
    const products = await Product.find({ owner: userId }).select("_id");
    if (!products.length) return res.json({ lifetime: {}, last7Days: {}, last30Days: {} });

    const productIds = products.map((p) => p._id);

    // Date Ranges
    const now = new Date();
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 6);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 29);

    // Fetch Stats
    const lifetimeStats = await getStatsForDateRange(productIds);
    const last7DaysStats = await getStatsForDateRange(productIds, last7Days, now);
    const last30DaysStats = await getStatsForDateRange(productIds, last30Days, now);

    res.json({
      lifetime: lifetimeStats,
      last7Days: last7DaysStats,
      last30Days: last30DaysStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
};


const getDailyStats = async (productIds) => {
    try {
      // Define the last 30 days' date
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
  
      // Perform the aggregation query
      const dailyStats = await Request.aggregate([
        {
          $match: {
            product: { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) },  // Ensure ObjectId format
            statusChangeDate: { $gte: last30Days }  // Filter requests in the last 30 days
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$statusChangeDate" } }, // Group by date
            totalAmount: { $sum: { $multiply: ["$price", "$quantity"] } }, // Calculate total amount
            totalQuantity: { $sum: "$quantity" }, // Total quantity
            totalRequests: { $sum: 1 }, // Total number of requests
          }
        },
        { $sort: { _id: 1 } } // Sort by date ascending
      ]);
  
      return dailyStats; // Return the aggregated data
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      return [];
    }
  };

// 🔹 API for Daily Stats Over Last 30 Days
exports.getDayByDayDataForLast30Days = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.find({ owner: userId }).select("_id");
    if (!products.length) return res.json({ dailyData: [] });
      console.log("[r",products);
      
    const productIds = products.map((p) => p._id);
    // const last30Days = new Date();
    // last30Days.setDate(last30Days.getDate() - 29);
    //     console.log(productIds,last30Days)
    // const dailyStats = await Request.aggregate([
    //   { $match: { product: { $in: productIds }, statusChangeDate: { $gte: last30Days } } },
    //   {
    //     $group: {
    //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$statusChangeDate" } },
    //       totalAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
    //       totalQuantity: { $sum: "$quantity" },
    //       totalRequests: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { _id: 1 } },
    // ]);

    const dailyStats=getDailyStats(productIds)

    res.json({ dailyData: dailyStats });
  } catch (error) {
    console.error("Error fetching daily data:", error);
    res.status(500).json({ error: error.message });
  }
};
