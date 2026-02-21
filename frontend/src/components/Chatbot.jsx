import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { generateChatResponse } from '../utils/aiUtils';

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="flex gap-1">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="typing-dot w-2 h-2 bg-indigo-400 rounded-full"
                    style={{ animationDelay: `${i * 0.2}s` }}
                />
            ))}
        </div>
        <span className="text-xs text-slate-500 ml-1">AI thinking...</span>
    </div>
);

const ChatMessage = ({ msg }) => {
    const isUser = msg.role === 'user';
    return (
        <div className={`chat-bubble flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`
        flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
        ${isUser ? 'bg-indigo-500/20' : 'bg-violet-500/20'}
      `}>
                {isUser
                    ? <User className="w-3.5 h-3.5 text-indigo-400" />
                    : <Bot className="w-3.5 h-3.5 text-violet-400" />
                }
            </div>
            <div className={`
        max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isUser
                    ? 'bg-indigo-600/70 text-white rounded-tr-sm'
                    : 'bg-slate-700/80 text-slate-200 rounded-tl-sm'
                }
      `}>
                <p style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
            </div>
        </div>
    );
};

const Chatbot = ({ role, onQuestionsGenerated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'init',
            role: 'assistant',
            content: `Hi! I'm your AI hiring assistant. I can help generate more questions for the ${role} interview.\n\nTry asking:\n• "Generate more technical questions"\n• "Give system design questions"\n• "Add behavioral questions"\n• "Generate questions based on tech stack"`,
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const response = generateChatResponse(input.trim(), role, []);
            const botMsg = {
                id: `bot-${Date.now()}`,
                role: 'assistant',
                content: response.text,
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);

            if (response.questions && response.questions.length > 0) {
                onQuestionsGenerated && onQuestionsGenerated(response.questions);
            }
        }, 1200 + Math.random() * 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Floating button when closed
    if (!isOpen) {
        return (
            <button
                id="chatbot-open-btn"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
          flex items-center justify-center shadow-xl shadow-indigo-500/40 hover:scale-110 transition-all duration-200 z-50"
            >
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </button>
        );
    }

    return (
        <div
            className={`
        fixed bottom-6 right-6 z-50 flex flex-col
        bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50
        transition-all duration-300 overflow-hidden
        ${isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[520px]'}
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600/80 to-violet-600/80 border-b border-slate-700/40 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">AI Assistant</p>
                        {!isMinimized && <p className="text-indigo-200 text-xs">Generating questions for {role}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {messages.map(msg => (
                            <ChatMessage key={msg.id} msg={msg} />
                        ))}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-slate-700/50 flex gap-2 flex-shrink-0">
                        <input
                            id="chatbot-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask for more questions..."
                            className="flex-1 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200
                placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                        />
                        <button
                            id="chatbot-send-btn"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white
                hover:from-indigo-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed
                transition-all flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;
