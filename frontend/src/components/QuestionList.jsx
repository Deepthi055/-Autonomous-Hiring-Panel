import React from 'react';
import { Code2, Users, Layers, Cpu } from 'lucide-react';

const CATEGORY_CONFIG = {
    Technical: {
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/30',
        icon: Code2,
    },
    Behavioral: {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        icon: Users,
    },
    'System Design': {
        color: 'text-violet-400',
        bg: 'bg-violet-500/15',
        border: 'border-violet-500/30',
        icon: Layers,
    },
};

const QuestionCard = ({ question, index }) => {
    const config = CATEGORY_CONFIG[question.category] || CATEGORY_CONFIG['Technical'];
    const Icon = config.icon;

    return (
        <div className={`
      flex gap-4 p-5 rounded-xl border bg-slate-800/50 border-slate-700/50
      hover:border-slate-600 transition-all duration-200 group
    `}>
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700/70 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-400">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{question.text}</p>
                {question.techContext && (
                    <p className="text-slate-500 text-xs mt-1.5">
                        Context: <span className="text-indigo-400">{question.techContext}</span>
                    </p>
                )}
            </div>
            <div className="flex-shrink-0">
                <span className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
          ${config.bg} ${config.color} ${config.border}
        `}>
                    <Icon className="w-3 h-3" />
                    {question.category}
                </span>
            </div>
        </div>
    );
};

const QuestionList = ({ questions }) => {
    if (!questions || questions.length === 0) return null;

    const technical = questions.filter(q => q.category === 'Technical');
    const behavioral = questions.filter(q => q.category === 'Behavioral');
    const systemDesign = questions.filter(q => q.category === 'System Design');

    return (
        <div className="space-y-6">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-2">
                {technical.length > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                        <Code2 className="w-3.5 h-3.5" />
                        {technical.length} Technical
                    </span>
                )}
                {behavioral.length > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {behavioral.length} Behavioral
                    </span>
                )}
                {systemDesign.length > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
                        <Layers className="w-3.5 h-3.5" />
                        {systemDesign.length} System Design
                    </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/30 text-slate-400 text-xs font-medium">
                    <Cpu className="w-3.5 h-3.5" />
                    {questions.length} Total
                </span>
            </div>

            {/* Question cards */}
            <div className="space-y-3">
                {questions.map((question, idx) => (
                    <QuestionCard key={question.id} question={question} index={idx} />
                ))}
            </div>
        </div>
    );
};

export default QuestionList;
