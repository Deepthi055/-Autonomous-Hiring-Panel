const buildDiscrepancies = require("./discrepancyService");
const formatChartData = require("./chartService");

const buildFinalReport = (panelResult) => {
  const { agentOutputs, finalDecision, trace } = panelResult;

  return {
    candidateAssessment: {
      finalDecision,
      summary: trace,
    },
    discrepancyLog: buildDiscrepancies(agentOutputs),
    agentInteractionTrace: trace,
    chartData: formatChartData(agentOutputs),
  };
};

module.exports = buildFinalReport;