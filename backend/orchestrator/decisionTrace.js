const generateTrace = (agentOutputs, conflicts, finalDecision) => {

    let trace = [];

    agentOutputs.forEach(agent => {
        trace.push({
            agent: agent.agentName,
            score: agent.score,
            recommendation: agent.recommendation
        });
    });

    conflicts.forEach(conflict => {
        trace.push({ conflict });
    });

    trace.push({ finalDecision });

    return trace;
};

module.exports = generateTrace;
