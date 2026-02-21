/**
 * skepticAgent.js
 *
 * The strictest evaluator in the DataVex panel. Actively seeks
 * contradictions, overconfidence, buzzword abuse, and depth deficiencies.
 * Score reductions are applied for every verified inconsistency.
 */

const { skepticEvaluationPrompt } = require("./promptTemplates");
const { normalizeScore, scoreToRecommendation } = require("./scoringUtils");

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "SkepticAgent",
  score: 0,
  strengths: [],
  concerns: ["Evaluation could not be completed"],
  gaps: [],
  contradictions: [],
  reasoning: "The skeptic evaluation failed due to an error.",
  recommendation: "No Hire",
};

class SkepticAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    if (!resume || typeof resume !== "string") {
      throw new Error("SkepticAgent requires a non-empty resume string.");
    }
    if (!transcript || typeof transcript !== "string") {
      throw new Error("SkepticAgent requires a non-empty transcript string.");
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("SkepticAgent requires a non-empty jobDescription string.");
    }

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "SkepticAgent";
  }

  /**
   * Builds the LLM prompt for skeptic evaluation.
   *
   * @returns {string} Structured prompt string
   */
  buildPrompt() {
    return skepticEvaluationPrompt(this.resume, this.transcript, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response into a structured result.
   *
   * @param {string} rawResponse - Raw JSON string from the LLM
   * @returns {Object} Validated evaluation result
   */
  parseResponse(rawResponse) {
    if (!rawResponse || typeof rawResponse !== "string") {
      throw new Error("SkepticAgent received an empty or non-string response.");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`SkepticAgent failed to parse LLM response as JSON: ${err.message}`);
      }
    }

    return {
      agentName: this.agentName,
      score: normalizeScore(parsed.score),
      contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
      overconfidenceFlags: Array.isArray(parsed.overconfidenceFlags)
        ? parsed.overconfidenceFlags
        : [],
      buzzwordInstances: Array.isArray(parsed.buzzwordInstances)
        ? parsed.buzzwordInstances
        : [],
      depthDeficiencies: Array.isArray(parsed.depthDeficiencies)
        ? parsed.depthDeficiencies
        : [],
      hiringRisk: ["low", "medium", "high", "critical"].includes(parsed.hiringRisk)
        ? parsed.hiringRisk
        : "medium",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      reasoning: parsed.reasoning || "",
      recommendation: parsed.recommendation || scoreToRecommendation(parsed.score),
    };
  }

  /**
   * Runs the full evaluation pipeline.
   *
   * @param {Object} llmClient - LLM client with an async `complete(prompt)` method
   * @returns {Promise<Object>} Structured evaluation result
   */
  async evaluate(llmClient) {
    try {
      if (!llmClient || typeof llmClient.complete !== "function") {
        throw new Error("SkepticAgent.evaluate() requires an llmClient with a complete() method.");
      }

      const prompt = this.buildPrompt();
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse);
    } catch (error) {
      console.error(`[SkepticAgent] Evaluation failed: ${error.message}`);
      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The skeptic evaluation encountered an error: ${error.message}`,
      };
    }
  }
}

module.exports = SkepticAgent;
