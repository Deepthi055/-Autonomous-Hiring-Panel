class ClaimAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
  }

  async evaluate() {
    return {
      agentName: "ClaimAgent",
      score: 5,
      strengths: ["Identifies claims"],
      concerns: ["Insufficient evidence"],
      contradictions: ["Claim mismatch"],
      recommendation: "No Hire"
    };
  }
}

module.exports = ClaimAgent;