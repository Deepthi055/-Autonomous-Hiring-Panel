const { callOpenAI } = require('./openaiClient');

async function evaluate(inputData) {
  const { resume, transcript } = inputData;

  if (!resume || !transcript) {
    throw new Error('Missing required fields: resume and transcript');
  }

  const systemPrompt = `You are a fact-checking specialist at DataVex.ai verifying claims made in resumes against interview transcripts.

Your evaluation criteria:
1. Consistency between resume claims and transcript explanations
2. Ability to substantiate resume claims with concrete examples
3. Inflated vs realistic skill representation
4. Unproven claims or vague references
5. Contradictions between what they claim and what they demonstrate

Penalize:
- Inflated skill claims not backed by transcript examples
- Vague claims without supporting evidence
- Direct contradictions between resume and transcript
- Inability to explain or substantiate claimed expertise
- Overstatement of role or impact

Return ONLY a valid JSON object with this exact structure:
{
  "strengths": ["strength1", "strength2", ...],
  "concerns": ["concern1", "concern2", ...],
  "contradictions": ["contradiction1", "contradiction2", ...],
  "score": <number 0-10>,
  "recommendation": "Hire" | "No Hire"
}`;

  const userPrompt = `Cross-verify resume claims against what the candidate said in the interview.

RESUME:
${resume}

INTERVIEW TRANSCRIPT:
${transcript}

Identify consistencies, contradictions, inflated claims, and unsubstantiated assertions. Flag skill claims that aren't backed by concrete examples or explanations in the transcript.`;

  const rawResponse = await callOpenAI(systemPrompt, userPrompt);

  const score = validateScore(rawResponse.score);
  const recommendation = validateRecommendation(rawResponse.recommendation);

  return {
    agentName: 'claimAgent',
    score,
    strengths: rawResponse.strengths || [],
    concerns: rawResponse.concerns || [],
    contradictions: rawResponse.contradictions || [],
    recommendation,
  };
}

function validateScore(score) {
  const numScore = parseFloat(score);
  if (isNaN(numScore) || numScore < 0 || numScore > 10) {
    throw new Error(`Invalid score: ${score}. Must be between 0 and 10.`);
  }
  return Math.round(numScore * 10) / 10;
}

function validateRecommendation(rec) {
  if (rec === 'Hire' || rec === 'No Hire') {
    return rec;
  }
  throw new Error(`Invalid recommendation: ${rec}. Must be "Hire" or "No Hire".`);
}

module.exports = { evaluate };
