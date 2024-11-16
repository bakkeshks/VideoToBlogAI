const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const dbConfig = require("../config/db");
require("dotenv").config();

// Function to initialize admin user
const initializeAdmin = async () => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    let adminUser = await User.findOne({ email: "admin@gmail.com" });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@1103", salt);

      adminUser = new User({
        email: "admin@gmail.com",
        password: hashedPassword,
        username: "admin",
        role: "admin",
        secondsRemaining: 500,
      });

      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
    process.exit(1);
  }
};

initializeAdmin();
