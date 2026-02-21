<<<<<<< HEAD
/**
 * resumeAgent.js
 *
 * Evaluates a candidate's resume against the target job description.
 * Extracts skills, computes alignment, identifies missing competencies,
 * and produces a structured hiring recommendation for DataVex.
 */

const { resumeEvaluationPrompt } = require("./promptTemplates");
const { normalizeScore, scoreToRecommendation } = require("./scoringUtils");

/** Default result returned when evaluation cannot be completed. */
const FALLBACK_RESULT = {
  agentName: "ResumeAgent",
  score: 0,
  strengths: [],
  concerns: ["Evaluation could not be completed"],
  gaps: [],
  contradictions: [],
  reasoning: "The resume evaluation failed due to an error.",
  recommendation: "No Hire",
};

class ResumeAgent {
  /**
   * @param {string} resume         - Candidate resume text
   * @param {string} transcript     - Interview transcript (unused by this agent but kept for interface consistency)
   * @param {string} jobDescription - Target job description
   */
  constructor(resume, transcript, jobDescription) {
    if (!resume || typeof resume !== "string") {
      throw new Error("ResumeAgent requires a non-empty resume string.");
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      throw new Error("ResumeAgent requires a non-empty jobDescription string.");
    }

    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.agentName = "ResumeAgent";
  }

  /**
   * Builds the LLM prompt for resume evaluation.
   *
   * @returns {string} Structured prompt string
   */
  buildPrompt() {
    return resumeEvaluationPrompt(this.resume, this.jobDescription);
  }

  /**
   * Parses and validates the raw LLM response into a structured result.
   *
   * @param {string} rawResponse - Raw JSON string from the LLM
   * @returns {Object} Validated evaluation result
   */
  parseResponse(rawResponse) {
    if (!rawResponse || typeof rawResponse !== "string") {
      throw new Error("ResumeAgent received an empty or non-string response.");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      // Attempt to extract JSON from a response that may include markdown fences
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`ResumeAgent failed to parse LLM response as JSON: ${err.message}`);
      }
    }

    return {
      agentName: this.agentName,
      score: normalizeScore(parsed.score),
      extractedSkills: parsed.extractedSkills || {},
      skillAlignmentPercent: typeof parsed.skillAlignmentPercent === "number"
        ? parsed.skillAlignmentPercent
        : 0,
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
   * Generates the prompt, sends it to the LLM, and returns a structured result.
   *
   * NOTE: The caller must supply an `llmClient` with an async `complete(prompt)` method,
   * or override this method to integrate with the project's LLM orchestration layer.
   *
   * @param {Object} llmClient - LLM client with an async `complete(prompt)` method
   * @returns {Promise<Object>} Structured evaluation result
   */
  async evaluate(llmClient) {
    try {
      if (!llmClient || typeof llmClient.complete !== "function") {
        throw new Error("ResumeAgent.evaluate() requires an llmClient with a complete() method.");
      }

      const prompt = this.buildPrompt();
      const rawResponse = await llmClient.complete(prompt);
      return this.parseResponse(rawResponse);
    } catch (error) {
      console.error(`[ResumeAgent] Evaluation failed: ${error.message}`);
      return {
        ...FALLBACK_RESULT,
        concerns: [`Evaluation failed: ${error.message}`],
        reasoning: `The resume evaluation encountered an error: ${error.message}`,
      };
    }
=======
class ResumeAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "ResumeAgent";
  }

  async evaluate() {
    // Lightweight mock logic: check resume length and keywords
    const score = Math.min(1, Math.max(0, (this.resume.length / 1000)));
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: "Parsed resume and extracted key skills/experience.",
      details: {
        resumeLength: this.resume.length
      }
    };
>>>>>>> 27e90ec002d5cbbb10de0a1837acbb5a7e6ac798
  }
}

module.exports = ResumeAgent;
