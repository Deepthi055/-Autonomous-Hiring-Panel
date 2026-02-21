class ClaimAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "ClaimAgent";
  }

  async evaluate() {
    // Mock: check for unverifiable claims (very rough)
    const unverifiable = ["expert", "guru", "rockstar"];
    let count = 0;
    const text = (this.resume + " " + this.transcript).toLowerCase();
    for (const u of unverifiable) if (text.includes(u)) count++;
    const score = Math.max(0, 1 - count * 0.25);
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: `Unverifiable claims count: ${count}`,
      details: { unverifiableCount: count }
    };
  }
}

module.exports = ClaimAgent;
