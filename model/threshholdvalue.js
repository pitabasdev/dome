const mongoose = require("mongoose");

const threshholdschema = new mongoose.Schema(
  {
    re_temp_low: { type: String, required: true },
    re_temp_high: { type: String, required: true },
    re_temp_hl: { type: String, required: true },
    re_temp_hh: { type: String, required: true },
    re_humidity_low: { type: String, required: true },
    re_humidity_high: { type: String, required: true },
    re_humidity_hl: { type: String, required: true },
    re_humidity_hh: { type: String, required: true },
    re_co2_low: { type: String, required: true },
    re_co2_high: { type: String, required: true },
    re_soilmoisture_low: { type: String, required: true },
    re_soilmoisture_high: { type: String, required: true },
  },
  {
    collection: "threshholdvalue",
  }
);

const threshholdvaluemodel = mongoose.model("threshhold", threshholdschema);

module.exports = threshholdvaluemodel;
