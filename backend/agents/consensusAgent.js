class ConsensusAgent {
  calculate(agentOutputs = []) {
    // Basic consensus: average scores and collect trace
    const trace = agentOutputs.map(a => ({ agent: a.agent, score: a.score, comments: a.comments }));
    const avg = agentOutputs.reduce((s, a) => s + (a.score || 0), 0) / Math.max(1, agentOutputs.length);
    const decision = avg >= 0.6 ? "Hire" : "No-Hire";
    return {
      decision,
      averageScore: Number(avg.toFixed(2)),
      trace
    };
  }
}

module.exports = ConsensusAgent;
