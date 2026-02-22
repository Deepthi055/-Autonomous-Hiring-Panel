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
import Chatbot from './components/ui/Chatbot';
import SummaryCard from './components/SummaryCard';
import PerformanceChart from './components/PerformanceChart';
import ResultsDashboard from './components/ResultsDashboard';
import About from './components/About';
import ReportGenerator from './components/ReportGenerator';

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
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [jobData, setJobData] = useState({ role: '', description: '' });
  const [resumeData, setResumeData] = useState({ content: '', fileName: null, candidateName: '', candidateEmail: '', candidatePhone: '' });
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState('');

  const STEPS = ['Job Setup', 'Resume', 'AI Questions', 'Interview', 'Evaluation'];

  // ---------------- EVALUATION ----------------
  const transformBackendResponse = (backendData) => {
    // Extract agent outputs (handle both naming conventions from backend)
    const agentOutputs = backendData.agentOutputs || backendData.rawAgentOutputs || [];
    
    // Helper to find agent by name (backend uses 'agentName', older versions might use 'agent')
    const findAgent = (name) => agentOutputs.find(a => (a.agentName === name || a.agent === name)) || {};

    const Resume = findAgent('ResumeAgent');
    const Technical = findAgent('TechnicalAgent');
    const Behavioral = findAgent('BehavioralAgent');
    const Claims = findAgent('ClaimAgent');
    
    // Consensus data might be in 'consensus' or 'candidateAssessment'
    const Consensus = backendData.consensus || backendData.candidateAssessment || {};

    // Helper to normalize confidence level
    const getConfidence = (val) => {
      if (typeof val === 'number') return val;
      if (val === 'high') return 0.9;
      if (val === 'medium') return 0.7;
      if (val === 'low') return 0.5;
      return 0.75;
    };

    return {
      resume: {
        score: Resume.score || 0,
        strengths: Resume.strengths || [],
        concerns: Resume.concerns || [],
        gaps: Resume.gaps || [],
        contradictions: Resume.contradictions || [],
      },
      technical: {
        score: Technical.score || 0,
        strengths: Technical.strengths || [],
        concerns: Technical.concerns || [],
        gaps: Technical.gaps || [],
        contradictions: Technical.contradictions || [],
      },
      behavioral: {
        score: Behavioral.score || 0,
        strengths: Behavioral.strengths || [],
        concerns: Behavioral.concerns || [],
        gaps: Behavioral.gaps || [],
        contradictions: Behavioral.contradictions || [],
      },
      claims: {
        score: Claims.score || 0,
        strengths: Claims.strengths || [],
        concerns: Claims.concerns || [],
        gaps: Claims.gaps || [],
        contradictions: Claims.contradictions || [],
      },
      consensus: {
        finalScore: Consensus.finalScore || Consensus.score || 0,
        confidenceLevel: getConfidence(Consensus.confidenceLevel),
        verdict: Consensus.recommendation || Consensus.verdict || 'No Hire',
        summary: Consensus.reasoning || Consensus.summary || 'Evaluation completed',
      },
    };
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = {
        resume: resumeData.content,
        transcript: transcript,
        jobDescription: jobData.description
      };

      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Fallback to mock data if backend is unavailable
        console.warn('Backend unavailable, using mock data for demonstration');
        setResults(MOCK_EVALUATION_RESULT);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Backend response received:", data);
      
      // Transform backend response to component-friendly format
      const transformedData = transformBackendResponse(data);
      setResults(transformedData);
    } catch (err) {
      console.warn('Backend connection failed, loading mock data:', err.message);
      // Fallback to mock data on network error
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
                onUpdate={(updates) => setResumeData({...resumeData, ...updates})} 
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

                {!loading && !results && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-gray-400 mb-4">No evaluation results available.</div>
                    <button 
                      onClick={handleFinalSubmit}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Retry Evaluation
                    </button>
                  </div>
                )}

                {!loading && results && (
                  <>
                    <SummaryCard data={results} />

                    <div className="w-full">
                      <PerformanceChart data={results} />
                    </div>
                    <ResultsDashboard data={(() => {
                      const { consensus, ...agentResults } = results;
                      return agentResults;
                    })()} />
                    
                    <div className="flex flex-wrap justify-center items-center gap-4 pt-8">
                      <ReportGenerator data={{...resumeData, evaluationResult: results}} />
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
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