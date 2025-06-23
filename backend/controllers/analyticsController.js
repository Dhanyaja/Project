import mongoose from 'mongoose';
import Card from '../models/cardModel.js';

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log("UserId for analytics: ", userId);

    const totalCards = await Card.countDocuments({ userId });
    const totalReviews = await Card.countDocuments({
      userId,
      lastReviewed: { $exists: true }
    });

    const avgQualityData = await Card.aggregate([
      { $match: { userId, lastQuality: { $ne: null } } },
      { $group: { _id: null, avgQuality: { $avg: "$lastQuality" } } }
    ]);
    const avgQuality = avgQualityData[0]?.avgQuality || 0;

    const qualityBreakdownData = await Card.aggregate([
      { $match: { userId, lastQuality: { $ne: null } } },
      {
        $group: {
          _id: "$lastQuality",
          count: { $sum: 1 }
        }
      }
    ]);

    const qualityBreakdown = { forgot: 0, hard: 0, good: 0, easy: 0 };
    qualityBreakdownData.forEach(item => {
      if (item._id <= 1) qualityBreakdown.forgot += item.count;
      else if (item._id === 2) qualityBreakdown.hard += item.count;
      else if (item._id === 3) qualityBreakdown.good += item.count;
      else if (item._id >= 4) qualityBreakdown.easy += item.count;
    });

    const dailyReviews = await Card.aggregate([
      { $match: { userId, lastReviewed: { $ne: null } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastReviewed" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalCards,
        totalReviews,
        avgQuality,
        qualityBreakdown,
        dailyReviews
      }
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get analytics",
      error: err.message
    });
  }
};
