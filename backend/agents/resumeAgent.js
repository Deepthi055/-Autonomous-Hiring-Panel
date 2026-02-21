class ResumeAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
  }

  async evaluate() {
    return {
      agentName: "ResumeAgent",
      score: 7,
      strengths: ["Relevant experience"],
      concerns: ["Needs deeper domain context"],
      contradictions: [],
      recommendation: "Hire"
    };
  }
}

module.exports = ResumeAgent;