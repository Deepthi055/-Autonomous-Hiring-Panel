import React, { useState } from 'react';
import Stepper from './components/Stepper';
import ToastContainer from './components/ToastContainer';
import JobSetupPage from './pages/JobSetupPage';
import ResumeInputPage from './pages/ResumeInputPage';
import QuestionsPage from './pages/QuestionsPage';
import RecordingPage from './pages/RecordingPage';
import EvaluationPage from './pages/EvaluationPage';
import { useToast } from './hooks/useToast';
import { Brain, Sparkles } from 'lucide-react';

const STEPS = {
  JOB: 1,
  RESUME: 2,
  QUESTIONS: 3,
  RECORDING: 4,
  EVALUATION: 5,
};

function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.JOB);

  // Step 1 state
  const [jobDescription, setJobDescription] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Step 2 state
  const [resumeContent, setResumeContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Step 3 state
  const [questions, setQuestions] = useState([]);

  // Step 4 state
  const [transcript, setTranscript] = useState('');

  // Step 5 state
  const [evaluationData, setEvaluationData] = useState(null);

  const { toasts, addToast, removeToast } = useToast();

  // Navigation handlers
  const goTo = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep1Continue = () => {
    if (!selectedRole) {
      addToast('Please select a role to continue.', 'error');
      return;
    }
    if (jobDescription.trim().length < 30) {
      addToast('Please provide a more detailed job description.', 'error');
      return;
    }
    goTo(STEPS.RESUME);
    addToast('Job setup complete!', 'success');
  };

  const handleStep2Continue = () => {
    if (!resumeContent.trim() && !uploadedFile) {
      addToast('Please provide resume content to continue.', 'error');
      return;
    }
    goTo(STEPS.QUESTIONS);
    addToast('Generating AI interview questions...', 'info');
  };

  const handleStep3Continue = () => {
    if (questions.length === 0) {
      addToast('Please wait for questions to be generated.', 'error');
      return;
    }
    goTo(STEPS.RECORDING);
    addToast('Starting interview recording session.', 'info');
  };

  const handleStep4Continue = () => {
    goTo(STEPS.EVALUATION);
    addToast('Submitting for AI evaluation...', 'info');
  };

  const handleRestart = () => {
    setJobDescription('');
    setSelectedRole('');
    setResumeContent('');
    setUploadedFile(null);
    setQuestions([]);
    setTranscript('');
    setEvaluationData(null);
    goTo(STEPS.JOB);
    addToast('Started a new evaluation session.', 'info');
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.JOB:
        return (
          <JobSetupPage
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            onContinue={handleStep1Continue}
          />
        );
      case STEPS.RESUME:
        return (
          <ResumeInputPage
            resumeContent={resumeContent}
            setResumeContent={setResumeContent}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onContinue={handleStep2Continue}
            onBack={() => goTo(STEPS.JOB)}
          />
        );
      case STEPS.QUESTIONS:
        return (
          <QuestionsPage
            selectedRole={selectedRole}
            resumeContent={resumeContent}
            questions={questions}
            setQuestions={setQuestions}
            onContinue={handleStep3Continue}
            onBack={() => goTo(STEPS.RESUME)}
          />
        );
      case STEPS.RECORDING:
        return (
          <RecordingPage
            transcript={transcript}
            setTranscript={setTranscript}
            onContinue={handleStep4Continue}
            onBack={() => goTo(STEPS.QUESTIONS)}
          />
        );
      case STEPS.EVALUATION:
        return (
          <EvaluationPage
            selectedRole={selectedRole}
            resumeContent={resumeContent}
            transcript={transcript}
            evaluationData={evaluationData}
            setEvaluationData={setEvaluationData}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">DataVex<span className="text-indigo-400">.ai</span></h1>
                <p className="text-slate-500 text-xs">Intelligent Hiring System</p>
              </div>
            </div>

            {/* Nav actions */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Active
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${s === currentStep ? 'bg-indigo-400 scale-125' : s < currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section (only on step 1) */}
      {currentStep === STEPS.JOB && (
        <div className="relative overflow-hidden border-b border-slate-800/50">
          {/* Gradient orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Recruitment Platform
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Hire smarter with{' '}
              <span className="gradient-text">AI-driven</span>{' '}
              insights
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Streamline your recruitment process — from job setup to candidate evaluation — powered by multi-agent AI.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8 text-sm">
              {['AI Question Generation', 'Interview Recording', 'Speech to Text', 'Multi-agent Evaluation', 'Analytics Dashboard'].map(feat => (
                <span key={feat} className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Stepper */}
        <Stepper currentStep={currentStep} />

        {/* Page content */}
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-500 text-sm">DataVex.ai — Intelligent Hiring System</span>
          </div>
          <p className="text-slate-600 text-xs">Built with React 18 + Tailwind CSS + Recharts</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
