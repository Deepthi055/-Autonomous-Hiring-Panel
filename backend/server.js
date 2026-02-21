require("dotenv").config();
const express = require("express");
const cors = require("cors");

const evaluateCandidate = require("./controllers/evaluateCandidate");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct way to use controller
app.post("/api/evaluate", evaluateCandidate);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});