import React, { useEffect, useState } from 'react';
import { RotateCcw, Loader2, BarChart2 } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import { generateEvaluation } from '../utils/aiUtils';

const EvaluationPage = ({
    selectedRole,
    resumeContent,
    transcript,
    evaluationData,
    setEvaluationData,
    onRestart,
}) => {
    const [isLoading, setIsLoading] = useState(!evaluationData);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!evaluationData) {
            // Simulate multi-agent evaluation with progress
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 15 + 5;
                if (p >= 100) {
                    p = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        const result = generateEvaluation(selectedRole, resumeContent, transcript);
                        setEvaluationData(result);
                        setIsLoading(false);
                    }, 400);
                }
                setProgress(Math.min(p, 100));
            }, 300);
            return () => clearInterval(interval);
        }
    }, []);

    const AGENT_STEPS = [
        { label: 'Resume Agent', color: 'text-indigo-400' },
        { label: 'Technical Agent', color: 'text-violet-400' },
        { label: 'Behavioral Agent', color: 'text-emerald-400' },
        { label: 'Claims Agent', color: 'text-cyan-400' },
        { label: 'Consensus Engine', color: 'text-amber-400' },
    ];

    return (
        <div className="step-enter space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 p-6 flex-1 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                    <div className="p-2 bg-indigo-500/15 rounded-lg">
                        <BarChart2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-semibold text-sm">AI Evaluation Dashboard</h2>
                        <p className="text-slate-500 text-xs">Multi-agent analysis results for {selectedRole}</p>
                    </div>
                    <div className="ml-auto">
                        <button
                            id="btn-restart"
                            onClick={onRestart}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200
                border border-slate-700/50 hover:border-slate-600 transition-all text-xs font-medium"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            New Evaluation
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center gap-6 py-12 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-200 font-semibold">Running AI Evaluation</p>
                        <p className="text-slate-500 text-sm mt-1">Multi-agent analysis in progress...</p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-sm space-y-2">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-xs text-center">{Math.round(progress)}%</p>
                    </div>

                    {/* Agent steps */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {AGENT_STEPS.map((agent, i) => {
                            const threshold = (i + 1) * 20;
                            const isActive = progress >= threshold - 20 && progress < threshold;
                            const isDone = progress >= threshold;
                            return (
                                <span
                                    key={agent.label}
                                    className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                    transition-all duration-300
                    ${isDone
                                            ? `${agent.color} bg-opacity-10 border-opacity-30 opacity-100`
                                            : isActive
                                                ? `${agent.color} bg-opacity-20 border-opacity-50 animate-pulse`
                                                : 'text-slate-600 border-slate-700/30 opacity-40'
                                        }
                    border-current bg-current
                  `}
                                >
                                    {isDone ? '' : isActive ? '' : ''}
                                    {agent.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dashboard */}
            {!isLoading && evaluationData && (
                <Dashboard data={evaluationData} />
            )}
        </div>
    );
};

export default EvaluationPage;
