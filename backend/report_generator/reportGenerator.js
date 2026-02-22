const buildDiscrepancies = require("../services/discrepancyService");
const formatChartData = require("../services/chartService");

function buildFinalReport(panelResult) {
  const { agentOutputs = [], finalDecision = "No-Decision", trace = [], failedAgents = [], consensus = {}, finalScore = 0 } = panelResult || {};

  return {
    candidateAssessment: {
      verdict: finalDecision,
      summary: consensus.summary || `Average score: ${finalScore}`,
      averageScore: finalScore,
      confidenceLevel: panelResult.confidenceLevel || 0
    },
    discrepancyLog: buildDiscrepancies(agentOutputs),
    agentInteractionTrace: trace,
    failedAgents,
    chartData: formatChartData(agentOutputs),
    rawAgentOutputs: agentOutputs,
    consensus: consensus  // Include full consensus data
  };
}

module.exports = buildFinalReport;
