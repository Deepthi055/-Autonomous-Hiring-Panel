const runPanelEvaluation = require("../orchestrator/panelOrchestrator");
const validateInput = require("../utils/inputValidator");
const buildFinalReport = require("../report_generator/reportGenerator");

const evaluateCandidate = async (req, res) => {
  try {
    const inputData = validateInput(req.body);

    const panelResult = await runPanelEvaluation(inputData);

    const finalReport = buildFinalReport(panelResult);

    res.status(200).json(finalReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = evaluateCandidate;