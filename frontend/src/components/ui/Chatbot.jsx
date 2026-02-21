import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Code, Users, Database, Lightbulb, RefreshCw } from 'lucide-react';

const suggestedQuestions = [
  'Generate more technical questions',
  'Generate questions based on tech stack',
  'Give system design questions',
  'Add behavioral questions',
];

const generateDynamicQuestion = (type, role, currentQuestions) => {
  const additionalQuestions = {
    'technical': [
      { id: 100, text: `Explain ${role === 'backend' ? 'the SOLID principles' : 'React hooks lifecycle'} in detail.`, category: 'Technical' },
      { id: 101, text: `How would you optimize a ${role === 'data' ? 'slow ETL pipeline' : 'database query taking 10+ seconds'}?`, category: 'Technical' },
      { id: 102, text: `What are the best practices for ${role === 'devops' ? 'infrastructure as code' : 'error handling in production'}?`, category: 'Technical' },
    ],
    'system design': [
      { id: 200, text: 'Design a URL shortening service like bit.ly. What are the key components?', category: 'System Design' },
      { id: 201, text: 'How would you design a real-time chat application supporting millions of users?', category: 'System Design' },
      { id: 202, text: 'Design a distributed caching system. How would you handle cache invalidation?', category: 'System Design' },
    ],
    'behavioral': [
      { id: 300, text: 'Tell me about a time you had a conflict with a team member. How did you resolve it?', category: 'Behavioral' },
      { id: 301, text: 'Describe a situation where you had to meet a tight deadline. How did you handle it?', category: 'Behavioral' },
      { id: 302, text: 'Tell me about a time you failed. What did you learn from it?', category: 'Behavioral' },
    ],
    'tech stack': [
      { id: 400, text: `What are the pros and cons of using ${role === 'frontend' ? 'Redux vs Context API' : 'SQL vs NoSQL databases'}?`, category: 'Technical' },
      { id: 401, text: `Explain the architecture of ${role === 'ai-ml' ? 'a typical ML pipeline' : 'a microservices architecture'}.`, category: 'Technical' },
      { id: 402, text: 'How do you handle versioning in your APIs?', category: 'Technical' },
    ],
  };

  return additionalQuestions[type] || additionalQuestions['technical'];
};

export default function Chatbot({ isOpen, onClose, onAddQuestions, currentQuestions = [], role = 'backend' }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI Hiring Assistant. I can help you generate more interview questions based on your needs. What would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = processUserRequest(inputValue);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserRequest = (input) => {
    const lowerInput = input.toLowerCase();
    let responseContent = '';
    let newQuestions = [];

    if (lowerInput.includes('technical') || lowerInput.includes('more technical')) {
      newQuestions = generateDynamicQuestion('technical', role, currentQuestions);
      responseContent = `Here are 3 additional technical questions for the ${role} role:`;
    } else if (lowerInput.includes('system design')) {
      newQuestions = generateDynamicQuestion('system design', role, currentQuestions);
      responseContent = 'Here are 3 system design questions to test architectural skills:';
    } else if (lowerInput.includes('behavioral')) {
      newQuestions = generateDynamicQuestion('behavioral', role, currentQuestions);
      responseContent = 'Here are 3 behavioral questions to assess soft skills:';
    } else if (lowerInput.includes('tech stack') || lowerInput.includes('technology')) {
      newQuestions = generateDynamicQuestion('tech stack', role, currentQuestions);
      responseContent = 'Here are some questions based on common tech stack requirements:';
    } else {
      responseContent = "I can help you generate different types of questions. Try asking for:\n- Technical questions\n- System design questions\n- Behavioral questions\n- Questions based on tech stack";
    }

    // Add questions to the main list if any
    if (newQuestions.length > 0) {
      onAddQuestions(newQuestions);
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: responseContent,
      questions: newQuestions,
      timestamp: new Date(),
    };
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    handleSend();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical': return Code;
      case 'Behavioral': return Users;
      case 'System Design': return Database;
      default: return Lightbulb;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">AI Assistant</h3>
            <p className="text-xs text-indigo-100">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl p-3
                ${message.type === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }
              `}
            >
              <p className="text-sm">{message.content}</p>
              
              {/* Show questions if any */}
              {message.questions && message.questions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.questions.map((q) => {
                    const Icon = getCategoryIcon(q.category);
                    return (
                      <div
                        key={q.id}
                        className="bg-white/50 rounded-lg p-2 text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <Icon size={14} className="mt-0.5 text-indigo-600" />
                          <span>{q.text}</span>
                        </div>
                        <span className="text-xs text-indigo-500 mt-1 inline-block">
                          {q.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <span className="text-[10px] opacity-60 block mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(q)}
                className="text-xs bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
