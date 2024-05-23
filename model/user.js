const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema); // Changed variable name to "User"

module.exports = User; // Export the User model
