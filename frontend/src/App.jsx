import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';

import Navigation from './components/Navigation';
import Header from './components/Header';
import WizardStepper from './components/WizardStepper';
import JobSetup from './components/JobSetup';
import ResumeInput from './components/ResumeInput';
import QuestionGenerator from './components/QuestionGenerator';
import InterviewRecorder from './components/InterviewRecorder';
import Chatbot from './components/Chatbot';
import SummaryCard from './components/SummaryCard';
import PerformanceChart from './components/PerformanceChart';
import ResultsDashboard from './components/ResultsDashboard';
import About from './components/About';


// ---------------- MOCK DATA ----------------

const MOCK_EVALUATION_RESULT = {
  resume: {
    score: 85,
    strengths: [
      'Strong experience in JavaScript and React',
      'Clear career progression and achievements'
    ],
    concerns: ['Some gaps in Python proficiency'],
    gaps: ['Limited DevOps experience'],
    contradictions: [],
  },
  technical: {
    score: 78,
    strengths: ['Solid React knowledge'],
    concerns: ['Limited cloud examples'],
    gaps: ['Microservices experience'],
    contradictions: [],
  },
  behavioral: {
    score: 82,
    strengths: ['Leadership experience'],
    concerns: [],
    gaps: ['Agile methodology not mentioned'],
    contradictions: [],
  },
  claims: {
    score: 88,
    strengths: ['Certifications appear valid'],
    concerns: [],
    gaps: [],
    contradictions: [],
  },
  consensus: {
    finalScore: 83,
    confidenceLevel: 82,
    verdict: 'Hire',
    summary:
      'Strong candidate with excellent technical and behavioral fit.',
  },
};


// ---------------- APP CONTENT ----------------

function AppContent({ onNavigateToAbout }) {
  const { isDark } = useTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [jobData, setJobData] = useState({ role: '', description: '' });
  const [resumeData, setResumeData] = useState({ content: '', fileName: null });
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState('');

  const STEPS = ['Job Setup', 'Resume', 'AI Questions', 'Interview', 'Evaluation'];

  // ---------------- EVALUATION ----------------

  const handleEvaluate = async () => {
    setLoading(true);

    try {
      // Simulate evaluation - show results after delay
      setTimeout(() => {
        setResults(MOCK_EVALUATION_RESULT);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Evaluation failed:', error);
      setResults(MOCK_EVALUATION_RESULT);
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setCurrentStep(4);
    await handleEvaluate();
  };

  const resetApp = () => {
    setCurrentStep(0);
    setResults(null);
    setJobData({ role: '', description: '' });
    setResumeData({ content: '', fileName: null });
    setQuestions([]);
    setTranscript('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>

      <Navigation onAboutClick={onNavigateToAbout} />
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-8">

          <WizardStepper steps={STEPS} currentStep={currentStep} />

          <div className={`rounded-2xl shadow-md border p-8 min-h-[500px] transition ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>

            {/* STEP 0 */}
            {currentStep === 0 && (
              <JobSetup
                data={jobData}
                onUpdate={(updates) =>
                  setJobData({ ...jobData, ...updates })
                }
                onNext={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <ResumeInput
                data={resumeData}
                onUpdate={(updates) =>
                  setResumeData({ ...resumeData, ...updates })
                }
                onNext={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
              />
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <QuestionGenerator
                data={{
                  questions,
                  selectedRole: { id: jobData.role },
                  resumeContent: resumeData.content,
                }}
                onNext={(data) => {
                  if (data?.questions) setQuestions(data.questions);
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <InterviewRecorder
                transcript={transcript}
                onUpdate={setTranscript}
                onNext={handleFinalSubmit}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fadeIn">

                {loading && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-semibold">
                      Evaluating Candidate...
                    </p>
                  </div>
                )}

                {!loading && results && (
                  <>
                    <SummaryCard data={results} />

                    <div className="w-full">
                      <PerformanceChart data={results} />
                    </div>

                    <ResultsDashboard data={results} />

                    <div className="flex justify-center pt-8">
                      <button
                        onClick={resetApp}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Start New Evaluation
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105"
      >
        <MessageSquare size={24} />
      </button>

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAddQuestions={(q) =>
          setQuestions((prev) => [...prev, q])
        }
        currentQuestions={questions}
        role={jobData.role}
        resumeContent={resumeData.content}
      />
    </div>
  );
}


// ---------------- MAIN APP ----------------

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <ThemeProvider>
      {showAbout ? (
        <About onBack={() => setShowAbout(false)} />
      ) : (
        <AppContent onNavigateToAbout={() => setShowAbout(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;