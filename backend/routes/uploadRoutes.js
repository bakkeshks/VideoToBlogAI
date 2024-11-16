const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported file type. Please upload a video or audio file."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB limit
  },
});

router.post("/addvideo", upload.single("file"), async (req, res, next) => {
  try {
    // Process the uploaded file
    await uploadController.uploadAndProcessVideo(req, res);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds the limit" });
      }
      // Handle other Multer errors if necessary
      return res.status(400).json({ message: error.message });
    } else {
      next(error); // Pass other errors to the error-handling middleware
    }
  }
});

// JSON error handling middleware
router.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = router;
