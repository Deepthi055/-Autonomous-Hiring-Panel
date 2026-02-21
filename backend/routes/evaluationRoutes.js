const express = require("express");
const router = express.Router();
const evaluateCandidate = require("../controllers/evaluationController");

router.post("/evaluate", evaluateCandidate);

module.exports = router;