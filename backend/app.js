const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
require("./utils/initializeAdmin");

const dbConfig = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authorizeAdmin = require("./middlewares/authorizeAdminMiddleware");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/upload", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

// Routes
app.use("/posts", authenticateToken, blogRoutes);
app.use("/upload", authenticateToken, uploadRoutes);
app.use("/auth", authRoutes);
app.use("/admin", authenticateToken, authorizeAdmin, analyticsRoutes);
app.use("/dashboard", authenticateToken, dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
