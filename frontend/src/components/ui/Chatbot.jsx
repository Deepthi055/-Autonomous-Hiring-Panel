import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Code, Users, Database, Lightbulb, RefreshCw } from 'lucide-react';

const suggestedQuestions = [
  'Generate more technical questions',
  'Generate questions based on tech stack',
  'Give system design questions',
  'Add behavioral questions',
];

// Fallback responses when API is not available
const fallbackResponses = {
  'technical': [
    { id: 100, text: 'Here are some technical questions:\n\n1. Explain the SOLID principles in detail.\n2. How would you optimize a database query taking 10+ seconds?\n3. What are the best practices for error handling in production?', category: 'Technical' },
  ],
  'system design': [
    { id: 200, text: 'Here are some system design questions:\n\n1. Design a URL shortening service like bit.ly. What are the key components?\n2. How would you design a real-time chat application supporting millions of users?\n3. Design a distributed caching system.', category: 'System Design' },
  ],
  'behavioral': [
    { id: 300, text: 'Here are some behavioral questions:\n\n1. Tell me about a time you had a conflict with a team member. How did you resolve it?\n2. Describe a situation where you had to meet a tight deadline.\n3. Tell me about a time you failed. What did you learn from it?', category: 'Behavioral' },
  ],
  'tech stack': [
    { id: 400, text: 'Here are questions about tech stacks:\n\n1. What are the pros and cons of using Redux vs Context API?\n2. Explain the architecture of a microservices architecture.\n3. How do you handle versioning in your APIs?', category: 'Technical' },
  ],
  'default': [
    { id: 1, text: 'I can help you generate more interview questions. Here are some suggestions:\n\n1. What are your greatest strengths and weaknesses?\n2. Where do you see yourself in 5 years?\n3. Why do you want to work for our company?' },
  ]
};

const generateDynamicQuestion = (type, role, currentQuestions) => {
  return fallbackResponses[type] || fallbackResponses['default'];
};

export default function Chatbot({ isOpen, onClose, onAddQuestions, currentQuestions = [], role = 'backend' }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI interview assistant. I can help you:\n\n• Generate more interview questions\n• Add questions based on specific topics\n• Provide tips for answering questions\n\nWhat would you like help with?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Enforce recruiter assistant persona
      const recruiterPrompt = `Act as an expert technical recruiter assistant. The user (recruiter) is asking: "${inputValue}".
      Generate relevant interview questions for the recruiter to ask the candidate based on this input.
      Do NOT answer the question yourself. Provide a list of questions to assess the candidate.`;

      const response = await fetch('/api/interview/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: recruiterPrompt,
          context: `Role: ${role}, Current Questions: ${currentQuestions.length}`,
        }),
      });

      const result = await response.json();

      if (result.success && result.response) {
        const botMessage = {
          id: Date.now() + 1,
          text: result.response,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Use fallback response
        const fallback = getFallbackResponse(inputValue);
        const botMessage = {
          id: Date.now() + 1,
          text: fallback,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      // Use fallback response on error
      const fallback = getFallbackResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: fallback,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getFallbackResponse = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('technical')) {
      return fallbackResponses['technical'][0].text;
    } else if (lowerPrompt.includes('system design')) {
      return fallbackResponses['system design'][0].text;
    } else if (lowerPrompt.includes('behavioral')) {
      return fallbackResponses['behavioral'][0].text;
    } else if (lowerPrompt.includes('tech stack') || lowerPrompt.includes('technology')) {
      return fallbackResponses['tech stack'][0].text;
    } else {
      return fallbackResponses['default'][0].text;
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />
      
      {/* Chat Panel */}
      <div className="relative w-full max-w-md h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-white/70">Interview Helper</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${message.isBot ? '' : 'order-2'}`}>
                {message.isBot && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                  </div>
                )}
                <div className={`p-3 rounded-2xl ${message.isBot ? 'bg-gray-100 rounded-bl-sm' : 'bg-indigo-600 text-white rounded-br-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
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
    </div>
  );
}
