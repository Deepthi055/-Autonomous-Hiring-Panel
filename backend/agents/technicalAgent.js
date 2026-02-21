class TechnicalAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "TechnicalAgent";
  }

  async evaluate() {
    // Mock: look for technical keywords in resume + transcript
    const keywords = ["JavaScript", "Node", "React", "Python", "AWS"];
    let matches = 0;
    const hay = (this.resume + " " + this.transcript + " " + this.jobDescription).toLowerCase();
    for (const k of keywords) {
      if (hay.includes(k.toLowerCase())) matches++;
    }
    const score = Math.min(1, matches / keywords.length + 0.2);
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: `Found ${matches} technical keyword matches.`,
      details: { matches }
    };
  }
}

module.exports = TechnicalAgent;
