class TechnicalAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
  }

  async evaluate() {
    return {
      agentName: "TechnicalAgent",
      score: 6,
      strengths: ["Solid fundamentals"],
      concerns: ["Limited system design detail"],
      contradictions: [],
      recommendation: "No Hire"
    };
  }
}

module.exports = TechnicalAgent;
