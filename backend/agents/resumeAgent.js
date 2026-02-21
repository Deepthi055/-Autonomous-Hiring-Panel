class ResumeAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "ResumeAgent";
  }

  async evaluate() {
    // Lightweight mock logic: check resume length and keywords
    const score = Math.min(1, Math.max(0, (this.resume.length / 1000)));
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: "Parsed resume and extracted key skills/experience.",
      details: {
        resumeLength: this.resume.length
      }
    };
  }
}

module.exports = ResumeAgent;
