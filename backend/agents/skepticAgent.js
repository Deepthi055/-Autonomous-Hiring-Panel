class SkepticAgent {
  constructor(resume, transcript, jobDescription) {
    this.resume = resume;
    this.transcript = transcript;
    this.jobDescription = jobDescription;
    this.name = "SkepticAgent";
  }

  async evaluate() {
    // Mock: take a conservative stance — penalize overclaims
    const redFlags = ["over 10 years", "10+ years", "always"];
    let flags = 0;
    const text = (this.resume + " " + this.transcript).toLowerCase();
    for (const f of redFlags) if (text.includes(f)) flags++;
    const score = Math.max(0, 0.8 - flags * 0.2);
    return {
      agent: this.name,
      agentName: this.name,
      score: Number(score.toFixed(2)),
      comments: `Skeptic checks found ${flags} red flags`,
      details: { flags }
    };
  }
}

module.exports = SkepticAgent;
