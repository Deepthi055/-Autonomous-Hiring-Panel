const buildDiscrepancies = require("../services/discrepancyService");
const formatChartData = require("../services/chartService");

function buildFinalReport(panelResult) {
  const { agentOutputs = [], finalDecision = "No-Decision", trace = [], failedAgents = [] } = panelResult || {};

  return {
    candidateAssessment: {
      verdict: finalDecision,
      summary: `Average score: ${panelResult && panelResult.consensus ? panelResult.consensus.averageScore : 'N/A'}`
    },
    discrepancyLog: buildDiscrepancies(agentOutputs),
    agentInteractionTrace: trace,
    failedAgents,
    chartData: formatChartData(agentOutputs),
    rawAgentOutputs: agentOutputs
  };
}

module.exports = buildFinalReport;
