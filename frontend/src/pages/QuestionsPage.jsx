import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Sparkles, RotateCcw, Cpu } from 'lucide-react';
import QuestionList from '../components/QuestionList';
import Chatbot from '../components/Chatbot';
import { generateQuestions, extractTechStack } from '../utils/aiUtils';

const QuestionsPage = ({
    selectedRole,
    resumeContent,
    questions,
    setQuestions,
    onContinue,
    onBack,
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [techStack, setTechStack] = useState([]);
    const [hasGenerated, setHasGenerated] = useState(questions.length > 0);

    useEffect(() => {
        if (!hasGenerated && resumeContent) {
            handleGenerate();
        }
        setTechStack(extractTechStack(resumeContent, selectedRole));
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        setHasGenerated(false);
        setTimeout(() => {
            const generated = generateQuestions(selectedRole, resumeContent);
            setQuestions(generated);
            setHasGenerated(true);
            setIsGenerating(false);
        }, 1500);
    };

    const handleChatQuestions = (newQuestions) => {
        setQuestions(prev => {
            const existingIds = new Set(prev.map(q => q.id));
            const unique = newQuestions.filter(q => !existingIds.has(q.id));
            return [...prev, ...unique];
        });
    };

    return (
        <div className="step-enter space-y-6">
            {/* Header */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/15 rounded-lg">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-slate-200 font-semibold text-sm">AI Generated Questions</h2>
                            <p className="text-slate-500 text-xs">Based on {selectedRole} role and resume</p>
                        </div>
                    </div>
                    <button
                        id="btn-regenerate"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-700/50 border border-slate-600/30
              text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all disabled:opacity-50"
                    >
                        <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                        Regenerate
                    </button>
                </div>

                {/* Tech Stack Detected */}
                {techStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                            <Cpu className="w-3 h-3" />
                            Detected stack:
                        </span>
                        {techStack.map(tech => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading / Questions */}
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                    <div className="relative">
                        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-300 font-medium">Generating Interview Questions</p>
                        <p className="text-slate-500 text-sm mt-1">AI is analyzing the role and resume...</p>
                    </div>
                    <div className="shimmer h-2 w-48 rounded-full" />
                </div>
            ) : hasGenerated ? (
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                    <QuestionList questions={questions} />
                </div>
            ) : null}

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    id="btn-back-resume"
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200
            border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    id="btn-start-recording"
                    onClick={onContinue}
                    disabled={questions.length === 0 || isGenerating}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                    Start Interview Recording
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Chatbot (floating) */}
            {hasGenerated && (
                <Chatbot role={selectedRole} onQuestionsGenerated={handleChatQuestions} />
            )}
        </div>
    );
};

export default QuestionsPage;
