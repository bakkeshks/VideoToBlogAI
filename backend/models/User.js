const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  secondsRemaining: { type: Number, default: 1200 },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
