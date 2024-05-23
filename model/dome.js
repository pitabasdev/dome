const mongoose = require("mongoose");

const dome = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
  },
  {
    collection: "dome",
  }
);

module.exports = mongoose.model("dome", dome);
