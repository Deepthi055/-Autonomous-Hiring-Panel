const formatChartData = (agentOutputs) => {
  return agentOutputs.map((agent) => ({
    agent: agent.agentName,
    score: agent.score,
  }));
};

module.exports = formatChartData;