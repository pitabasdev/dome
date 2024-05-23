const express = require("express");
const ejs = require("ejs");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Dome = require("./model/dome"); // Ensure this is the correct model name
const User = require("./model/user");
const SensorInfo = require("./model/sensorinfo");
const app = express();
const ADMIN_CODE = process.env.ADMIN_CODE;
const JWT_SECRET =
  "nuifbewiudfbewiudsfbweufiiuw783278278782378#%$#$#$#$#%$#*y7biuyguyjyvfytjyvf";

app.use(express.json());
app.use(cors());
const threshholdvaluemodel = require("./model/threshholdvalue");
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
const json2csv = require("json2csv").parse;
mongoose
  .connect("mongodb://localhost:27017/dome")
  .then(async () => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error("DB connection error:", error);
  });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/home", (req, res) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.render("dashboard.ejs");
  } catch (error) {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/reg", async (req, res) => {
  const { name, email, password: plaintextpassword, specialaccess } = req.body;

  if (!name || typeof name !== "string") {
    return res.json({ status: "error", error: "Invalid Name" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid Email" });
  }

  if (!plaintextpassword || typeof plaintextpassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  const password = await bcrypt.hash(plaintextpassword, 10);

  try {
    if (specialaccess === ADMIN_CODE) {
      const response = await User.create({
        name,
        email,
        password,
        admin: true,
      });
      console.log("User record created:", response);
    } else {
      const response = await User.create({
        name,
        email,
        password,
        admin: false,
      });
      console.log("User record created:", response);
    }
  } catch (error) {
    console.log("Error creating user:", error);
    if (error.code === 11000) {
      return res.json({
        status: "error",
        error: "Email / Username is already in use!",
      });
    }
    throw error;
  }
  res.json({ status: "ok" });
});
app.get("/home/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }
    const user = jwt.verify(token, JWT_SECRET);
    if (!user) {
      return res.redirect("/login");
    }
    const result = await Dome.findById(req.params.id);

    if (!result) {
      return res.redirect("/home");
    }
    res.render("Dome.ejs", { id: req.params.id });
  } catch (error) {
    console.error("Error accessing /home/:id route:", error);
    res.redirect("/login");
  }
});

app.patch("/editdomedetails/:id", async (req, res) => {
  const token = req.cookies.token;
  if (
    req.body.name === "" ||
    req.body.name === undefined ||
    req.body.name === null ||
    req.body.name === " " ||
    req.body.desc === undefined ||
    req.body.desc === null
  ) {
    return res.json({
      status: "error",
      error: "Invalid Name or Description",
    });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.admin) {
      console.log(req.body);
      const result = await Dome.findByIdAndUpdate(
        req.params.id,
        { $set: { name: req.body.name, desc: req.body.desc } },
        { new: true }
      );
      if (result) {
        return res.json({
          status: "ok",
          message: "Dome details updated successfully",
        });
      } else {
        return res.json({
          status: "error",
          message: "Dome details not updated",
        });
      }
    } else {
      return res.json({ status: "fail", message: "This is for admin only!" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.json({ status: "fail", message: "This is for admin only!" });
  }
});
app.post("/createdome", (req, res) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.admin === true) {
      const { name, desc } = req.body;
      Dome.create({ name, desc })
        .then((response) => {
          res.json({ status: "ok", message: "Inserted Successfully! ✅" });
        })
        .catch((error) => {
          console.error("Error creating dome:", error);
          res.json({ status: "fail", message: "Something Went Wrong!" });
        });
    } else {
      throw new Error("Unauthorized access");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.json({ status: "fail", message: "This is for admin only!" });
  }
});
app.get("/getthreshholdvalue/:id", async (req, res) => {
  try {
    const result = await threshholdvaluemodel.findOne({ _id: req.params.id });
    if (!result) {
      return res.json({
        status: "fail",
        message: "Threshold value not found!",
      });
    }

    const current = await SensorInfo.findOne({ polyhsid: req.params.id }).sort({
      date: -1,
    });
    if (!current) {
      return res.json({
        status: "fail",
        message: "Current sensor info not found!",
      });
    }

    res.json({
      success: 1,
      led: [
        {
          re_temp_low: result.re_temp_low,
          re_temp_high: result.re_temp_high,
          re_temp_hl: result.re_temp_hl,
          re_temp_hh: result.re_temp_hh,
          re_humidity_low: result.re_humidity_low,
          re_humidity_high: result.re_humidity_high,
          re_humidity_hl: result.re_humidity_hl,
          re_humidity_hh: result.re_humidity_hh,
          re_co2_low: result.re_co2_low,
          re_co2_high: result.re_co2_high,
          re_soilmoisture_low: result.re_soilmoisture_low,
          re_soilmoisture_high: result.re_soilmoisture_high,
          cu_temp: current.temp,
          cu_humidity: current.humidity,
          cu_soilmoisture: current.moisture,
          cu_co2: current.co2,
        },
      ],
    });
  } catch (error) {
    console.error("Error retrieving threshold value or sensor info:", error);
    res.json({ status: "fail", message: "Something went wrong!" });
  }
});



app.get(
  "/addthreshholdvalue/val1/:val1/val2/:val2/val3/:val3/",
  async (req, res) => {
    //const { re_temp, re_humidity, re_soilmoisture } = req.params;
    console.log(req.params);
    try {
      const response = await threshholdmodel.create({
        re_temp: req.params.val1,
        re_humidity: req.params.val2,
        re_soilmoisture: req.params.val3,
      });
      res.json({ status: "ok", message: "Successfully Inserted" });
    } catch (error) {
      res.json({ status: "fail", message: " Something Went Wrong !" });
    }
  }
);

app.get("/getalldome", async (req, res) => {
  console.log("Received request for /getalldome");

  try {
    const result = await Dome.find({});
    if (!result || result.length === 0) {
      console.log("No domes found");
      return res
        .status(404)
        .json({ status: "fail", message: "No domes found!" });
    }
    console.log("Fetched domes:", result);
    res.json(result);
  } catch (err) {
    console.error("Error fetching domes:", err);
    res.status(500).json({
      status: "fail",
      message: "Something Went Wrong!",
      error: err.message,
    });
  }
});
app.post("/addthreshhold/:id", async (req, res) => {
  const {
    re_temp_low,
    re_temp_high,
    re_temp_hl,
    re_temp_hh,
    re_humidity_low,
    re_humidity_high,
    re_humidity_hl,
    re_humidity_hh,
    re_co2_low,
    re_co2_high,
    re_soilmoisture_low,
    re_soilmoisture_high,
  } = req.body;

  console.log(
    re_temp_low,
    re_temp_high,
    re_temp_hl,
    re_temp_hh,
    re_humidity_low,
    re_humidity_high,
    re_humidity_hl,
    re_humidity_hh,
    re_co2_low,
    re_co2_high,
    re_soilmoisture_low,
    re_soilmoisture_high
  );

  try {
    let result = await threshholdvaluemodel.findById(req.params.id);

    if (result) {
      result.re_temp_low = re_temp_low;
      result.re_temp_high = re_temp_high;
      result.re_temp_hl = re_temp_hl;
      result.re_temp_hh = re_temp_hh;
      result.re_humidity_low = re_humidity_low;
      result.re_humidity_high = re_humidity_high;
      result.re_humidity_hl = re_humidity_hl;
      result.re_humidity_hh = re_humidity_hh;
      result.re_co2_low = re_co2_low;
      result.re_co2_high = re_co2_high;
      result.re_soilmoisture_low = re_soilmoisture_low;
      result.re_soilmoisture_high = re_soilmoisture_high;
      await result.save();
      console.log("Inserted value!");
      return res.json({ status: "ok", message: "Inserted Successfully! ✅" });
    } else {
      const newThreshold = new threshholdvaluemodel({
        _id: req.params.id,
        re_temp_low,
        re_temp_high,
        re_temp_hl,
        re_temp_hh,
        re_humidity_low,
        re_humidity_high,
        re_humidity_hl,
        re_humidity_hh,
        re_co2_low,
        re_co2_high,
        re_soilmoisture_low,
        re_soilmoisture_high,
      });
      await newThreshold.save();
      console.log("Inserted value!");
      return res.json({ status: "ok", message: "Inserted Successfully! ✅" });
    }
  } catch (error) {
    console.error("Error inserting threshold value:", error);
    return res.json({ status: "fail", message: "Something Went Wrong!" });
  }
});

app.get("/getrefvalues/:id", async (req, res) => {
  try {
    const result = await threshholdvaluemodel.findById(req.params.id);
    if (!result) {
      return res.json({
        status: "fail",
        message: "Threshold value not found!",
      });
    }
    res.json(result);
  } catch (error) {
    console.error("Error retrieving threshold value:", error);
    res.json({ status: "fail", message: "Something went wrong!" });
  }
});

app.get("/getsensordata/:id", async (req, res) => {
  try {
    const result = await SensorInfo.find({ polyhsid: req.params.id })
      .sort({ date: -1 })
      .limit(10);
    if (result) {
      res.json(result);
    } else {
      res.json({ status: "fail", message: "No data found!" });
    }
  } catch (err) {
    res.json({ status: "fail", message: "Something Went Wrong!" });
  }
});
app.get(
  "/addsensordata/:id/val1/:v1/val2/:v2/val3/:v3/val4/:v4",
  async (req, res) => {
    console.log(req.params);
    try {
      const response = await SensorInfo.create({
        polyhsid: req.params.id,
        temp: req.params.v1,
        humidity: req.params.v2,
        moisture: req.params.v3,
        co2: req.params.v4,
      });
      console.log(response);
      res.json({ status: "ok", message: "Successfully Inserted" });
    } catch (error) {
      res.json({ status: "fail", message: " Something Went Wrong !" });
    }
  }
);
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "Invalid Email/password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, admin: user.admin },
      JWT_SECRET
    );
    res.cookie("token", token, { httpOnly: true }); // Set token in cookies
    return res.json({ status: "ok", data: token });
  }
  res.json({ status: "error", error: "Invalid Email / password" });
});
app.get("/delete/:id", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Unauthorized or invalid token" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);

    if (!user.admin) {
      return res
        .status(403)
        .json({ status: "fail", message: "This is for admin only!" });
    }

    const result = await Dome.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Dome not found!" });
    }

    return res
      .status(200)
      .json({ status: "ok", message: "Dome deleted successfully!" });
  } catch (error) {
    console.error("Error verifying token or processing request", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Something went wrong!" });
  }
});
app.get("/download/:id", async (req, res) => {
  const fields = ["polyhsid", "temp", "humidity", "moisture", "date"];
  try {
    const result = await SensorInfo.find({ polyhsid: req.params.id }).exec();
    if (!result) {
      return res.status(404).json({ error: "No data found" });
    }
    let csv;
    try {
      csv = json2csv(result, { fields });
    } catch (err) {
      console.error("Error generating CSV:", err); // Log the error message
      return res.status(500).json({ error: "Error generating CSV" });
    }
    res.header("Content-Type", "text/csv");
    res.attachment(`${req.params.id}.csv`);
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
