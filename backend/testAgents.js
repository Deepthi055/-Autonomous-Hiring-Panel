const ResumeAgent = require("./agents/resumeAgent");

// 🔥 Mock LLM Client (IMPORTANT)
const mockLLM = {
  async complete(prompt) {
    console.log("LLM Prompt Sent:\n", prompt);

    // Simulated AI response
    return JSON.stringify({
      score: 78,
      extractedSkills: {
        matched: ["Node.js", "AWS"],
        missing: ["Kubernetes"]
      },
      skillAlignmentPercent: 75,
      strengths: ["Strong backend experience", "Cloud exposure"],
      concerns: ["Limited DevOps depth"],
      gaps: ["Kubernetes"],
      contradictions: [],
      reasoning: "Candidate aligns well with backend and cloud requirements.",
      recommendation: "Hire"
    });
  }
};

async function testResumeAgent() {
  const resume = "5 years experience in Node.js and AWS. Built scalable APIs.";
  const transcript = "";
  const jobDescription = "Looking for backend engineer with Node.js, AWS, Kubernetes.";

  const resumeAgent = new ResumeAgent(
    resume,
    transcript,
    jobDescription
  );

  const result = await resumeAgent.evaluate(mockLLM);

  console.log("\nFinal ResumeAgent Result:\n", result);
}

testResumeAgent();