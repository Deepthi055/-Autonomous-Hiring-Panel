const ResumeAgent = require("../agents/resumeAgent");
const TechnicalAgent = require("../agents/technicalAgent");
const BehavioralAgent = require("../agents/behavioralAgent");
const ClaimAgent = require("../agents/claimAgent");
const ConsensusAgent = require("../agents/consensusAgent");
const { callCerebras } = require("../agents/cerebrasClient");

/**
 * Wrapper to make agents work with callCerebras
 * The agents expect an LLM client with a `complete(prompt)` method that returns JSON
 */
const llmWrapper = {
  async complete(prompt) {
    const result = await callCerebras("You are a hiring assistant.", prompt);
    return JSON.stringify(result);
  }
};

/**
 * POST /api/evaluate
 * Evaluates a candidate based on resume, transcript, and job description
 */
async function evaluateCandidate(req, res) {
  try {
    const { resume, transcript, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({
        error: "Missing required fields: resume and jobDescription are required"
      });
    }

    // Run agents in parallel for efficiency
    const [resumeResult, technicalResult, behavioralResult] = await Promise.all([
      new ResumeAgent(resume, transcript || "", jobDescription).evaluate(llmWrapper),
      new TechnicalAgent(resume, transcript || "", jobDescription).evaluate(llmWrapper),
      new BehavioralAgent(resume, transcript || "", jobDescription).evaluate(llmWrapper)
    ]);

    // Use ClaimAgent to verify claims
    const claimAgent = new ClaimAgent(resume, transcript || "", jobDescription);
    const claimResult = await claimAgent.evaluate(llmWrapper);

    // Use ConsensusAgent to make final decision
    const consensusAgent = new ConsensusAgent(
      resume,
      transcript || "",
      jobDescription
    );
    const finalResult = await consensusAgent.evaluate(llmWrapper, [
      resumeResult,
      technicalResult,
      behavioralResult,
      claimResult
    ]);

    res.json({
      success: true,
      results: {
        resume: resumeResult,
        technical: technicalResult,
        behavioral: behavioralResult,
        claims: claimResult,
        consensus: finalResult
      }
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({
      error: "Evaluation failed",
      message: error.message
    });
  }
}

module.exports = evaluateCandidate;
