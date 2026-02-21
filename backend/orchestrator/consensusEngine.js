const resolveConsensus = (agentOutputs, conflicts) => {

    let hireVotes = 0;
    let noHireVotes = 0;

    agentOutputs.forEach(agent => {
        if (agent.recommendation === "Hire") {
            hireVotes++;
        } else {
            noHireVotes++;
        }
    });

    if (noHireVotes >= 2) {
        return "No Hire";
    }

    return "Hire";
};

module.exports = resolveConsensus;