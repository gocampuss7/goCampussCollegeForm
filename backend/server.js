const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const CollegeModel = require("./models/CollegeModel");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin : ["http://localhost:5173", "https://gocampuss-form.onrender.com"],
    methods : ["GET, POST, PUT, DELETE"],
    credentials : true
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// POST API to save college info
app.post("/api/college-info", async (req, res) => {
  try {
    const newCollegeInfo = new CollegeModel(req.body);
    await newCollegeInfo.save();
    res.status(201).json({ message: "College info saved successfully!" });
  } catch (error) {
    console.error("Error saving college info:", error);

    // Check for Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// GET API to fetch all college info
app.get("/api/college-info", async (req, res) => {
  try {
    const colleges = await CollegeModel.find({});
    res.status(200).json(colleges);
  } catch (error) {
    console.error("Error fetching college info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET API to fetch a single college by ID
app.get("/api/college-info/:id", async (req, res) => {
  try {
    const college = await CollegeModel.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.status(200).json(college);
  } catch (error) {
    console.error("Error fetching college by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/college-info/:id", async (req, res) => {
  try {
    await CollegeModel.findByIdAndDelete(req.params.id);
    res.json({ message: "College deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting college" });
  }
});

// PUT update college
app.put("/api/college-info/:id", async (req, res) => {
  try {
    const updatedCollege = await CollegeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCollege);
  } catch (err) {
    res.status(500).json({ message: "Error updating college" });
  }
});

app.get("/", (req,res)=>{
  res.send("Backend Activated");
})


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
