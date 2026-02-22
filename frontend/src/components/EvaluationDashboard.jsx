import { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCard from './SummaryCard';
import PerformanceChart from './PerformanceChart';
import ResultsDashboard from './ResultsDashboard';

export default function EvaluationDashboard({ data }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!data) return;

      setLoading(true);
      setError(null);

      try {
        // Add axios API call inside useEffect
        const response = await axios.post('/api/evaluate', data);
        
        // Transform backend response to component-friendly format
        const transformedData = transformBackendResponse(response.data);
        
        // Store response in state
        setResults(transformedData);
      } catch (err) {
        console.error('Evaluation failed:', err);
        setError(err.response?.data?.error || err.message || 'Failed to evaluate candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [data]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold">Evaluating Candidate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 rounded-xl border border-red-200">
        <p className="font-semibold">Evaluation Error</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      <SummaryCard data={results} />
      <div className="w-full">
        <PerformanceChart data={results} />
      </div>
      <ResultsDashboard data={(() => {
        const { consensus, ...agentResults } = results;
        return agentResults;
      })()} />
      
      <div className="flex justify-center pt-8">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
        >
          Start New Evaluation
        </button>
      </div>
    </div>
  );
}