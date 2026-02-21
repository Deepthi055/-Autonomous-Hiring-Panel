import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const FALLBACK_RESPONSES = {
  'technical': 'Here are some technical questions based on the role:\n1. Explain the difference between process and thread.\n2. How does garbage collection work in this language?\n3. What are the ACID properties in databases?',
  'system design': 'Here are some system design questions:\n1. Design a URL shortening service.\n2. How would you design a rate limiter?\n3. Explain consistent hashing.',
  'behavioral': 'Here are some behavioral questions:\n1. Tell me about a time you failed.\n2. How do you handle conflict in a team?\n3. Describe a challenging project you worked on.',
  'sql': 'Here are some SQL related questions:\n1. Explain the difference between INNER JOIN and LEFT JOIN.\n2. How do you optimize a slow query?\n3. What is normalization and denormalization?',
  'react': 'Here are some React questions:\n1. Explain the Virtual DOM.\n2. What are hooks? Name a few common ones.\n3. Difference between state and props.',
  'default': 'I can help you generate more interview questions. Try asking for "System Design questions", "Technical questions", or specific topics like "React" or "SQL".'
};

export default function Chatbot({ onAddQuestions, resumeContent, role }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hi! I can help you generate more interview questions based on the candidate\'s resume. Try asking for "System Design questions" or "React specific questions".' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const getFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('technical')) return FALLBACK_RESPONSES['technical'];
    if (lowerQuery.includes('system') || lowerQuery.includes('design')) return FALLBACK_RESPONSES['system design'];
    if (lowerQuery.includes('behavioral')) return FALLBACK_RESPONSES['behavioral'];
    if (lowerQuery.includes('sql') || lowerQuery.includes('database')) return FALLBACK_RESPONSES['sql'];
    if (lowerQuery.includes('react') || lowerQuery.includes('frontend')) return FALLBACK_RESPONSES['react'];
    return FALLBACK_RESPONSES['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Enforce recruiter assistant persona to generate questions instead of answers
      const recruiterPrompt = `Act as an expert technical recruiter assistant. The user (recruiter) is asking: "${userMsg.text}".
      Generate relevant interview questions for the recruiter to ask the candidate based on this input.
      Do NOT answer the question yourself. Provide a list of questions to assess the candidate.`;

      const response = await fetch('/api/interview/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: recruiterPrompt,
          context: `Role: ${role || 'Software Engineer'}. Resume Content: ${resumeContent ? resumeContent.substring(0, 1500) : 'Not provided'}.`,
        }),
      });

      const result = await response.json();

      if (result.success && result.response) {
        const botMsg = { id: Date.now() + 1, sender: 'bot', text: result.response };
        setMessages(prev => [...prev, botMsg]);
        
        // Optional: If the response looks like a list of questions, we could try to parse and add them
        // For now, we just show them in chat as requested
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback logic
      const fallbackText = getFallbackResponse(userMsg.text);
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: fallbackText + "\n\n(Note: Using offline mode due to connection issue)" 
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`mb-4 w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border animate-slideUp
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">DataVex Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={16} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-bl-none`
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-none ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI..."
                className={`flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}