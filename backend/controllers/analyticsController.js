const Analytics = require("../models/Analytics");

const getAnalyticsSummary = async (req, res) => {
  try {
    // Get the total number of unique users
    const uniqueUsersCount = await Analytics.aggregate([
      { $group: { _id: "$userId" } },
      { $count: "uniqueUsers" },
    ]).then((result) => (result.length > 0 ? result[0].uniqueUsers : 0));

    // Get the total number of blog posts
    const totalBlogPostsCount = await Analytics.countDocuments();

    // Get the total duration processed
    const totalDurationProcessed = await Analytics.aggregate([
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
    ]).then((results) =>
      results.length > 0 ? (results[0].totalDuration / 3600).toFixed(3) : 0
    );

    // Get all analytics records with username, createdAt, userId, blogPostId, and duration
    const allAnalyticsRecords = await Analytics.find(
      {},
      "userId username blogPostId createdAt duration"
    ).lean();

    const summary = {
      uniqueUsers: uniqueUsersCount,
      totalBlogPosts: totalBlogPostsCount,
      totalDurationProcessed: totalDurationProcessed,
      allRecords: allAnalyticsRecords,
    };

    res.json(summary);
  } catch (err) {
    console.error("Error fetching analytics summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAnalyticsSummary };
