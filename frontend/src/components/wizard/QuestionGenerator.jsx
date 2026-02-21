import { useState, useEffect } from 'react';
import { MessageSquare, Code, Users, Database, Lightbulb, ArrowRight, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';

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

const generateQuestionsForRole = (role, resumeContent) => {
  const techStack = extractTechStack(resumeContent);
  
  const questions = {
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
      { id: 2, describe: 'How do you optimize React application performance?', category: 'Technical' },
      { id: 3, text: 'Design a search autocomplete component. What considerations would you have?', category: 'System Design' },
      { id: 4, text: 'Explain CSS-in-JS vs traditional CSS. What are the pros and cons?', category: 'Technical' },
      { id: 5, text: 'How do you handle state management in large applications?', category: 'Technical' },
      { id: 6, text: 'Describe your approach to making applications accessible.', category: 'Technical' },
      { id: 7, text: 'Tell me about a time you had to meet a tight deadline.', category: 'Behavioral' },
      { id: 8, text: 'How do you handle feedback about your code?', category: 'Behavioral' },
    ],
    'data': [
      { id: 1, text: 'Explain the difference between ETL and ELT pipelines.', category: 'Technical' },
      { id: 2, text: 'How do you handle missing or corrupted data in a pipeline?', category: 'Technical' },
      { id: 3, text: 'Design a data pipeline that processes millions of records daily.', category: 'System Design' },
      { id: 4, text: 'What tools do you use for data quality monitoring?', category: 'Technical' },
      { id: 5, text: 'Explain data modeling concepts: Star schema vs Snowflake schema.', category: 'Technical' },
      { id: 6, text: 'How do you optimize slow data queries?', category: 'Problem Solving' },
      { id: 7, text: 'Tell me about a time you had to present complex data to non-technical stakeholders.', category: 'Behavioral' },
      { id: 8, text: 'How do you ensure data governance and compliance?', category: 'Technical' },
    ],
    'ai-ml': [
      { id: 1, text: 'Explain the difference between supervised and unsupervised learning.', category: 'Technical' },
      { id: 2, text: 'How do you handle overfitting in machine learning models?', category: 'Technical' },
      { id: 3, text: 'Design a recommendation system for an e-commerce platform.', category: 'System Design' },
      { id: 4, text: 'What metrics do you use to evaluate classification models?', category: 'Technical' },
      { id: 5, text: 'Explain the bias-variance tradeoff.', category: 'Technical' },
      { id: 6, text: 'How do you deploy and monitor ML models in production?', category: 'Technical' },
      { id: 7, text: 'Tell me about a machine learning project that failed. What did you learn?', category: 'Behavioral' },
      { id: 8, text: 'How do you stay updated with the latest AI/ML research?', category: 'Behavioral' },
    ],
    'devops': [
      { id: 1, text: 'Explain the CI/CD pipeline and its key components.', category: 'Technical' },
      { id: 2, text: 'How do you handle secrets management in your infrastructure?', category: 'Technical' },
      { id: 3, text: 'Design a highly available architecture for a web application.', category: 'System Design' },
      { id: 4, text: 'What monitoring and alerting tools have you used?', category: 'Technical' },
      { id: 5, text: 'Explain Kubernetes architecture and its main components.', category: 'Technical' },
      { id: 6, text: 'How do you handle database migrations in a production environment?', category: 'Problem Solving' },
      { id: 7, text: 'Tell me about a time you had a production outage. How did you handle it?', category: 'Behavioral' },
      { id: 8, text: 'How do you balance speed of deployment with system stability?', category: 'Behavioral' },
    ],
  };

  return questions[role] || questions['backend'];
};

const extractTechStack = (resumeContent) => {
  const commonTech = ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'TypeScript'];
  const found = commonTech.filter(tech => 
    resumeContent.toLowerCase().includes(tech.toLowerCase())
  );
  return found;
};

export default function QuestionGenerator({ onNext, onBack, data }) {
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI generating questions
    const timer = setTimeout(() => {
      const generatedQuestions = generateQuestionsForRole(data?.selectedRole?.id || 'backend', data?.resumeContent || '');
      setQuestions(generatedQuestions);
      setIsGenerating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data?.selectedRole, data?.resumeContent]);

  const regenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setIsGenerating(false);
    }, 800);
  };

  const handleStartRecording = () => {
    onNext({ questions });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Generated Interview Questions</h2>
        <p className="text-gray-500">
          Questions generated based on {data?.selectedRole?.name || 'selected role'} and resume content
        </p>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={32} className="text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Generating intelligent questions...</p>
          <p className="text-gray-400 text-sm mt-2">Analyzing resume and job requirements</p>
        </div>
      ) : (
        <>
          {/* Questions Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {questions.map((question, index) => {
              const Icon = categoryIcons[question.category] || Code;
              const colorClass = categoryColors[question.category] || categoryColors['Technical'];
              
              return (
                <div 
                  key={question.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
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

          {/* Regenerate Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={regenerateQuestions}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Regenerate Questions
            </button>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="
            flex items-center gap-2 bg-gray-100 hover:bg-gray-200
            text-gray-700 font-semibold py-3 px-6 rounded-xl
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={handleStartRecording}
          disabled={isGenerating}
          className="
            flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 
            text-white font-semibold py-3 px-8 rounded-xl
            transition-all duration-200 shadow-lg shadow-indigo-200
            hover:shadow-xl hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <MessageSquare size={20} />
          Start Interview Recording
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
