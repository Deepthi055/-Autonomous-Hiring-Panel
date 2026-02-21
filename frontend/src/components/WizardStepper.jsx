import { Check } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function WizardStepper({ steps, currentStep }) {
  const { isDark } = useTheme();

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} -z-10`} />
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 -z-10"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4 
                  ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                    isCurrent ? 'bg-white border-indigo-600 text-indigo-600' : 
                    `${isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`
                  }`}
              >
                {isCompleted ? <Check size={20} /> : index + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${isCurrent ? 'text-indigo-600' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}