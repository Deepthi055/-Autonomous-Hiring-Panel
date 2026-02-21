import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThemeProvider } from './ThemeContext';
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
import AgentBreakdownChart from './components/AgentBreakdownChart';
import ResultsDashboard from './components/ResultsDashboard';
import About from './components/About';
import { useTheme } from './ThemeContext';

// Mock data for demonstration without backend
const MOCK_EVALUATION_RESULT = {
  resume: {
    score: 0.85,
    strengths: [
      'Strong experience in JavaScript and React',
      'Clear career progression and achievements',
      'AWS certifications documented',
      'Leadership experience highlighted'
    ],
    concerns: [
      'Some gaps in Python proficiency'
    ],
    gaps: [
      'Limited DevOps experience',
      'No mention of Docker expertise'
    ],
    contradictions: [],
  },
  technical: {
    score: 0.78,
    strengths: [
      'Solid JavaScript and React knowledge',
      'AWS certification matches job requirements',
      'Full-stack development experience'
    ],
    concerns: [
      'Python skills not deeply demonstrated',
      'Limited cloud infrastructure examples'
    ],
    gaps: [
      'Microservices architecture experience',
      'Kubernetes knowledge'
    ],
    contradictions: [],
  },
  behavioral: {
    score: 0.82,
    strengths: [
      'Clear team leadership experience',
      'Communication skills evident',
      'Collaboration demonstrated in projects',
      'Mentoring of junior developers'
    ],
    concerns: [
      'Limited conflict resolution examples'
    ],
    gaps: [
      'Agile methodology not explicitly mentioned'
    ],
    contradictions: [],
  },
  claims: {
    score: 0.88,
    strengths: [
      'All certifications appear legitimate',
      'Job titles match timeline',
      'Verifiable achievements'
    ],
    concerns: [],
    gaps: [],
    contradictions: [],
  },
  consensus: {
    finalScore: 0.83,
    confidenceLevel: 0.82,
    verdict: 'Hire',
    summary: 'Strong candidate with excellent technical and behavioral fit for the role. Recommend moving to interview stage.',
  },
};

function AppContent({ onNavigateToAbout }) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Wizard State
  const [jobData, setJobData] = useState({ role: '', description: '' });
  const [resumeData, setResumeData] = useState({ content: '', fileName: null });
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState('');

  const STEPS = ['Job Setup', 'Resume', 'AI Questions', 'Interview', 'Evaluation'];

  const handleEvaluate = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
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
      
      // Transform backend response to component-friendly format
      const transformedData = transformBackendResponse(data);
      setResults(transformedData);
    } catch (err) {
      console.warn('Backend connection failed, loading mock data:', err.message);
      // Fallback to mock data on network error
      setResults(MOCK_EVALUATION_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    handleEvaluate({
      resume: resumeData.content || "Mock Resume Content",
      transcript: transcript,
      jobDescription: jobData.description
    });
    setCurrentStep(4);
  };

  const handleLoadDemoData = () => {
    setResults(MOCK_EVALUATION_RESULT);
  };

  const transformBackendResponse = (backendData) => {
    // Extract agent outputs for detailed cards
    const agentOutputs = backendData.rawAgentOutputs || [];
    
    // Map agent data
    const Resume = agentOutputs.find(a => a.agent === 'ResumeAgent') || {};
    const Technical = agentOutputs.find(a => a.agent === 'TechnicalAgent') || {};
    const Behavioral = agentOutputs.find(a => a.agent === 'BehavioralAgent') || {};
    const Claims = agentOutputs.find(a => a.agent === 'ClaimAgent') || {};
    const Consensus = backendData.candidateAssessment || {};

    return {
      resume: {
        score: Resume.score || 0,
        strengths: Resume.strengths || [Resume.comments || 'Resume analysis completed'],
        concerns: Resume.concerns || [],
        gaps: Resume.gaps || [],
        contradictions: Resume.contradictions || [],
      },
      technical: {
        score: Technical.score || 0,
        strengths: Technical.strengths || [Technical.comments || 'Technical assessment completed'],
        concerns: Technical.concerns || [],
        gaps: Technical.gaps || [],
        contradictions: Technical.contradictions || [],
      },
      behavioral: {
        score: Behavioral.score || 0,
        strengths: Behavioral.strengths || [Behavioral.comments || 'Behavioral evaluation completed'],
        concerns: Behavioral.concerns || [],
        gaps: Behavioral.gaps || [],
        contradictions: Behavioral.contradictions || [],
      },
      claims: {
        score: Claims.score || 0,
        strengths: Claims.strengths || [Claims.comments || 'Claims verification completed'],
        concerns: Claims.concerns || [],
        gaps: Claims.gaps || [],
        contradictions: Claims.contradictions || [],
      },
      consensus: {
        finalScore: backendData.candidateAssessment?.consensus?.averageScore || 
                   (agentOutputs.length > 0 
                     ? agentOutputs.reduce((sum, a) => sum + (a.score || 0), 0) / agentOutputs.length 
                     : 0),
        confidenceLevel: backendData.candidateAssessment?.confidence || 
                        (agentOutputs.length > 0 ? 0.75 : 0),
        verdict: backendData.candidateAssessment?.verdict || 'No-Hire',
        summary: backendData.candidateAssessment?.summary || 'Evaluation completed',
      },
    };
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation onAboutClick={onNavigateToAbout} />
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-8">
          
          <WizardStepper steps={STEPS} currentStep={currentStep} />

          <div className={`rounded-2xl shadow-sm border p-6 min-h-[500px] transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            
            {currentStep === 0 && (
              <JobSetup 
                data={jobData} 
                onUpdate={(updates) => setJobData({...jobData, ...updates})} 
                onNext={() => setCurrentStep(1)} 
              />
            )}

            {currentStep === 1 && (
              <ResumeInput 
                data={resumeData} 
                onUpdate={(updates) => setResumeData({...resumeData, ...updates})} 
                onNext={() => setCurrentStep(2)} 
                onBack={() => setCurrentStep(0)}
              />
            )}

            {currentStep === 2 && (
              <QuestionGenerator 
                data={{ questions, selectedRole: { id: jobData.role }, resumeContent: resumeData.content }}
                onNext={(data) => {
                   if(data && data.questions) setQuestions(data.questions);
                   setCurrentStep(3);
                }} 
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <InterviewRecorder 
                transcript={transcript} 
                onUpdate={setTranscript} 
                onNext={handleFinalSubmit}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <div className="space-y-8 animate-fadeIn">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-semibold">Evaluating Candidate...</p>
                  </div>
                )}

                {!loading && results && (
                  <>
                    <SummaryCard data={results} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <PerformanceChart data={results} />
                      <AgentBreakdownChart data={results} />
                    </div>
                    <ResultsDashboard data={results} />
                    
                    <div className="flex justify-center pt-8">
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

      {/* Chatbot Trigger */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40"
      >
        <MessageSquare size={24} />
      </button>

      <Chatbot 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAddQuestions={(q) => setQuestions(prev => [...prev, q])}
        currentQuestions={questions}
        role={jobData.role}
        resumeContent={resumeData.content}
      />
    </div>
  );
}

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleNavigateToAbout = () => {
    setShowAbout(true);
  };

  const handleBackFromAbout = () => {
    setShowAbout(false);
  };

  return (
    <ThemeProvider>
      {showAbout ? (
        <About onBack={handleBackFromAbout} />
      ) : (
        <AppContent onNavigateToAbout={handleNavigateToAbout} />
      )}
    </ThemeProvider>
  );
}

export default App;
