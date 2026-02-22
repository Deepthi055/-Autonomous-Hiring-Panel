Autonomous Hiring Panel - README
Project Overview

The Autonomous Hiring Panel is an AI-powered system designed to simulate a hiring committee for evaluating job candidates. Instead of relying on a single AI model, it uses multiple specialized agents to analyze resumes, interview transcripts, and job descriptions. The system provides detailed candidate assessments, highlights strengths and weaknesses, detects inconsistencies, and produces actionable hiring recommendations.

System Architecture
Audio Transcription Flow

The system captures a candidate’s spoken interview responses and converts them into text. On the frontend, the InterviewRecorder component uses the browser’s MediaRecorder API to record audio. Audio is collected in chunks and combined into a single audio file when recording stops. This audio file is then uploaded to the backend.

On the backend, the file is received via middleware such as multer. A speech service, typically OpenAI Whisper, processes the audio file and returns a textual transcript. The frontend receives this transcript in JSON format and displays it in the interface for the candidate’s answers.

Frontend-to-Backend Workflow

The application follows a linear wizard-like workflow, accumulating data at each step:

Resume Ingestion: The user uploads a resume PDF or pastes text in the ResumeInput component. The backend extracts the text and makes it available in the frontend state for further processing.

Question Generation: Using the QuestionGenerator component, the frontend sends the resume text and the selected job role to the backend. A language model generates technical and behavioral questions tailored to the candidate’s experience and the job requirements. These questions are then displayed in the frontend.

Interview Recording: The candidate records answers to the generated questions in the InterviewRecorder component. Audio is uploaded and transcribed into text, which is appended to the candidate’s interview record.

AI Evaluation: When all answers are recorded, the HiringWizard component submits the resume, interview transcript, and job description to the backend. The system orchestrates multiple AI agents to analyze the information in parallel and produce a structured evaluation.

Results Visualization: The ResultsDashboard component renders the evaluation results. It presents scores, risk flags, and recommendations through readable cards and charts, allowing the hiring panel or recruiter to make informed decisions.

Key Technologies

The frontend is built using React with Vite, styled using Tailwind CSS, and uses Lucide Icons for visual elements. Charts are displayed using Recharts. State management is handled via React’s useState, propagated through the wizard steps.

The backend uses Node.js and Express. AI services include OpenRouter or OpenAI models for language tasks and OpenAI Whisper for speech-to-text transcription. The system is designed to be modular and extensible, allowing the integration of additional agents or AI services as needed.

Agent Architecture

The evaluation process relies on a multi-agent system, where each agent plays a distinct role:

Resume Agent: Acts as the screener. It parses the resume to identify skills, certifications, and experience, and compares them with the job description. It produces a skill alignment score and identifies missing competencies.

Technical Agent: Acts as a senior engineer. It evaluates the technical depth of the candidate’s answers, system design understanding, and penalizes vague responses. It also assesses cloud and AI expertise when relevant.

Behavioral Agent: Functions as the HR or culture evaluator. It analyzes responses using the STAR (Situation, Task, Action, Result) framework, evaluates leadership and ownership, and assesses cultural fit.

Claim Agent: Functions as a fact checker. It cross-references resume claims with interview responses, identifies inflated or unsupported claims, and assigns a credibility score.

Skeptic Agent: Acts as a bar raiser, actively looking for reasons not to hire. It detects contradictions, overconfidence, and assesses risk.

Consensus Agent: Acts as the committee chair. It aggregates outputs from all other agents, calculates a final weighted score, and generates the hiring recommendation along with a confidence level.

Orchestration Flow

The orchestration component, often referred to as the PanelOrchestrator, manages the evaluation process. It instantiates all five agents with the candidate’s resume, transcript, and job description. Agents run in parallel so that failure of one does not affect the others. The orchestrator normalizes all scores to a standardized scale, applies voting logic, and determines the final recommendation. The system returns a structured JSON report containing individual agent outputs, the consensus summary, and the final decision.

Usage Instructions

Install dependencies by running npm install in the project root.

Start the backend server using npm run dev.

Start the frontend server using npm run dev --prefix frontend.

Use the application by following the workflow: upload a resume, generate interview questions, record answers, submit for AI evaluation, and view the results on the dashboard.

