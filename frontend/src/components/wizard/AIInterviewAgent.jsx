import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Send, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function AIInterviewAgent({ data, onNext, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const emptyAnswerText = 'Idea noted.';

  const questions = data?.questions || [];
  const totalQuestions = 5;

  useEffect(() => {
    if (currentQuestionIndex === 0 && conversationHistory.length === 0) {
      // Start with first question
      askQuestion(0);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  const askQuestion = (index) => {
    if (index < questions.length && index < totalQuestions) {
      setConversationHistory(prev => [
        ...prev,
        {
          type: 'agent',
          message: questions[index].text,
          category: questions[index].category,
          timestamp: new Date().toISOString(),
        }
      ]);

    }
  };

  const handleSendAnswer = async (overrideAnswer) => {
    const answerToSend = (overrideAnswer ?? userAnswer).trim();
    if (!answerToSend) return;

    // Add user's answer to conversation
    setConversationHistory(prev => [
      ...prev,
      {
        type: 'user',
        message: answerToSend,
        timestamp: new Date().toISOString(),
      }
    ]);

    setIsProcessing(true);
    const currentAnswer = answerToSend;
    setUserAnswer('');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to next question or finish
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < totalQuestions && nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      askQuestion(nextIndex);
    } else {
      // Interview complete
      setConversationHistory(prev => [
        ...prev,
        {
          type: 'agent',
          message: 'Thank you for completing the interview! Your responses have been recorded.',
          isComplete: true,
          timestamp: new Date().toISOString(),
        }
      ]);
    }

    setIsProcessing(false);
  };

  const handleSkipAnswer = async () => {
    await handleSendAnswer(emptyAnswerText);
  };

  const startVoiceRecognition = () => {
    if (isListening || isProcessing) return;

    setIsListening(true);

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(prev => (prev + ' ' + transcript).trim());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = async () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Voice input not supported:', error);
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
      setIsListening(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  const isInterviewComplete = currentQuestionIndex >= totalQuestions - 1 && 
    conversationHistory.some(msg => msg.isComplete);

  const handleFinish = () => {
    onNext({ 
      interviewConversation: conversationHistory,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Interview (Interviewer-Driven)</h2>
            <p className="text-gray-600">Interviewer controls the flow • Question {Math.min(currentQuestionIndex + 1, totalQuestions)} of {totalQuestions}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Conversation Area */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
          {conversationHistory.map((entry, index) => (
            <div 
              key={index}
              className={`mb-4 flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  entry.type === 'agent' 
                    ? 'bg-white border border-gray-200 shadow-sm' 
                    : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {entry.type === 'agent' ? (
                    <Bot className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  ) : (
                    <User className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {entry.category && (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                        entry.type === 'agent' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-white/20 text-white'
                      }`}>
                        {entry.category}
                      </span>
                    )}
                    <p className={entry.type === 'agent' ? 'text-gray-800' : 'text-white'}>
                      {entry.message}
                    </p>
                    {entry.isComplete && (
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Interview Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <p className="text-gray-600">Processing your answer...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {!isInterviewComplete && (
          <div className="mb-6">
            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Interviewer note (optional)... (Press Enter to send, Shift+Enter for new line)"
                className="w-full p-4 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="4"
                disabled={isProcessing || isListening}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                {!isListening ? (
                  <button
                    onClick={startVoiceRecognition}
                    disabled={isProcessing}
                    className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    title="Start voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceRecognition}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Stop voice input"
                  >
                    Stop
                  </button>
                )}
                <button
                  onClick={handleSkipAnswer}
                  disabled={isProcessing || isListening}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Skip"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSendAnswer()}
                  disabled={!userAnswer.trim() || isProcessing || isListening}
                  className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Send answer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {isListening
                ? 'Listening... Interviewer, please speak now'
                : 'Interviewer: click the microphone to start recording'}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {isInterviewComplete && (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg hover:shadow-lg transition-all"
            >
              Continue to Evaluation
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Interviewer tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Capture concise notes for each response</li>
            <li>• Use voice input or type a short summary</li>
            <li>• Skip when no notes are needed</li>
            <li>• There is no time limit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
