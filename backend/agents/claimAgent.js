/**
 * claimAgent.js
 *
 * Cross-references resume claims against interview transcript statements
 * to detect inflated claims, unsupported achievements, and contradictions.
 * Provides a credibility assessment for the DataVex evaluation pipeline.
 */

const { claimVerificationPrompt } = require("./promptTemplates");
const { normalizeScore, scoreToRecommendation } = require("./scoringUtils");

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "ClaimAgent",
  score: 50,
  strengths: [],
  concerns: ["Claim analysis unavailable due to parsing error"],
  gaps: [],
  contradictions: [],
  reasoning: "The claim verification failed due to an error.",
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
 * Safely parses JSON from LLM response, handling markdown and common formatting errors.
 */
function safeParseJSON(str) {
  if (!str || typeof str !== 'string') return {};

  // 1. Remove markdown code blocks
  let cleaned = str.replace(/```json/g, '').replace(/```/g, '');

  // 2. Extract the first valid JSON object using regex
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    cleaned = match[0];
  }

  // 3. Try to parse
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 4. Return empty object if parsing fails completely
    return {};
  }
}

class ClaimAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    // Constructor inputs are validated in evaluate() to prevent crashes during initialization
    // if data is missing upstream.

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "ClaimAgent";
  }

  /**
   * Builds the LLM prompt for claim verification.
   *
   * @returns {string} Structured prompt string
   */
  buildPrompt() {
    return claimVerificationPrompt(this.resume, this.transcript, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response into a structured result.
   *
   * @param {string} rawResponse - Raw JSON string from the LLM
   * @returns {Object} Validated evaluation result
   */
  parseResponse(rawResponse) {
    const parsed = safeParseJSON(rawResponse);
    
    // Ensure score is numeric, default to 5 (50%) if missing
    const score = safeNumber(parsed.score, 5);

    return {
      agentName: this.agentName,
      score: normalizeScore(score),
      credibilityScore: normalizeScore(safeNumber(parsed.credibilityScore, score)),
      inflatedClaims: Array.isArray(parsed.inflatedClaims) ? parsed.inflatedClaims : [],
      unsupportedAchievements: Array.isArray(parsed.unsupportedAchievements)
        ? parsed.unsupportedAchievements
        : [],
      verifiedClaims: Array.isArray(parsed.verifiedClaims) ? parsed.verifiedClaims : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : (parsed.concerns ? [String(parsed.concerns)] : []),
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
      reasoning: parsed.reasoning || "Analysis completed.",
      recommendation: parsed.recommendation || scoreToRecommendation(score),
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
      if (!this.resume || !this.transcript || !this.jobDescription) {
        return { ...FALLBACK_RESULT, concerns: ["Missing input data for ClaimAgent"] };
      }

      if (!llmClient || typeof llmClient.complete !== "function") {
        return { ...FALLBACK_RESULT, concerns: ["LLM Client not provided"] };
      }

      const prompt = this.buildPrompt();
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse);
    } catch (error) {
      console.error(`[ClaimAgent] Evaluation failed: ${error.message}`);
      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The claim verification encountered an error: ${error.message}`,
      };
    }
  }
}

module.exports = ClaimAgent;