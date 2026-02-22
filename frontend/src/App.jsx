import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';

import Navigation from './components/Navigation';
import Header from './components/Header';
import WizardStepper from './components/WizardStepper';
import JobSetup from './components/JobSetup';
import ResumeInput from './components/ResumeInput';
import QuestionGenerator from './components/QuestionGenerator';
import AIInterviewAgent from './components/wizard/AIInterviewAgent';
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

  const buildTranscriptFromInterview = (conversation) => {
    if (!conversation || conversation.length === 0) return '';

    return conversation
      .filter((entry) => entry?.message)
      .map((entry) => {
        const speaker = entry.type === 'agent' ? 'Interviewer' : 'Candidate';
        return `${speaker}: ${entry.message}`;
      })
      .join('\n');
  };

  // ---------------- EVALUATION ----------------

  // Transform API response to component format
  const transformApiResponse = (apiData) => {
    console.log('Transforming API Data:', apiData);
    
    if (!apiData || !apiData.rawAgentOutputs) {
      console.warn('No rawAgentOutputs in API response, using mock data');
      return MOCK_EVALUATION_RESULT;
    }

    const agents = apiData.rawAgentOutputs;
    const result = {};

    console.log('Raw Agents:', agents.map(a => ({ name: a.agentName, score: a.score })));

    // Helper to normalize scores: if score is 0-10, multiply by 10 to get 0-100
    const normalizeScore = (score) => {
      if (!score) return 0;
      // If score is less than or equal to 10, it's on a 0-10 scale, convert to 0-100
      return score <= 10 ? score * 10 : score;
    };

    // Map agent outputs to expected format
    agents.forEach(agent => {
      const agentName = agent.agentName?.toLowerCase() || '';
      
      if (agentName.includes('resume')) {
        result.resume = {
          score: normalizeScore(agent.score),
          strengths: agent.strengths || [],
          concerns: agent.concerns || [],
          gaps: agent.gaps || [],
          contradictions: agent.contradictions || []
        };
      } else if (agentName.includes('technical')) {
        result.technical = {
          score: normalizeScore(agent.score),
          strengths: agent.strengths || [],
          concerns: agent.concerns || [],
          gaps: agent.gaps || [],
          contradictions: agent.contradictions || []
        };
      } else if (agentName.includes('behavioral')) {
        result.behavioral = {
          score: normalizeScore(agent.score),
          strengths: agent.strengths || [],
          concerns: agent.concerns || [],
          gaps: agent.gaps || [],
          contradictions: agent.contradictions || []
        };
      } else if (agentName.includes('claim')) {
        result.claims = {
          score: normalizeScore(agent.score),
          strengths: agent.strengths || [],
          concerns: agent.concerns || [],
          gaps: agent.gaps || [],
          contradictions: agent.contradictions || []
        };
      }
    });

    // Ensure all required agents have data (fallback to 0 if missing)
    if (!result.resume) result.resume = { score: 0, strengths: [], concerns: [], gaps: [], contradictions: [] };
    if (!result.technical) result.technical = { score: 0, strengths: [], concerns: [], gaps: [], contradictions: [] };
    if (!result.behavioral) result.behavioral = { score: 0, strengths: [], concerns: [], gaps: [], contradictions: [] };
    if (!result.claims) result.claims = { score: 0, strengths: [], concerns: [], gaps: [], contradictions: [] };

    // Add consensus data - also normalize the final score
    const finalScore = normalizeScore(apiData.candidateAssessment?.averageScore || apiData.consensus?.finalScore || 0);
    
    result.consensus = {
      finalScore: finalScore,
      confidenceLevel: apiData.candidateAssessment?.confidenceLevel || apiData.consensus?.confidenceLevel || 80,
      verdict: apiData.candidateAssessment?.verdict || apiData.consensus?.recommendation || 'No Decision',
      summary: apiData.candidateAssessment?.summary || apiData.consensus?.summary || 'Evaluation complete'
    };

    console.log('Transformed Result:', {
      resume: result.resume.score,
      technical: result.technical.score,
      behavioral: result.behavioral.score,
      claims: result.claims.score,
      final: result.consensus.finalScore
    });

    return result;
  };

  const handleEvaluate = async () => {
    setLoading(true);

    // Validate we have required data
    if (!resumeData.content || !jobData.description) {
      console.error('Missing required data for evaluation:', {
        hasResume: !!resumeData.content,
        hasJobDescription: !!jobData.description,
        hasTranscript: !!transcript
      });
      setResults(MOCK_EVALUATION_RESULT);
      setLoading(false);
      return;
    }

    try {
      console.log('Starting evaluation with data:', {
        resumeLength: resumeData.content?.length || 0,
        transcriptLength: transcript?.length || 0,
        jobDescriptionLength: jobData.description?.length || 0
      });

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData.content,
          transcript: transcript || 'No transcript provided',
          jobDescription: jobData.description
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Evaluation failed: ${response.status} - ${errorText}`);
      }

      const apiData = await response.json();
      console.log('API Response:', apiData);

      const transformedData = transformApiResponse(apiData);
      console.log('Transformed Data:', transformedData);

      setResults(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Evaluation failed:', error);
      // Fallback to mock data if API fails
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
    // setAiInterviewData(null);
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

            {/* STEP 3 - AI Interview Agent */}
            {currentStep === 3 && (
              <AIInterviewAgent
                data={{
                  questions,
                  selectedRole: { id: jobData.role },
                  resumeContent: resumeData.content,
                }}
                onNext={(data) => {
                  const nextTranscript = buildTranscriptFromInterview(
                    data?.interviewConversation
                  );
                  if (nextTranscript) {
                    setTranscript(nextTranscript);
                  }
                  handleFinalSubmit();
                }}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* STEP 4 - Evaluation Results */}
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

                    <div className="flex justify-between items-center pt-8">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Interview
                      </button>
                      
                      <button
                        onClick={resetApp}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
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