class BehavioralAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
  }

  async evaluate() {
    return {
      agentName: "BehavioralAgent",
      score: 7,
      strengths: ["Clear communication"],
      concerns: ["Could show more ownership examples"],
      contradictions: [],
      recommendation: "Hire"
    };
  }
}

module.exports = BehavioralAgent;