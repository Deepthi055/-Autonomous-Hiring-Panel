// orchestrator/panelOrchestrator.js

// Import agents
const ResumeAgent = require("../agents/resumeAgent");
const TechnicalAgent = require("../agents/technicalAgent");
const BehavioralAgent = require("../agents/behavioralAgent");
const ClaimAgent = require("../agents/claimAgent");
const SkepticAgent = require("../agents/skepticAgent");
const ConsensusAgent = require("../agents/consensusAgent");

// Import LLM client (uses Cerebras)
const llmClient = require("../services/llmClient");

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

    // Run all agents with LLM client (using Cerebras)
    const results = await Promise.allSettled(
      agents.map(agent => agent.evaluate(llmClient))
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
    const consensusAgent = new ConsensusAgent(resume, transcript, jobDescription);
    
    // Use evaluate to leverage the agent's full capabilities (including LLM if configured)
    // This returns a structured object with recommendation, reasoning, etc.
    const consensusResult = await consensusAgent.evaluate(llmClient, successfulAgents);

    // Normalize output shape expected by report generator
    return {
      agentOutputs: successfulAgents,
      failedAgents,
      // Map the new agent output format to what the report generator expects
      finalDecision: consensusResult.recommendation,
      trace: consensusResult.reasoning,
      consensus: consensusResult
    };

  } catch (error) {
    console.error("Orchestration error:", error.message);
    throw error;
  }
}

module.exports = runPanelEvaluation;
