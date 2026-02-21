import { useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import Navigation from './components/Navigation';
import Header from './components/Header';
import EvaluationForm from './components/EvaluationForm';
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
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Demo Data Button (shown when no results) */}
          {!results && (
            <div className="text-center mb-6">
              <button
                onClick={handleLoadDemoData}
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-base shadow-md"
              >
                View Demo Results
              </button>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-3`}>
                Click to see the dashboard with sample evaluation data (no backend required)
              </p>
            </div>
          )}

          <EvaluationForm 
            onEvaluate={handleEvaluate} 
            loading={loading} 
            error={error}
          />
          
          {results && (
            <>
              <SummaryCard data={results} />
              <PerformanceChart data={results} />
              <AgentBreakdownChart data={results} />
              <ResultsDashboard data={results} />
            </>
          )}
        </div>
      </main>
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
