/**
 * consensusAgent.js
 *
 * Final decision-maker in the DataVex evaluation pipeline. Aggregates
 * results from all five specialist agents using weighted scoring, resolves
 * conflicts, and produces the definitive hiring recommendation.
 *
 * Weight distribution:
 *   Technical  — 30%
 *   Resume     — 25%
 *   Behavioral — 20%
 *   Claim      — 15%
 *   Skeptic    — 10%
 */

const { consensusPrompt } = require("./promptTemplates");
const {
  normalizeScore,
  calculateWeightedScore,
  scoreToRecommendation,
  mergeAgentField,
  findConsensusItems,
} = require("./scoringUtils");

/** Canonical weight map used for weighted scoring. */
const AGENT_WEIGHTS = {
  TechnicalAgent: 0.30,
  ResumeAgent: 0.25,
  BehavioralAgent: 0.20,
  ClaimAgent: 0.15,
  SkepticAgent: 0.10,
};

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "ConsensusAgent",
  finalScore: 0,
  individualScores: {},
  weights: AGENT_WEIGHTS,
  consensusStrengths: [],
  consensusConcerns: [],
  conflictResolutions: [],
  strengths: [],
  concerns: ["Consensus evaluation could not be completed"],
  gaps: [],
  contradictions: [],
  reasoning: "The consensus evaluation failed due to an error.",
  recommendation: "No Hire",
  finalRecommendation: "No Hire",
  confidenceLevel: "low",
};

class ConsensusAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("ConsensusAgent requires a non-empty jobDescription string.");
    }

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "ConsensusAgent";
    this.weights = { ...AGENT_WEIGHTS };
  }

  /**
   * Computes the deterministic weighted score from individual agent results.
   * This runs locally — no LLM call required — so it serves as the ground
   * truth for the final score even if the LLM produces a different value.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {number} Weighted score (0–10)
   */
  computeWeightedScore(agentResults) {
    const scores = {};
    for (const result of agentResults) {
      if (result && result.agentName && typeof result.score === "number") {
        scores[result.agentName] = result.score;
      }
    }
    return calculateWeightedScore(scores, this.weights);
  }

  /**
   * Builds the map of individual agent scores keyed by role name.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {Object} Score map
   */
  buildScoreMap(agentResults) {
    const map = {};
    for (const result of agentResults) {
      if (result && result.agentName) {
        // Convert PascalCase agent name to camelCase key
        const key = result.agentName.charAt(0).toLowerCase() + result.agentName.slice(1);
        map[key] = typeof result.score === "number" ? result.score : 0;
      }
    }
    return map;
  }

  /**
   * Determines the confidence level based on score variance across agents.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {string} "high" | "medium" | "low"
   */
  assessConfidence(agentResults) {
    const scores = agentResults
      .filter((r) => r && typeof r.score === "number")
      .map((r) => r.score);

    if (scores.length < 2) return "low";

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev <= 1.0) return "high";
    if (stdDev <= 2.0) return "medium";
    return "low";
  }

  /**
   * Produces a purely algorithmic consensus result without an LLM call.
   * Useful as a fallback or for deterministic evaluation.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {Object} Consensus evaluation result
   */
  computeLocalConsensus(agentResults) {
    const finalScore = this.computeWeightedScore(agentResults);
    const individualScores = this.buildScoreMap(agentResults);
    const confidenceLevel = this.assessConfidence(agentResults);

    return {
      agentName: this.agentName,
      finalScore,
      score: finalScore,
      individualScores,
      weights: this.weights,
      consensusStrengths: findConsensusItems(agentResults, "strengths"),
      consensusConcerns: findConsensusItems(agentResults, "concerns"),
      conflictResolutions: [],
      strengths: mergeAgentField(agentResults, "strengths"),
      concerns: mergeAgentField(agentResults, "concerns"),
      gaps: mergeAgentField(agentResults, "gaps"),
      contradictions: mergeAgentField(agentResults, "contradictions"),
      reasoning: `Weighted score: ${finalScore}/10. Confidence: ${confidenceLevel}. Based on ${agentResults.length} agent evaluations.`,
      recommendation: scoreToRecommendation(finalScore),
      finalRecommendation: scoreToRecommendation(finalScore),
      confidenceLevel,
    };
  }

  /**
   * Builds the LLM prompt for consensus evaluation.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {string} Structured prompt string
   */
  buildPrompt(agentResults) {
    return consensusPrompt(agentResults, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response, anchoring the final score
   * to the deterministic weighted calculation.
   *
   * @param {string} rawResponse   - Raw JSON string from the LLM
   * @param {Array<Object>} agentResults - Original agent results for validation
   * @returns {Object} Validated consensus evaluation result
   */
  parseResponse(rawResponse, agentResults) {
    if (!rawResponse || typeof rawResponse !== "string") {
      throw new Error("ConsensusAgent received an empty or non-string response.");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`ConsensusAgent failed to parse LLM response as JSON: ${err.message}`);
      }
    }

    // Use deterministic weighted score as the authoritative final score
    const computedScore = this.computeWeightedScore(agentResults);
    const confidenceLevel = this.assessConfidence(agentResults);

    return {
      agentName: this.agentName,
      finalScore: computedScore,
      score: computedScore,
      individualScores: parsed.individualScores || this.buildScoreMap(agentResults),
      weights: this.weights,
      consensusStrengths: Array.isArray(parsed.consensusStrengths)
        ? parsed.consensusStrengths
        : findConsensusItems(agentResults, "strengths"),
      consensusConcerns: Array.isArray(parsed.consensusConcerns)
        ? parsed.consensusConcerns
        : findConsensusItems(agentResults, "concerns"),
      conflictResolutions: Array.isArray(parsed.conflictResolutions)
        ? parsed.conflictResolutions
        : [],
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : mergeAgentField(agentResults, "strengths"),
      concerns: Array.isArray(parsed.concerns)
        ? parsed.concerns
        : mergeAgentField(agentResults, "concerns"),
      gaps: Array.isArray(parsed.gaps)
        ? parsed.gaps
        : mergeAgentField(agentResults, "gaps"),
      contradictions: Array.isArray(parsed.contradictions)
        ? parsed.contradictions
        : mergeAgentField(agentResults, "contradictions"),
      reasoning: parsed.reasoning || "",
      recommendation: scoreToRecommendation(computedScore),
      finalRecommendation: scoreToRecommendation(computedScore),
      confidenceLevel: parsed.confidenceLevel || confidenceLevel,
    };
  }

  /**
   * Runs the full consensus evaluation pipeline.
   *
   * Accepts an array of agent results and optionally an LLM client.
   * If an LLM client is provided, it enhances the consensus with
   * natural-language conflict resolution. Otherwise, it falls back
   * to the purely algorithmic local consensus.
   *
   * @param {Object}        [llmClient]    - Optional LLM client with async complete()
   * @param {Array<Object>} agentResults   - Individual agent evaluation results
   * @returns {Promise<Object>} Consensus evaluation result
   */
  async evaluate(llmClient, agentResults) {
    try {
      if (!Array.isArray(agentResults) || agentResults.length === 0) {
        throw new Error("ConsensusAgent.evaluate() requires a non-empty agentResults array.");
      }

      // If no LLM client, return deterministic consensus
      if (!llmClient || typeof llmClient.complete !== "function") {
        return this.computeLocalConsensus(agentResults);
      }

      const prompt = this.buildPrompt(agentResults);
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse, agentResults);
    } catch (error) {
      console.error(`[ConsensusAgent] Evaluation failed: ${error.message}`);

      // Attempt local consensus as fallback
      if (Array.isArray(agentResults) && agentResults.length > 0) {
        const localResult = this.computeLocalConsensus(agentResults);
        localResult.concerns.push(`LLM consensus failed, using algorithmic fallback: ${error.message}`);
        return localResult;
      }

      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The consensus evaluation encountered an error: ${error.message}`,
      };
    }
  }
}

module.exports = ConsensusAgent;
