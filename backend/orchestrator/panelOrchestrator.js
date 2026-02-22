const ResumeAgent = require("../agents/resumeAgent");
const TechnicalAgent = require("../agents/technicalAgent");
const BehavioralAgent = require("../agents/behavioralAgent");
const ClaimAgent = require("../agents/claimAgent");
const SkepticAgent = require("../agents/skepticAgent");
const ConsensusAgent = require("../agents/consensusAgent");
const llmClient = require("../services/llmClient");

async function runPanelEvaluation(inputData) {
  try {
    console.log("============================================");
    console.log("🚀 AgentsOrchestration started");
    console.log("============================================");

    const { resume, transcript, jobDescription } = inputData;
    
    console.log(`📋 Resume length: ${resume?.length || 0} characters`);
    console.log(`🎤 Transcript length: ${transcript?.length || 0} characters`);
    console.log(`📝 Job description length: ${jobDescription?.length || 0} characters`);

    // 1. Initialize Agents
    const agents = [
      new ResumeAgent(resume, transcript, jobDescription),
      new TechnicalAgent(resume, transcript, jobDescription),
      new BehavioralAgent(resume, transcript, jobDescription),
      new ClaimAgent(resume, transcript, jobDescription),
      new SkepticAgent(resume, transcript, jobDescription)
    ];

    // 2. Run Agents Safely (Parallel)
    const results = await Promise.allSettled(
      agents.map(agent => agent.evaluate(llmClient))
    );

    const successfulAgents = [];
    const failedAgents = [];
    const agentMap = {
      resume: {},
      technical: {},
      behavioral: {},
      claims: {},
      skeptic: {}
    };

    // 3. Process Results
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const agentData = result.value;
        successfulAgents.push(agentData);

        // Normalize agent score to 0-100 scale (frontend expects percentage)
        // Agents return scores on 0-10 scale, so multiply by 10 to get 0-100
        if (typeof agentData.score === 'number') {
          agentData.score = agentData.score <= 10 ? agentData.score * 10 : agentData.score;
        }

        console.log(`✅ ${agentData.agentName}: Score = ${agentData.score.toFixed(1)}/100`);

        // Map agent names to keys
        const name = agentData.agentName || "";
        if (name.includes("Resume")) agentMap.resume = agentData;
        else if (name.includes("Technical")) agentMap.technical = agentData;
        else if (name.includes("Behavioral")) agentMap.behavioral = agentData;
        else if (name.includes("Claim")) agentMap.claims = agentData;
        else if (name.includes("Skeptic")) agentMap.skeptic = agentData;
      } else {
        const reason = result.reason ? (result.reason.message || String(result.reason)) : "Unknown error";
        console.error("❌ Agent failed:", reason);
        failedAgents.push(reason);
      }
    });

    // 4. Calculate Final Score Programmatically
    const scoringKeys = ["resume", "technical", "behavioral", "claims"];
    const validScores = [];
    const agentScores = {
      resume: 0,
      technical: 0,
      behavioral: 0,
      claims: 0
    };

    scoringKeys.forEach(key => {
      const agentData = agentMap[key];
      if (agentData && typeof agentData.score === 'number') {
        const s = agentData.score;
        agentScores[key] = s;
        if (s > 0) validScores.push(s);
      }
    });

    // 0-100 finalScore
    let finalScore = 50; // default fallback
    if (validScores.length > 0) {
      const sum = validScores.reduce((a, b) => a + b, 0);
      finalScore = Math.round(sum / validScores.length);
    }

    // 5. Improved Recommendation Logic with Multiple Criteria
    // Count agents by score ranges
    let excellentCount = 0; // >= 80
    let goodCount = 0;      // >= 70
    let passCount = 0;      // >= 60
    let weakCount = 0;      // < 60
    
    scoringKeys.forEach(key => {
      const score = agentScores[key];
      if (score >= 80) excellentCount++;
      if (score >= 70) goodCount++;
      if (score >= 60) passCount++;
      if (score < 60) weakCount++;
    });

    // Decision Matrix based on comprehensive criteria
    let recommendation;
    let verdict;
    
    if (finalScore >= 85 && excellentCount >= 3) {
      recommendation = "Strong Hire";
      verdict = "Hire";
    } else if (finalScore >= 75 && goodCount >= 3 && weakCount === 0) {
      recommendation = "Hire";
      verdict = "Hire";
    } else if (finalScore >= 70 && goodCount >= 2 && excellentCount >= 1) {
      recommendation = "Hire";
      verdict = "Hire";
    } else if (finalScore >= 60 && finalScore < 70) {
      recommendation = "Maybe - Further Review Needed";
      verdict = "Maybe";
    } else if (finalScore >= 50 && finalScore < 60) {
      recommendation = "No Hire - Below Expectations";
      verdict = "No Hire";
    } else {
      recommendation = "Strong No Hire";
      verdict = "No Hire";
    }

    // 6. Confidence Level (percentage of valid agent scores)
    const confidenceLevel = Math.round((validScores.length / scoringKeys.length) * 100);

    // 7. Run Consensus Agent (Narrative Only)
    let consensusData = { summary: "Consensus unavailable" };
    try {
      const consensusAgent = new ConsensusAgent();
      const consensusResult = consensusAgent.evaluate(successfulAgents);
      consensusData = {
        summary: consensusResult.reasoning || consensusResult.summary || "Analysis completed.",
        strengths: consensusResult.strengths || [],
        concerns: consensusResult.concerns || []
      };
    } catch (err) {
      console.error("Consensus Agent failed:", err);
    }

    // 8. Skeptic Agent fallback
    if (!agentMap.skeptic || Object.keys(agentMap.skeptic).length === 0) {
      agentMap.skeptic = { message: "Skeptic review unavailable" };
    }

    // 9. Construct final response
    const response = {
      finalScore,
      recommendation,
      confidenceLevel,
      agentScores,
      agents: {
        resume: agentMap.resume,
        technical: agentMap.technical,
        behavioral: agentMap.behavioral,
        claims: agentMap.claims,
        consensus: consensusData,
        skeptic: agentMap.skeptic
      },
      agentOutputs: successfulAgents,
      failedAgents,
      finalDecision: recommendation,
      consensus: {
        finalScore,
        score: finalScore,
        recommendation,
        confidenceLevel,
        summary: consensusData.summary
      }
    };

    console.log("============================================");
    console.log(`🎯 Final Score: ${finalScore}/100`);
    console.log(`📊 Recommendation: ${recommendation}`);
    console.log(`🔒 Confidence: ${confidenceLevel}%`);
    console.log(`✅ Successful Agents: ${successfulAgents.length}`);
    console.log(`❌ Failed Agents: ${failedAgents.length}`);
    console.log("============================================");

    return response;

  } catch (error) {
    console.error("Orchestration Critical Error:", error);

    // Safe fallback
    return {
      finalScore: 50,
      recommendation: "No Hire",
      confidenceLevel: 0,
      agentScores: { resume: 0, technical: 0, behavioral: 0, claims: 0 },
      agents: {
        resume: {},
        technical: {},
        behavioral: {},
        claims: {},
        consensus: { summary: "Consensus unavailable" },
        skeptic: { message: "Skeptic review unavailable" }
      },
      agentOutputs: [],
      failedAgents: [error.message || "Unknown error"],
      finalDecision: "No Hire",
      consensus: {
        finalScore: 50,
        score: 50,
        recommendation: "No Hire",
        confidenceLevel: 0,
        summary: "System error during evaluation."
      }
    };
  }
}

module.exports = runPanelEvaluation;
