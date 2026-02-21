import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, RefreshCw, Loader2, Code, Users, Database, Lightbulb } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const FALLBACK_QUESTIONS = {
  'backend': [
    { id: 1, text: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?', category: 'Technical' },
    { id: 2, text: 'Describe your experience with database optimization. How do you handle slow queries?', category: 'Technical' },
    { id: 3, text: 'Walk me through how you would design a rate-limiting system for an API.', category: 'System Design' },
    { id: 4, text: 'How do you ensure security in your backend applications?', category: 'Technical' },
    { id: 5, type: 'Behavioral', text: 'Describe a time you had a conflict with a team member.', category: 'Behavioral' },
  ],
  'frontend': [
    { id: 1, text: 'Explain the virtual DOM and why React uses it.', category: 'Technical' },
    { id: 2, text: 'How do you optimize React application performance?', category: 'Technical' },
    { id: 3, text: 'Design a search autocomplete component. What considerations would you have?', category: 'System Design' },
    { id: 4, text: 'Explain CSS-in-JS vs traditional CSS. What are the pros and cons?', category: 'Technical' },
    { id: 5, type: 'Behavioral', text: 'Tell me about a time you had a conflict with a designer.', category: 'Behavioral' },
  ],
  'data': [
    { id: 1, text: 'Explain the difference between OLAP and OLTP systems.', category: 'Technical' },
    { id: 2, text: 'How do you handle missing data in a dataset?', category: 'Technical' },
    { id: 3, text: 'Design a data pipeline that processes real-time streaming data.', category: 'System Design' },
    { id: 4, text: 'What is the difference between batch processing and stream processing?', category: 'Technical' },
    { id: 5, type: 'Behavioral', text: 'Tell me about a time you had to work with unclean data.', category: 'Behavioral' },
  ],
  'default': [
    { id: 1, text: 'What are your greatest strengths and weaknesses?', category: 'Behavioral' },
    { id: 2, text: 'Describe a challenging project you worked on.', category: 'Experience' },
    { id: 3, text: 'How do you handle tight deadlines?', category: 'Behavioral' },
    { id: 4, text: 'Where do you see yourself in 5 years?', category: 'General' },
    { id: 5, text: 'Why do you want to work for our company?', category: 'General' },
  ]
};

const categoryColors = {
  'Technical': 'bg-blue-100 text-blue-700 border-blue-200',
  'Behavioral': 'bg-purple-100 text-purple-700 border-purple-200',
  'System Design': 'bg-orange-100 text-orange-700 border-orange-200',
  'Problem Solving': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Experience': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'General': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function QuestionGenerator({ data, onNext, onBack }) {
  const { isDark } = useTheme();
  const [questions, setQuestions] = useState(data?.questions || []);
  const [loading, setLoading] = useState(!data?.questions || data.questions.length === 0);
  
  // Extract data from props (handling both direct props and data object pattern)
  const role = data?.selectedRole?.id || 'backend';
  const resumeText = data?.resumeContent || '';

  useEffect(() => {
    if (!questions || questions.length === 0) {
      generateQuestions();
    }
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      console.log('Generating questions for role:', role);
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: role,
          resumeText: resumeText,
        }),
      });

      const result = await response.json();

      if (result.success && result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        // Update parent state if needed via a callback if provided, 
        // but here we manage local state and pass to onNext
      } else {
        throw new Error('No questions returned');
      }
    } catch (error) {
      console.error('Failed to generate questions, using fallback:', error);
      const fallback = FALLBACK_QUESTIONS[role] || FALLBACK_QUESTIONS['default'];
      // Shuffle fallback to simulate regeneration
      setQuestions([...fallback].sort(() => Math.random() - 0.5));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Pass generated questions to the next step
    onNext({ questions });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-6 animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI is analyzing the resume and generating questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Generated Questions</h2>
        <button 
          onClick={generateQuestions}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 text-indigo-400 hover:bg-gray-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
        >
          <RefreshCw size={16} /> Regenerate
        </button>
      </div>

      <div className="grid gap-4">
        {questions.map((q, idx) => {
          const category = q.category || q.type || 'General';
          const colorClass = categoryColors[category] || categoryColors['General'];
          
          return (
            <div key={q.id || idx} className={`p-5 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-indigo-500' : 'bg-white border-indigo-500'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2 inline-block border ${colorClass}`}>
                {category}
              </span>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{q.text}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <div className="flex gap-3">
          {onBack && (
            <button onClick={onBack} className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
              Back
            </button>
          )}
          <button 
            onClick={generateQuestions}
            className="px-6 py-3 rounded-xl font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors border border-indigo-200 flex items-center gap-2"
          >
            <RefreshCw size={18} /> Regenerate
          </button>
        </div>
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          Start Interview Recording <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}