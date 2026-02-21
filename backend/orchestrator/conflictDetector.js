const detectConflicts = (agentOutputs) => {

    let conflicts = [];

    const scores = agentOutputs.map(a => a.score);

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (maxScore - minScore > 3) {
        conflicts.push("Large scoring disagreement detected");
    }

    const recommendations = new Set(agentOutputs.map(a => a.recommendation));

    if (recommendations.size > 1) {
        conflicts.push("Agents disagree on final verdict");
    }

    return conflicts;
};

module.exports = detectConflicts;
