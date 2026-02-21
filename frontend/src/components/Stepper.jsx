import React from 'react';
import { CheckCircle } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Job Setup' },
    { id: 2, label: 'Resume' },
    { id: 3, label: 'Questions' },
    { id: 4, label: 'Interview' },
    { id: 5, label: 'Evaluation' },
];

const Stepper = ({ currentStep }) => {
    return (
        <div className="flex items-center justify-center w-full mb-8 px-4">
            {STEPS.map((step, idx) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isUpcoming = currentStep < step.id;

                return (
                    <React.Fragment key={step.id}>
                        {/* Step Node */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 relative z-10
                  ${isCompleted
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : isCurrent
                                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40 scale-110'
                                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <span>{step.id}</span>
                                )}
                            </div>
                            <span
                                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'}
                `}
                            >
                                {step.label}
                            </span>
                            {/* Active pulse */}
                            {isCurrent && (
                                <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-indigo-500/30 animate-ping" />
                            )}
                        </div>

                        {/* Connector Line */}
                        {idx < STEPS.length - 1 && (
                            <div
                                className={`
                  flex-1 h-0.5 mx-2 mt-[-18px] transition-all duration-500
                  ${currentStep > step.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                                        : 'bg-slate-800'
                                    }
                `}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;
