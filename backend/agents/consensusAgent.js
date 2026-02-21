class ConsensusAgent {
  calculate(agentOutputs) {
    const scores = agentOutputs.map(output => output.score || 0);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const recommendation = averageScore >= 6.5 ? "Hire" : "No Hire";

    return {
      decision: recommendation,
      averageScore: Number(averageScore.toFixed(2)),
      trace: agentOutputs.map(output => ({
        agent: output.agentName,
        score: output.score,
        recommendation: output.recommendation
      }))
    };
  }
}

module.exports = ConsensusAgent;