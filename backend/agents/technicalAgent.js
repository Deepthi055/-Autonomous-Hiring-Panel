/**
 * technicalAgent.js
 *
 * Evaluates a candidate's technical depth from their interview transcript.
 * Assesses system design understanding, AI & cloud expertise, and penalizes
 * vague or buzzword-heavy answers. Weighted heavily in the DataVex pipeline.
 */

const { technicalEvaluationPrompt } = require("./promptTemplates");
const { normalizeScore, scoreToRecommendation } = require("./scoringUtils");

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "TechnicalAgent",
  score: 0,
  strengths: [],
  concerns: ["Evaluation could not be completed"],
  gaps: [],
  contradictions: [],
  reasoning: "The technical evaluation failed due to an error.",
  recommendation: "No Hire",
};

/**
 * Safely converts a value to a number.
 */
function safeNumber(val, defaultVal = 0) {
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
}

/**
 * Safely parses JSON from LLM response.
 */
function safeParseJSON(str) {
  if (!str || typeof str !== 'string') return {};
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '');
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {};
  }
}

class TechnicalAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    if (!resume || typeof resume !== "string") {
      throw new Error("TechnicalAgent requires a non-empty resume string.");
    }
    if (!transcript || typeof transcript !== "string") {
      throw new Error("TechnicalAgent requires a non-empty transcript string.");
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("TechnicalAgent requires a non-empty jobDescription string.");
    }

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "TechnicalAgent";
  }

  /**
   * Builds the LLM prompt for technical evaluation.
   *
   * @returns {string} Structured prompt string
   */
  buildPrompt() {
    return technicalEvaluationPrompt(this.resume, this.transcript, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response into a structured result.
   *
   * @param {string} rawResponse - Raw JSON string from the LLM
   * @returns {Object} Validated evaluation result
   */
  parseResponse(rawResponse) {
    const parsed = safeParseJSON(rawResponse);

    return {
      agentName: this.agentName,
      score: normalizeScore(safeNumber(parsed.score)),
      technicalDepth: parsed.technicalDepth || "surface",
      systemDesignScore: normalizeScore(safeNumber(parsed.systemDesignScore)),
      aiCloudExpertise: normalizeScore(safeNumber(parsed.aiCloudExpertise)),
      vagueAnswers: Array.isArray(parsed.vagueAnswers) ? parsed.vagueAnswers : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
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
        throw new Error("TechnicalAgent.evaluate() requires an llmClient with a complete() method.");
      }

      const prompt = this.buildPrompt();
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse);
    } catch (error) {
      console.error(`[TechnicalAgent] Evaluation failed: ${error.message}`);
      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The technical evaluation encountered an error: ${error.message}`,
      };
    }
  }
}

module.exports = TechnicalAgent;