const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController"); // Adjust the path as necessary

// Route to get dashboard data
router.get("/", getDashboardData);

module.exports = router;
