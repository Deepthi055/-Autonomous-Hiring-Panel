<<<<<<< HEAD
/**
 * behavioralAgent.js
 *
 * Evaluates a candidate's behavioral competencies from their interview
 * transcript. Assesses leadership, ownership, enterprise impact, STAR
 * structure adherence, and cultural fit for DataVex's AI-driven org.
 */

const { behavioralEvaluationPrompt } = require("./promptTemplates");
const { normalizeScore, scoreToRecommendation } = require("./scoringUtils");

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "BehavioralAgent",
  score: 0,
  strengths: [],
  concerns: ["Evaluation could not be completed"],
  gaps: [],
  contradictions: [],
  reasoning: "The behavioral evaluation failed due to an error.",
  recommendation: "No Hire",
};

class BehavioralAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    if (!resume || typeof resume !== "string") {
      throw new Error("BehavioralAgent requires a non-empty resume string.");
    }
    if (!transcript || typeof transcript !== "string") {
      throw new Error("BehavioralAgent requires a non-empty transcript string.");
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("BehavioralAgent requires a non-empty jobDescription string.");
    }

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "BehavioralAgent";
  }

  /**
   * Builds the LLM prompt for behavioral evaluation.
   *
   * @returns {string} Structured prompt string
   */
  buildPrompt() {
    return behavioralEvaluationPrompt(this.resume, this.transcript, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response into a structured result.
   *
   * @param {string} rawResponse - Raw JSON string from the LLM
   * @returns {Object} Validated evaluation result
   */
  parseResponse(rawResponse) {
    if (!rawResponse || typeof rawResponse !== "string") {
      throw new Error("BehavioralAgent received an empty or non-string response.");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`BehavioralAgent failed to parse LLM response as JSON: ${err.message}`);
      }
    }

    return {
      agentName: this.agentName,
      score: normalizeScore(parsed.score),
      leadershipScore: normalizeScore(parsed.leadershipScore),
      starCompleteness: typeof parsed.starCompleteness === "number"
        ? Math.max(0, Math.min(100, parsed.starCompleteness))
        : 0,
      culturalFitScore: normalizeScore(parsed.culturalFitScore),
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
        throw new Error("BehavioralAgent.evaluate() requires an llmClient with a complete() method.");
      }

      const prompt = this.buildPrompt();
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse);
    } catch (error) {
      console.error(`[BehavioralAgent] Evaluation failed: ${error.message}`);
      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The behavioral evaluation encountered an error: ${error.message}`,
      };
    }
  }
=======
class BehavioralAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "BehavioralAgent";
  }

  async evaluate() {
    // Mock: evaluate presence of soft-skill phrases in transcript
    const phrases = ["team", "lead", "collaborate", "communication", "mentor"];
    let count = 0;
    const text = (this.transcript + " " + this.resume).toLowerCase();
    for (const p of phrases) if (text.includes(p)) count++;
    const score = Math.min(1, 0.2 + (count / phrases.length));
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: `Behavioral indicators found: ${count}`,
      details: { indicators: count }
    };
  }
>>>>>>> 27e90ec002d5cbbb10de0a1837acbb5a7e6ac798
}

module.exports = BehavioralAgent;
