const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  blogPostId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
