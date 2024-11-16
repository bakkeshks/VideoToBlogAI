const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  blogPostId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "completed",
  },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
