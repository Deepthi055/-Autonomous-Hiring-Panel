class SkepticAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
  }

  async evaluate() {
    return {
      agentName: "SkepticAgent",
      score: 6,
      strengths: ["Challenges assumptions"],
      concerns: ["Needs more context"],
      contradictions: [],
      recommendation: "No Hire"
    };
  }
}

module.exports = SkepticAgent;