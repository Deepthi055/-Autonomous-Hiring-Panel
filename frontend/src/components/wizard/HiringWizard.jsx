import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Stepper from './Stepper';
import JobSetup from './JobSetup';
import ResumeInput from './ResumeInput';
import QuestionGenerator from './QuestionGenerator';
import InterviewRecorder from './InterviewRecorder';
import EvaluationDashboard from './EvaluationDashboard';
import Chatbot from '../ui/Chatbot';

export default function HiringWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleNext = (stepData) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    if (stepData.questions) {
      setQuestions(stepData.questions);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setWizardData({});
    setQuestions([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JobSetup 
            data={wizardData} 
            onNext={handleNext} 
          />
        );
      case 2:
        return (
          <ResumeInput 
            data={wizardData} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 3:
        return (
          <QuestionGenerator 
            data={{...wizardData, questions}} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 4:
        return (
          <InterviewRecorder 
            data={{...wizardData, questions}} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 5:
        return (
          <EvaluationDashboard 
            data={{...wizardData, questions}} 
            onRestart={handleRestart} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">DataVex.ai</h1>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      {currentStep <= 5 && (
        <div className="bg-white border-b border-gray-100">
          <Stepper currentStep={currentStep} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderStep()}
      </main>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center transition-all duration-300 hover:scale-[1.1] z-[40]"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Panel */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)}
        onAddQuestions={(newQuestions) => {
          setQuestions(prev => [...prev, ...newQuestions]);
        }}
        currentQuestions={questions}
        role={wizardData.selectedRole?.id || 'backend'}
      />
    </div>
  );
}
