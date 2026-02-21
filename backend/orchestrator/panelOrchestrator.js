// orchestrator/panelOrchestrator.js

// Import agents (adjust paths if needed)
const ResumeAgent = require("../agents/resumeAgent");
const TechnicalAgent = require("../agents/technicalAgent");
const BehavioralAgent = require("../agents/behavioralAgent");
const ClaimAgent = require("../agents/claimAgent");
const SkepticAgent = require("../agents/skepticAgent");
const ConsensusAgent = require("../agents/consensusAgent");

async function runPanelEvaluation(inputData) {
  try {
    console.log("Orchestration started");

    const { resume, transcript, jobDescription } = inputData;

    // Initialize agents
    const agents = [
      new ResumeAgent(resume, transcript, jobDescription),
      new TechnicalAgent(resume, transcript, jobDescription),
      new BehavioralAgent(resume, transcript, jobDescription),
      new ClaimAgent(resume, transcript, jobDescription),
      new SkepticAgent(resume, transcript, jobDescription)
    ];

    // Run all agents safely
    const results = await Promise.allSettled(
      agents.map(agent => agent.evaluate())
    );

    const successfulAgents = [];
    const failedAgents = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        successfulAgents.push(result.value);
      } else {
        console.error("Agent failed:", result.reason && result.reason.message ? result.reason.message : result.reason);
        failedAgents.push(result.reason && result.reason.message ? result.reason.message : String(result.reason));
      }
    }

    if (successfulAgents.length === 0) {
      throw new Error("All agents failed during evaluation.");
    }

    // Run consensus logic
    const consensusAgent = new ConsensusAgent();
    const consensusResult = consensusAgent.calculate(successfulAgents);

    // Normalize output shape expected by report generator
    return {
      agentOutputs: successfulAgents,
      failedAgents,
      finalDecision: consensusResult.decision,
      trace: consensusResult.trace,
      consensus: consensusResult
    };

  } catch (error) {
    console.error("Orchestration error:", error.message);
    throw error;
  }
}

module.exports = runPanelEvaluation;