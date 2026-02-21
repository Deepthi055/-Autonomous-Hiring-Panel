/**
 * scoringUtils.js
 *
 * Utility functions for skill matching, gap detection, contradiction
 * finding, and score normalization used across all DataVex evaluation agents.
 */

/**
 * Normalizes a raw score to the 0–10 range.
 * Clamps values outside the range and rounds to one decimal place.
 *
 * @param {number} score - Raw score value
 * @param {number} [min=0] - Minimum of the input scale
 * @param {number} [max=10] - Maximum of the input scale
 * @returns {number} Normalized score between 0 and 10
 */
function normalizeScore(score, min = 0, max = 10) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }
  const normalized = ((score - min) / (max - min)) * 10;
  const clamped = Math.max(0, Math.min(10, normalized));
  return Math.round(clamped * 10) / 10;
}

/**
 * Calculates a weighted average score from multiple agent evaluations.
 *
 * @param {Object} scores  - Map of agentName → numeric score
 * @param {Object} weights - Map of agentName → weight (0–1, should sum to 1)
 * @returns {number} Weighted average score (0–10)
 */
function calculateWeightedScore(scores, weights) {
  if (!scores || !weights) {
    return 0;
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const [agent, weight] of Object.entries(weights)) {
    const score = scores[agent];
    if (typeof score === "number" && !Number.isNaN(score)) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;

  // Normalize in case weights don't sum to 1
  const result = weightedSum / totalWeight;
  return Math.round(result * 10) / 10;
}

/**
 * Computes the percentage of required skills present in the candidate's
 * skill set. AI, Cloud, and DevOps skills receive a 1.5× weight as
 * specified by DataVex evaluation criteria.
 *
 * @param {string[]} candidateSkills - Skills extracted from the resume
 * @param {string[]} requiredSkills  - Skills required by the job description
 * @param {string[]} [prioritySkills=[]] - High-priority skill keywords (weighted 1.5×)
 * @returns {{ alignmentPercent: number, matched: string[], missing: string[] }}
 */
function calculateSkillMatch(candidateSkills, requiredSkills, prioritySkills = []) {
  if (!Array.isArray(candidateSkills) || !Array.isArray(requiredSkills)) {
    return { alignmentPercent: 0, matched: [], missing: [] };
  }

  if (requiredSkills.length === 0) {
    return { alignmentPercent: 100, matched: [], missing: [] };
  }

  // Normalize for case-insensitive comparison
  const normalize = (s) => s.toLowerCase().trim();
  const candidateSet = new Set(candidateSkills.map(normalize));
  const prioritySet = new Set(prioritySkills.map(normalize));

  const matched = [];
  const missing = [];
  let weightedMatched = 0;
  let weightedTotal = 0;

  for (const skill of requiredSkills) {
    const normalizedSkill = normalize(skill);
    const weight = prioritySet.has(normalizedSkill) ? 1.5 : 1.0;
    weightedTotal += weight;

    if (candidateSet.has(normalizedSkill)) {
      matched.push(skill);
      weightedMatched += weight;
    } else {
      missing.push(skill);
    }
  }

  const alignmentPercent = Math.round((weightedMatched / weightedTotal) * 100);

  return { alignmentPercent, matched, missing };
}

/**
 * Identifies gaps between what a job description requires and what the
 * candidate provides across multiple competency dimensions.
 *
 * @param {Object} candidateProfile - Categorized candidate skills/experience
 * @param {Object} jobRequirements  - Categorized job requirements
 * @returns {{ category: string, missing: string[] }[]} Array of gap objects
 */
function detectGaps(candidateProfile, jobRequirements) {
  if (!candidateProfile || !jobRequirements) {
    return [];
  }

  const gaps = [];
  const normalize = (s) => s.toLowerCase().trim();

  for (const [category, required] of Object.entries(jobRequirements)) {
    if (!Array.isArray(required)) continue;

    const candidateSkills = Array.isArray(candidateProfile[category])
      ? new Set(candidateProfile[category].map(normalize))
      : new Set();

    const missing = required.filter(
      (skill) => !candidateSkills.has(normalize(skill))
    );

    if (missing.length > 0) {
      gaps.push({ category, missing });
    }
  }

  return gaps;
}

/**
 * Compares two sets of statements (e.g., resume claims vs transcript
 * statements) and surfaces potential contradictions based on keyword
 * overlap heuristics.
 *
 * @param {string[]} sourceA - First set of statements (e.g., resume claims)
 * @param {string[]} sourceB - Second set of statements (e.g., transcript excerpts)
 * @returns {{ statementA: string, statementB: string, conflictingKeywords: string[] }[]}
 */
function findContradictions(sourceA, sourceB) {
  if (!Array.isArray(sourceA) || !Array.isArray(sourceB)) {
    return [];
  }

  // Keywords that often indicate quantifiable or verifiable claims
  const claimIndicators = [
    "led", "managed", "built", "designed", "implemented",
    "reduced", "increased", "saved", "grew", "launched",
    "team of", "revenue", "users", "million", "billion",
    "percent", "%", "years", "months",
  ];

  const contradictions = [];
  const normalize = (s) => s.toLowerCase().trim();

  for (const stmtA of sourceA) {
    const normA = normalize(stmtA);
    const aKeywords = claimIndicators.filter((kw) => normA.includes(kw));

    if (aKeywords.length === 0) continue;

    for (const stmtB of sourceB) {
      const normB = normalize(stmtB);
      const sharedKeywords = aKeywords.filter((kw) => normB.includes(kw));

      // If statements share claim keywords but differ in context,
      // flag as a potential contradiction for LLM deeper analysis
      if (sharedKeywords.length > 0) {
        const aNumbers = normA.match(/\d+/g) || [];
        const bNumbers = normB.match(/\d+/g) || [];

        // Flag when both mention numbers but they don't match
        const hasNumberMismatch =
          aNumbers.length > 0 &&
          bNumbers.length > 0 &&
          JSON.stringify(aNumbers) !== JSON.stringify(bNumbers);

        if (hasNumberMismatch) {
          contradictions.push({
            statementA: stmtA,
            statementB: stmtB,
            conflictingKeywords: sharedKeywords,
          });
        }
      }
    }
  }

  return contradictions;
}

/**
 * Derives a recommendation label from a numeric score.
 *
 * @param {number} score - Evaluation score (0–10)
 * @returns {string} Recommendation string
 */
function scoreToRecommendation(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return "No Hire";
  }
  if (score >= 8.0) return "Strong Hire";
  if (score >= 6.5) return "Hire";
  if (score >= 4.0) return "No Hire";
  return "Strong No Hire";
}

/**
 * Merges arrays from multiple agent results, deduplicating by exact match.
 *
 * @param {Array<Object>} agentResults - Array of agent evaluation objects
 * @param {string} field              - Field name to merge (e.g., "strengths")
 * @returns {string[]} Deduplicated merged array
 */
function mergeAgentField(agentResults, field) {
  if (!Array.isArray(agentResults)) return [];

  const seen = new Set();
  const merged = [];

  for (const result of agentResults) {
    const items = result[field];
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const key = typeof item === "string" ? item.toLowerCase().trim() : JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
  }

  return merged;
}

/**
 * Finds items mentioned by two or more agents in a given field,
 * using fuzzy substring matching to catch semantically similar entries.
 *
 * @param {Array<Object>} agentResults - Array of agent evaluation objects
 * @param {string} field              - Field name to analyze
 * @param {number} [minCount=2]       - Minimum number of agents required
 * @returns {string[]} Consensus items
 */
function findConsensusItems(agentResults, field, minCount = 2) {
  if (!Array.isArray(agentResults)) return [];

  // Collect all items with their agent source
  const allItems = [];
  for (const result of agentResults) {
    const items = result[field];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      allItems.push({ text: item, agent: result.agentName });
    }
  }

  // Group by similarity (simple substring overlap)
  const consensus = [];
  const used = new Set();

  for (let i = 0; i < allItems.length; i++) {
    if (used.has(i)) continue;

    const agents = new Set([allItems[i].agent]);
    const normI = allItems[i].text.toLowerCase();

    for (let j = i + 1; j < allItems.length; j++) {
      if (used.has(j)) continue;
      if (agents.has(allItems[j].agent)) continue;

      const normJ = allItems[j].text.toLowerCase();

      // Check for significant word overlap (>= 3 shared words)
      const wordsI = new Set(normI.split(/\s+/).filter((w) => w.length > 3));
      const wordsJ = new Set(normJ.split(/\s+/).filter((w) => w.length > 3));
      let overlap = 0;
      for (const w of wordsI) {
        if (wordsJ.has(w)) overlap++;
      }

      if (overlap >= 3 || normI.includes(normJ) || normJ.includes(normI)) {
        agents.add(allItems[j].agent);
        used.add(j);
      }
    }

    if (agents.size >= minCount) {
      consensus.push(allItems[i].text);
      used.add(i);
    }
  }

  return consensus;
}

module.exports = {
  normalizeScore,
  calculateWeightedScore,
  calculateSkillMatch,
  detectGaps,
  findContradictions,
  scoreToRecommendation,
  mergeAgentField,
  findConsensusItems,
};
