import analyticsService from "../services/analytics.service.js";

const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getAnalytics(req.user.userId, req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching analytics.",
    });
  }
};

export default {
  getAnalytics,
};
