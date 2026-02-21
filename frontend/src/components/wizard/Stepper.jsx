import { Check, Circle } from 'lucide-react';

const steps = [
  { id: 1, name: 'Job Setup', description: 'Enter job details' },
  { id: 2, name: 'Resume Input', description: 'Add candidate resume' },
  { id: 3, name: 'Questions', description: 'AI-generated questions' },
  { id: 4, name: 'Recording', description: 'Interview recording' },
  { id: 5, name: 'Evaluation', description: 'Results & analytics' },
];

export default function Stepper({ currentStep = 1 }) {
  return (
    <div className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10" />
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full -z-10 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                    ${isCompleted 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : isCurrent 
                        ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <Circle size={20} strokeWidth={2} fill={isCurrent ? '#4f46e5' : 'transparent'} />
                  )}
                </div>
                <div className="absolute top-14 flex flex-col items-center w-24">
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                  <span className="text-[10px] text-gray-400 text-center hidden sm:block">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
