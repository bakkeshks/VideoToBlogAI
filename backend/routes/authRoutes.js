const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Register route
router.post("/register", authController.register);

// Sign-in route
router.post("/login", authController.login);

module.exports = router;
