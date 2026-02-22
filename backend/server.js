const path = require("path");
// Explicitly load .env from the backend directory to avoid path issues
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Debugging: Verify API Keys are loaded
console.log("------------------------------------------------");
console.log("Server Starting...");
console.log("Loading .env from:", path.resolve(__dirname, '.env'));
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Not Found");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "✅ Loaded" : "❌ Not Found");
console.log("------------------------------------------------");

const express = require("express");
const fs = require("fs");
const evaluationRoutes = require("./routes/evaluationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use("/api", evaluationRoutes);
app.use("/api", interviewRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
