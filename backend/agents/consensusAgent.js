/**
 * consensusAgent.js
 *
 * Programmatic consensus aggregator.
 * Calculates final score based on numeric average of available agent scores.
 * No LLM calls for scoring to ensure determinism and reliability.
 */

class ConsensusAgent {
  constructor() {
    this.agentName = "ConsensusAgent";
  }

  /**
   * Evaluates the candidate based on aggregated agent results.
   *
   * @param {Array<Object>} agentResults - Individual agent evaluation results
   * @returns {Object} Structured consensus result matching frontend expectations
   */
  evaluate(agentResults) {
    try {
      // 1. Extract valid scores
      const scores = [];
      const agentScores = {
        resume: 0,
        technical: 0,
        behavioral: 0,
        claims: 0
      };

      // Map for easier access
      const resultMap = {};
      if (Array.isArray(agentResults)) {
        agentResults.forEach(r => {
          if (r && r.agentName) {
            resultMap[r.agentName] = r;
          }
        });
      }

      // Helper to get score safely
      const getScore = (agentName) => {
        const res = resultMap[agentName];
        if (res && typeof res.score === 'number' && !isNaN(res.score)) {
          return res.score;
        }
        return null;
      };

      // Extract specific agent scores
      const resumeScore = getScore('ResumeAgent');
      const technicalScore = getScore('TechnicalAgent');
      const behavioralScore = getScore('BehavioralAgent');
      const claimScore = getScore('ClaimAgent');
      const skepticScore = getScore('SkepticAgent');

      // Populate response structure and valid scores list
      if (resumeScore !== null) {
        scores.push(resumeScore);
        agentScores.resume = this.scaleScore(resumeScore);
      }
      if (technicalScore !== null) {
        scores.push(technicalScore);
        agentScores.technical = this.scaleScore(technicalScore);
      }
      if (behavioralScore !== null) {
        scores.push(behavioralScore);
        agentScores.behavioral = this.scaleScore(behavioralScore);
      }
      if (claimScore !== null) {
        scores.push(claimScore);
        agentScores.claims = this.scaleScore(claimScore);
      }
      if (skepticScore !== null) {
        scores.push(skepticScore);
      }

      // 2. Calculate Final Score (Numeric Average)
      let finalScore = 0;
      if (scores.length > 0) {
        const sum = scores.reduce((a, b) => a + b, 0);
        const avg = sum / scores.length;
        finalScore = this.scaleScore(avg);
      }

      // 3. Recommendation Logic
      let recommendation = "No Hire";
      if (finalScore >= 65) {
        recommendation = "Hire";
      } else if (finalScore >= 50) {
        recommendation = "Consider";
      }

      // 4. Confidence Level
      // Based on number of successful agents vs expected (5)
      const expectedAgents = 5;
      const validCount = scores.length;
      const confidenceLevel = Math.round((validCount / expectedAgents) * 100);

      return {
        agentName: this.agentName,
        finalScore,
        score: finalScore,
        recommendation,
        confidenceLevel,
        reasoning: `Consensus score: ${finalScore}/10 based on ${validCount} agents.`,
        strengths: [],
        concerns: []
      };

    } catch (error) {
      console.error("Consensus calculation error:", error);
      return {
        finalScore: 0,
        recommendation: "No Hire",
        confidenceLevel: 0,
        overallRating: 0,
        agentScores: { resume: 0, technical: 0, behavioral: 0, claims: 0 }
      };
    }
  }

  /**
   * Scales score to 0-100 range if it appears to be 0-10.
   */
  scaleScore(score) {
    if (score <= 10 && score > 0) {
      return Math.round(score * 10);
    }
    return Math.round(score);
  }
}

module.exports = ConsensusAgent;