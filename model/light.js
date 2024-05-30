const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema({
  name: String,
  state: { type: Boolean, default: false },
});

const Light = mongoose.model("Light", deviceSchema);

module.exports = Light;
