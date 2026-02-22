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

```bash
# Clone repository
git clone https://github.com/<your-username>/sample.git
cd sample

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Start backend
npm run dev

# Start frontend
cd ../frontend
npm run dev


