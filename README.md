# Autonomous AI Hiring Panel > A Multi-Agent AI system that simulates a real-world technical hiring panel, evaluates candidate resumes and interviews, identifies gaps or contradictions, and autonomously produces hiring recommendations. --- ## Table of Contents 1. [System Overview](#system-overview) 2. [Agents Documentation](#agents-documentation) - [Resume Agent](#1-resume-agent-resumeagentjs) - [Technical Agent](#2-technical-agent-technicalagentjs) - [Behavioral Agent](#3-behavioral-agent-behavioralagentjs) - [Claim Agent](#4-claim-agent-claimagentjs) - [Skeptic Agent](#5-skeptic-agent-skepticagentjs) - [Consensus Agent](#6-consensus-agent-consensusagentjs) 3. [Orchestration Flow](#orchestration-flow-panelorchestratorjs) 4. [Data Flow Diagram](#data-flow-diagram) 5. [Frontend & Backend Workflow](#frontend--backend-workflow) 6. [API Endpoints](#api-endpoints) 7. [Technology Stack](#technology-stack) 8. [Getting Started](#getting-started) 9. [Usage](#usage) 10. [Contributing](#contributing) 11. [License](#license) 12. [Contact](#contact) --- ## System Overview The Autonomous Hiring Panel uses a **Multi-Agent System (MAS)** to evaluate candidates. Instead of relying on a single AI prompt, it orchestrates five specialized agents, each assuming a distinct persona and evaluation criteria. **Benefits:** - Reduces hallucinations - Provides multiple perspectives - Mimics a real-world hiring committee - Produces explainable decisions and audit trails --- ## Agents Documentation ### 1. Resume Agent (ResumeAgent.js) **Role:** The Screener **Input:** Resume text, Job Description (JD) **Output:** Skill alignment score, missing competencies, experience depth **Functionality:** - Parses resume for technical skills, tools, and certifications - Matches skills against JD requirements - Applies weighted scoring for critical skills (AI, Cloud, DevOps) - Performs gap analysis and lists missing skills **Key Metric:** skillAlignmentPercent --- ### 2. Technical Agent (TechnicalAgent.js) **Role:** Senior Engineer **Input:** Interview transcript, Resume, JD **Output:** Technical depth rating, system design score, vague answer flags **Functionality:** - Evaluates depth of technical answers - Assesses system design knowledge (scalability, microservices) - Detects vague or buzzword-heavy responses - Evaluates cloud/ML expertise **Key Metrics:** technicalDepth, systemDesignScore --- ### 3. Behavioral Agent (BehavioralAgent.js) **Role:** HR Manager / Culture Fit Evaluator **Input:** Interview transcript, Resume, JD **Output:** Leadership score, STAR adherence, cultural fit **Functionality:** - Checks STAR method adherence in behavioral answers - Evaluates leadership and ownership language - Quantifies impact with measurable outcomes - Assesses cultural alignment **Key Metrics:** culturalFitScore, starCompleteness --- ### 4. Claim Agent (ClaimAgent.js) **Role:** Background Checker / Fact Verifier **Input:** Resume, Interview Transcript **Output:** Credibility score, inflated claims, verified achievements **Functionality:** - Cross-references resume claims with interview answers - Flags discrepancies and unsupported achievements - Marks claims as "Verified" if details are consistent **Key Metric:** credibilityScore --- ### 5. Skeptic Agent (SkepticAgent.js) **Role:** Bar Raiser / Critical Evaluator **Input:** Resume, Interview Transcript **Output:** Contradictions, overconfidence flags, hiring risk **Functionality:** - Actively searches for reasons *not* to hire - Detects contradictions within transcript or between resume & transcript - Calculates buzzword-to-substance ratio - Assigns risk levels (Low / Medium / High / Critical) **Key Metrics:** hiringRisk, contradictions count --- ### 6. Consensus Agent (ConsensusAgent.js) **Role:** Committee Chair **Input:** Outputs from all agents **Output:** Final weighted score, hiring recommendation, confidence level **Functionality:** - Aggregates scores from all agents - Computes final weighted score - Recommends **Hire / Consider / No Hire** based on thresholds - Confidence based on number of agents successfully evaluating --- ## Orchestration Flow (panelOrchestrator.js) - Instantiates all 5 agents with Resume, Transcript, JD - Executes all agents in parallel (Promise.allSettled) - Normalizes agent scores to 0-100% - Applies voting logic for final verdict - Generates JSON report for frontend visualization **Scoring & Weights:** - Technical & Resume often carry higher influence - Skeptic agent can act as a veto mechanism - Final recommendation requires 3+ agents scoring >60% --- ## Data Flow Diagram
mermaid
graph TD
    A[User Inputs] -->|Resume + Transcript + JD| B(Panel Orchestrator)
    B --> C[Resume Agent]
    B --> D[Technical Agent]
    B --> E[Behavioral Agent]
    B --> F[Claim Agent]
    B --> G[Skeptic Agent]
    
    C -->|Score & Skills| H(Consensus Engine)
    D -->|Score & Depth| H
    E -->|Score & Culture| H
    F -->|Score & Credibility| H
    G -->|Score & Risks| H
    
    H --> I[Final Report JSON]
    I --> J[Frontend Dashboard]

## 5. Frontend & Backend Workflow

The application follows a linear "Wizard" flow where data is accumulated at each step and sent to the backend for AI evaluation.

### Phase 1: Resume Ingestion
- **Component:** `ResumeInput.jsx`
- **Action:** User uploads a PDF or pastes text.
- **Backend:** `POST /api/interview/upload-resume`
- **Result:** Text is extracted and stored in the frontend state (`resumeContent`).

### Phase 2: Question Generation
- **Component:** `QuestionGenerator.jsx`
- **Action:** Frontend sends the `resumeContent` and selected `role`.
- **Backend:** `POST /api/interview/generate-questions`
- **Logic:** LLM generates technical and behavioral questions based on resume gaps and role requirements.
- **Result:** A list of questions is displayed to the user.

### Phase 3: Interview & Transcription
- **Component:** `InterviewRecorder.jsx`
- **Action:** User records answers to the generated questions.
- **Backend:** `POST /api/interview/transcribe`
- **Logic:** Audio is converted to text using an AI transcription service.
- **Result:** Transcript is appended to the interview record.

### Phase 4: AI Evaluation
- **Component:** `HiringWizard.jsx` (Submit Step)
- **Action:** Frontend sends the accumulated `resumeContent`, `transcript`, and `jobDescription`.
- **Backend:** `POST /api/interview/evaluate`
- **Logic:** `panelOrchestrator` spins up 5 AI agents (Resume, Technical, Behavioral, Claim, Skeptic) to analyze the data in parallel.
- **Result:** JSON report containing scores, flags, and a hiring recommendation.

### Phase 5: Visualization
- **Component:** `ResultsDashboard.jsx`
- **Action:** Renders the JSON response into charts (`PerformanceChart.jsx`) and detailed cards.

---

## 6. API Endpoints

| Endpoint | Method | Input | Output |
| --- | --- | --- | --- |
| `/api/interview/upload-resume` | POST | `file` (PDF) | `{ resumeText: string }` |
| `/api/interview/generate-questions` | POST | `{ role, resumeText }` | `{ questions: [] }` |
| `/api/interview/transcribe` | POST | `file` (Audio) | `{ transcript: string }` |
| `/api/interview/chatbot` | POST | `{ prompt, context }` | `{ response: string }` |
| `/api/interview/evaluate` | POST | `{ resume, transcript, jd }` | `{ candidateAssessment, rawAgentOutputs }` |

---

## 7. Technology Stack

- **Frontend:** React, Vite, TailwindCSS, Recharts, Lucide Icons  
- **Backend:** Node.js, Express  
- **AI Services:** OpenAI GPT / OpenRouter (Agents & Question Gen), Whisper (Transcription)  
- **Database:** MongoDB / PostgreSQL  
- **State Management:** React `useState` passed through Wizard steps  

---

## 8. Getting Started
bash # Clone repository git clone https://github.com/<your-username>/sample.git cd sample # Install frontend cd frontend npm install # Install backend cd ../backend npm install # Start backend npm run dev # Start frontend cd ../frontend npm run dev
