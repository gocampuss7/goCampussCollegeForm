const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const CollegeModel = require("./models/CollegeModel");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gocampuss-form.onrender.com",
      "https://gocampuss.vercel.app",
      "https://www.gocampuss.com",
    ],
    methods: ["GET, POST, PUT, DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());


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

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    // console.log(password);

    if (!password) {
      return res.status(400).json({ message: "Password Required" });
    }

    if (password === process.env.SECRET_PASSWORD) {
      const token = jwt.sign({ user: "admin" }, process.env.SECRET_JWT);
      // console.log(token);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({ message: "Login Success" });
    } else {
      return res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Login Failed", error: error.message });
  }
});

app.get("/login", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No Login Credential found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    return res.status(200).json({ message: "Login Success" });
  } catch (error) {
    return res.status(401).json({ message: "Login Failed", error: error.message });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ message: "Logged out" });
});


app.post("/api/gemini-autofill", async (req, res) => {
  try {
    const { collegeName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Server configuration error: Gemini API key not found.",
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: `I need detailed and authentic data about the college named ${collegeName}. Please follow the instructions strictly and return a single JSON object with the following structure:

{
  "collegeName": "",
  "counsellingNames": "",
  "established": "",
  "campus": "size of campus",
  "location": "",
  "nirfRanking": "",
  "seatMatrix": [
    { "branch": "", "seats": "" }
  ],
  "totalCSStudents": "",
  "nbaBranches": "",
  "cutoffs": {},
  "hostelFees": {
    "boys": "",
    "girls": ""
  },
  "academicFees": {
    "year1": "",
    "year2": "",
    "year3": "",
    "year4": "",
    "total": ""
  },
  "totalFees": "",
  "placements": {
    "totalStudents": "",
    "totalCompanies": "",
    "totalOffers": "",
    "highestPackage": "",
    "avgPackage": "",
    "csAvgPackage": "",
    "companyData": [
      { "name": "", "offers": "", "ctc": "" }
    ]
  }
}

Please follow these detailed instructions:

1. The seatMatrix must include all undergraduate B.Tech branches and their respective student intake as published on the college’s official website.

2. In hostelFees, include details like room rent, mess fees, and any other charges. Provide total 4-year hostel fee separately for boys and girls.

3. In academicFees, break down yearly academic fees and give the total for 4 years.

4. totalFees = academicFees.total + hostelFees.boys (or girls, choose available/more common one).

5. totalCSStudents is the actual intake of CSE in one batch.

6. In placements, include:
   - total students placed
   - total companies visited
   - total offers
   - highest package
   - avg package
   - csAvgPackage
   - At least 10 companies with offers and CTC

if You are not able to get any specific data don't refer me to other source just include the most appropriate you get.
Return only the JSON object. DO NOT include any explanation, comment, markdown formatting, or disclaimer. Just return raw JSON as plain text.`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const geminiText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // console.log(geminiText);
    if (geminiText) {
      try {
        const cleaned = extractJsonFromText(geminiText);
        console.log(cleaned);
        if (cleaned) {
          const parsed = JSON.parse(cleaned);
          return res.json(parsed);
        }
      } catch (err) {
        return res.status(500).json({
          error: "Failed to parse JSON from Gemini API response.",
          rawGeminiOutput: geminiText,
        });
      }
    }

    return res.status(500).json({ error: "Invalid response from Gemini API." });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data || "Gemini API error",
        status: error.response.status,
      });
    } else if (error.request) {
      return res.status(504).json({
        error: "No response from Gemini API (timeout or network issue).",
      });
    } else {
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }
});

const extractJsonFromText = (text) => {
  try {
    // Extract content between ```json and ```
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (jsonMatch) return jsonMatch[1].trim();

    // Fallback: Try to find first valid JSON-looking block
    const braceMatch = text.match(/{[\s\S]*}/);
    if (braceMatch) return braceMatch[0].trim();

    return null;
  } catch (e) {
    return null;
  }
};

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
