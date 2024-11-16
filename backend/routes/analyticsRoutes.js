const express = require("express");
const router = express.Router();
const { getAnalyticsSummary } = require("../controllers/analyticsController");

// Route to get analytics summary by the admin user
router.get("/summary", getAnalyticsSummary);

module.exports = router;
