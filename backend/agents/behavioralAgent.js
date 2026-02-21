class BehavioralAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "BehavioralAgent";
  }

  async evaluate() {
    // Mock: evaluate presence of soft-skill phrases in transcript
    const phrases = ["team", "lead", "collaborate", "communication", "mentor"];
    let count = 0;
    const text = (this.transcript + " " + this.resume).toLowerCase();
    for (const p of phrases) if (text.includes(p)) count++;
    const score = Math.min(1, 0.2 + (count / phrases.length));
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: `Behavioral indicators found: ${count}`,
      details: { indicators: count }
    };
  }
}

module.exports = BehavioralAgent;
