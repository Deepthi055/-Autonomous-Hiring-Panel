const buildDiscrepancies = (agentOutputs) => {
  const discrepancies = [];

  agentOutputs.forEach((agent) => {
    if (agent.contradictions && agent.contradictions.length > 0) {
      discrepancies.push({
        agent: agent.agentName,
        issues: agent.contradictions,
      });
    }
  });

  return discrepancies;
};

module.exports = buildDiscrepancies;