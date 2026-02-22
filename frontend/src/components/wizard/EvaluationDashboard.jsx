import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, 
  RotateCcw, Target, Brain, Shield, ArrowLeft
} from 'lucide-react';
import ReportGenerator from '../ReportGenerator';

const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981'];

const generateMockEvaluation = (data) => {
  return {
    scores: {
      resume: 0.85,
      technical: 0.78,
      behavioral: 0.82,
      claims: 0.88,
    },
    finalScore: 83,
    confidenceLevel: 82,
    verdict: 'Hire',
    skillAlignment: 78,
    summary: {
      strengths: [
        'Strong experience in React and modern JavaScript frameworks',
        'Excellent problem-solving skills demonstrated',
        'Clear communication and articulation of technical concepts',
        'Relevant industry experience matching job requirements',
      ],
      concerns: [
        'Limited experience with microservices architecture',
        'Could benefit from more cloud infrastructure work',
      ],
      gaps: [
        'Kubernetes and container orchestration',
        'System design for large-scale applications',
      ],
      contradictions: [
        'Resume mentions Python proficiency but technical questions showed limited knowledge',
      ],
    },
  };
};

export default function EvaluationDashboard({ data, onRestart, onBack }) {
  const [evaluation, setEvaluation] = useState(() => generateMockEvaluation(data));
  const [isReevaluating, setIsReevaluating] = useState(false);
  
  const handleReevaluate = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      setEvaluation(generateMockEvaluation(data));
      setIsReevaluating(false);
    }, 1500);
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    }
  };
  
  const handleGoToInterview = () => {
    if (onBack) {
      onBack(4);
    }
  };
  
  const handleGoToQuestions = () => {
    if (onBack) {
      onBack(3);
    }
  };
  
  const handleGoToResume = () => {
    if (onBack) {
      onBack(2);
    }
  };
  
  const handleGoToJobSetup = () => {
    if (onBack) {
      onBack(1);
    }
  };
  
  const barData = [
    { name: 'Resume', score: evaluation.scores.resume * 100, fill: '#4f46e5' },
    { name: 'Technical', score: evaluation.scores.technical * 100, fill: '#8b5cf6' },
    { name: 'Behavioral', score: evaluation.scores.behavioral * 100, fill: '#06b6d4' },
    { name: 'Claims', score: evaluation.scores.claims * 100, fill: '#10b981' },
  ];

  const pieData = [
    { name: 'Matched', value: evaluation.skillAlignment },
    { name: 'Gap', value: 100 - evaluation.skillAlignment },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBadgeColor = (verdict) => {
    if (verdict === 'Hire') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  // Prepare data for ReportGenerator
  const reportData = {
    candidateName: data?.candidateName || 'Candidate',
    candidateEmail: data?.candidateEmail || '',
    evaluationResult: evaluation
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Evaluation Results</h2>
        <p className="text-gray-500">AI-powered candidate assessment and analytics</p>
      </div>

      {/* Top Section - Score & Recommendation */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Circular Score Indicator */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Score</h3>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${evaluation.finalScore * 4.4} 440`} />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(evaluation.finalScore)}`}>
                {evaluation.finalScore}%
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
            <Brain size={16} />
            Confidence: {evaluation.confidenceLevel}%
          </div>
        </div>

        {/* Recommendation Badge */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommendation</h3>
          <div className={`px-8 py-4 rounded-xl border-2 flex items-center gap-3 text-xl font-bold ${getBadgeColor(evaluation.verdict)}`}>
            {evaluation.verdict === 'Hire' ? (
              <><CheckCircle size={32} /> HIRE</>
            ) : (
              <><XCircle size={32} /> NO HIRE</>
            )}
          </div>
          <p className="mt-4 text-gray-500 text-sm text-center">
            Based on comprehensive AI evaluation across all criteria
          </p>
        </div>

        {/* Skill Alignment */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Skill Alignment</h3>
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#e5e7eb'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-sm text-gray-600">{evaluation.skillAlignment}% Match</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Score Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Target size={20} />
            Skill Match Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                    { name: 'Matched Skills', value: evaluation.skillAlignment, color: '#4f46e5' },
                    { name: 'Technical Gaps', value: 22, color: '#f59e0b' },
                  ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={true}>
                  {[
                    { name: 'Matched Skills', value: evaluation.skillAlignment, color: '#4f46e5' },
                    { name: 'Technical Gaps', value: 22, color: '#f59e0b' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Strengths</h4>
          </div>
          <ul className="space-y-2">
            {evaluation.summary.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Concerns</h4>
          </div>
          <ul className="space-y-2">
            {evaluation.summary.concerns.map((concern, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {concern}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <TrendingDown size={18} className="text-rose-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Gaps</h4>
          </div>
          <ul className="space-y-2">
            {evaluation.summary.gaps.map((gap, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>

        {/* Contradictions */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Shield size={18} className="text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Contradictions</h4>
          </div>
          <ul className="space-y-2">
            {evaluation.summary.contradictions.length > 0 ? (
              evaluation.summary.contradictions.map((contradiction, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  {contradiction}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 italic">No contradictions detected</li>
            )}
          </ul>
        </div>
      </div>

      {/* Quick Navigation to Previous Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <h4 className="font-semibold text-gray-700 mb-3">View Previous Steps</h4>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleGoToJobSetup} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">
            Step 1: Job Setup
          </button>
          <button onClick={handleGoToResume} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">
            Step 2: Resume
          </button>
          <button onClick={handleGoToQuestions} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">
            Step 3: Questions
          </button>
          <button onClick={handleGoToInterview} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">
            Step 4: Interview Recording
          </button>
        </div>
      </div>

      {/* Report Generator */}
      <ReportGenerator data={reportData} />

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button onClick={handleGoBack} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
          <ArrowLeft size={20} />
          Back to Interview
        </button>
        
        <button onClick={handleReevaluate} disabled={isReevaluating} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <RotateCcw size={20} className={isReevaluating ? 'animate-spin' : ''} />
          {isReevaluating ? 'Re-evaluating...' : 'Re-evaluate'}
        </button>
        
        <button onClick={onRestart} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02]">
          <RotateCcw size={20} />
          Start New Evaluation
        </button>
      </div>
    </div>
  );
}
