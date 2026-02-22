import { useState, useEffect } from 'react';
import { MessageSquare, Code, Users, Database, Lightbulb, ArrowRight, ArrowLeft, Sparkles, RefreshCw, Loader2, Shuffle } from 'lucide-react';

const categoryIcons = {
  'Technical': Code,
  'Behavioral': Users,
  'System Design': Database,
  'Problem Solving': Lightbulb,
};

const categoryColors = {
  'Technical': 'bg-blue-100 text-blue-700 border-blue-200',
  'Behavioral': 'bg-purple-100 text-purple-700 border-purple-200',
  'System Design': 'bg-orange-100 text-orange-700 border-orange-200',
  'Problem Solving': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

// Fallback questions when API is not available
const fallbackQuestions = {
  'backend': [
    { id: 1, text: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?', category: 'Technical' },
    { id: 2, text: 'Describe your experience with database optimization. How do you handle slow queries?', category: 'Technical' },
    { id: 3, text: 'Walk me through how you would design a rate-limiting system for an API.', category: 'System Design' },
    { id: 4, text: 'How do you ensure security in your backend applications?', category: 'Technical' },
    { id: 5, text: 'Describe a challenging bug you encountered and how you resolved it.', category: 'Problem Solving' },
    { id: 6, text: 'How do you handle database transactions in distributed systems?', category: 'Technical' },
    { id: 7, text: 'Tell me about a time you had to work with a difficult team member.', category: 'Behavioral' },
    { id: 8, text: 'How do you stay updated with new technologies in backend development?', category: 'Behavioral' },
  ],
  'frontend': [
    { id: 1, text: 'Explain the virtual DOM and why React uses it.', category: 'Technical' },
    { id: 2, text: 'How do you optimize React application performance?', category: 'Technical' },
    { id: 3, text: 'Design a search autocomplete component. What considerations would you have?', category: 'System Design' },
    { id: 4, text: 'Explain CSS-in-JS vs traditional CSS. What are the pros and cons?', category: 'Technical' },
    { id: 5, text: 'How do you handle state management in large applications?', category: 'Technical' },
    { id: 6, text: 'Describe your approach to making applications accessible.', category: 'Technical' },
    { id: 7, text: 'Tell me about a time you had a conflict with a designer.', category: 'Behavioral' },
    { id: 8, text: 'How do you test your frontend code?', category: 'Technical' },
  ],
  'data': [
    { id: 1, text: 'Explain the difference between OLAP and OLTP systems.', category: 'Technical' },
    { id: 2, text: 'How do you handle missing data in a dataset?', category: 'Technical' },
    { id: 3, text: 'Design a data pipeline that processes real-time streaming data.', category: 'System Design' },
    { id: 4, text: 'What is the difference between batch processing and stream processing?', category: 'Technical' },
    { id: 5, text: 'How do you ensure data quality in your pipelines?', category: 'Technical' },
    { id: 6, text: 'Describe your experience with ETL processes.', category: 'Technical' },
    { id: 7, text: 'Tell me about a time you had to work with unclean data.', category: 'Behavioral' },
    { id: 8, text: 'What tools do you use for data visualization?', category: 'Technical' },
  ],
  'ai-ml': [
    { id: 1, text: 'Explain the difference between supervised and unsupervised learning.', category: 'Technical' },
    { id: 2, text: 'How do you handle overfitting in machine learning models?', category: 'Technical' },
    { id: 3, text: 'Design a recommendation system for an e-commerce platform.', category: 'System Design' },
    { id: 4, text: 'What is the purpose of regularization in machine learning?', category: 'Technical' },
    { id: 5, text: 'How do you evaluate the performance of a classification model?', category: 'Technical' },
    { id: 6, text: 'Explain the bias-variance tradeoff.', category: 'Technical' },
    { id: 7, text: 'Tell me about a machine learning project you led from start to finish.', category: 'Behavioral' },
    { id: 8, text: 'What is your approach to feature engineering?', category: 'Technical' },
  ],
  'devops': [
    { id: 1, text: 'Explain the difference between Docker and Kubernetes.', category: 'Technical' },
    { id: 2, text: 'How do you handle secrets management in your CI/CD pipeline?', category: 'Technical' },
    { id: 3, text: 'Design a CI/CD pipeline for a microservices architecture.', category: 'System Design' },
    { id: 4, text: 'What is Infrastructure as Code and why is it important?', category: 'Technical' },
    { id: 5, text: 'How do you monitor application health in production?', category: 'Technical' },
    { id: 6, text: 'Explain the concept of blue-green deployment.', category: 'Technical' },
    { id: 7, text: 'Tell me about a time you had to respond to a production outage.', category: 'Behavioral' },
    { id: 8, text: 'What tools do you use for container orchestration?', category: 'Technical' },
  ],
};

const extractTechStack = (resumeText) => {
  if (!resumeText) return [];
  const techKeywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST', 'API', 'Git', 'CI/CD', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Spark', 'Kafka', 'Airflow'];
  return techKeywords.filter(tech => resumeText.toLowerCase().includes(tech.toLowerCase()));
};

export default function QuestionGenerator({ data, onNext, onBack }) {
  const [questions, setQuestions] = useState(data?.questions || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const role = data?.selectedRole?.id || 'backend';

  useEffect(() => {
    if (!questions.length) {
      generateQuestions();
    }
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: role,
          resumeText: data?.resumeContent || '',
        }),
      });

      const result = await response.json();

      if (result.success && result.questions) {
        setQuestions(result.questions);
      } else {
        // Use fallback questions
        console.log('Using fallback questions');
        const fallback = fallbackQuestions[role] || fallbackQuestions['backend'];
        setQuestions([...fallback].sort(() => Math.random() - 0.5));
      }
    } catch (err) {
      console.error('Question generation error:', err);
      // Use fallback questions on error
      const fallback = fallbackQuestions[role] || fallbackQuestions['backend'];
      setQuestions([...fallback].sort(() => Math.random() - 0.5));
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateQuestions = () => {
    generateQuestions();
  };

  const shuffleQuestions = () => {
    // Create a shuffled copy of the questions array
    const shuffled = [...questions];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Re-assign IDs to maintain uniqueness after shuffle
    const reindexed = shuffled.map((q, idx) => ({
      ...q,
      id: idx + 1
    }));
    
    setQuestions(reindexed);
  };

  const handleStartRecording = () => {
    onNext({ questions });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Questions Generated</h2>
        <p className="text-gray-500">AI-powered questions tailored to the role and resume</p>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-lg font-medium text-gray-700">Generating Questions...</p>
          <p className="text-gray-500">This may take a moment</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {questions.map((question, index) => {
              const Icon = categoryIcons[question.category] || Code;
              const colorClass = categoryColors[question.category] || categoryColors['Technical'];
              
              return (
                <div key={question.id || index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-indigo-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium leading-relaxed">{question.text}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                          <div className="flex items-center gap-1">
                            <Icon size={12} />
                            {question.category}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regenerate and Shuffle Buttons */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={shuffleQuestions}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50 whitespace-nowrap"
            >
              <Shuffle size={18} />
              Shuffle
            </button>
            <button
              onClick={regenerateQuestions}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50 whitespace-nowrap"
            >
              <RefreshCw size={18} />
              Regenerate
            </button>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={handleStartRecording}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
        >
          <MessageSquare size={20} />
          <span>Start Interview</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
