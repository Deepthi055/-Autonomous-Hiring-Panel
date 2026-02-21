import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
    TrendingUp, AlertTriangle, Zap, Shield, Target, ChevronRight,
    ThumbsUp, ThumbsDown, CheckCircle, Award, BarChart2
} from 'lucide-react';

// Circular score indicator
const CircularScore = ({ score, size = 160 }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(Math.max(score, 0), 1);
    const offset = circumference * (1 - pct);
    const pctDisplay = Math.round(pct * 100);

    const getColor = (p) => {
        if (p >= 0.8) return ['#10b981', '#06b6d4'];
        if (p >= 0.65) return ['#f59e0b', '#f97316'];
        return ['#ef4444', '#ec4899'];
    };
    const [c1, c2] = getColor(pct);

    return (
        <svg width={size} height={size} viewBox="0 0 130 130">
            <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="100%" stopColor={c2} />
                </linearGradient>
            </defs>
            {/* Background circle */}
            <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
            {/* Progress arc */}
            <circle
                cx="65" cy="65" r={radius}
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 65 65)"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <text x="65" y="60" textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="Inter">
                {pctDisplay}%
            </text>
            <text x="65" y="76" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter">
                Final Score
            </text>
        </svg>
    );
};

const CHART_COLORS = {
    resume: '#6366f1',
    technical: '#8b5cf6',
    behavioral: '#10b981',
    claims: '#06b6d4',
};

const PIE_COLORS = ['#6366f1', '#1e293b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">{Math.round(payload[0].value * 100)}%</p>
            </div>
        );
    }
    return null;
};

const InsightCard = ({ title, items, icon: Icon, colorClass }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className={`p-4 rounded-xl border bg-slate-800/50 ${colorClass}`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" />
                <h4 className="text-sm font-semibold">{title}</h4>
            </div>
            <ul className="space-y-1.5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Dashboard = ({ data }) => {
    if (!data) return null;
    const { resume, technical, behavioral, claims, consensus } = data;

    const barData = [
        { name: 'Resume', score: resume.score, fill: CHART_COLORS.resume },
        { name: 'Technical', score: technical.score, fill: CHART_COLORS.technical },
        { name: 'Behavioral', score: behavioral.score, fill: CHART_COLORS.behavioral },
        { name: 'Claims', score: claims.score, fill: CHART_COLORS.claims },
    ];

    const skillAlignment = consensus.skillAlignment || 78;
    const pieData = [
        { name: 'Aligned', value: skillAlignment },
        { name: 'Gap', value: 100 - skillAlignment },
    ];

    const isHire = consensus.verdict === 'Hire';
    const confidence = Math.round(consensus.confidenceLevel * 100);

    return (
        <div className="step-enter space-y-6">
            {/* Top Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Score card */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700/40 gap-4">
                    <CircularScore score={consensus.finalScore} size={160} />
                    <div className="text-center space-y-2">
                        <span className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border
              ${isHire
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            }
            `}>
                            {isHire ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                            {consensus.verdict}
                        </span>
                        <div className="flex items-center gap-1.5 justify-center">
                            <Shield className="w-3.5 h-3.5 text-slate-500" />
                            <p className="text-slate-500 text-xs">
                                Confidence: <span className="text-indigo-400 font-semibold">{confidence}%</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary + confidence */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40 space-y-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-slate-200 font-semibold text-sm">AI Evaluation Summary</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{consensus.summary}</p>

                    {/* Score breakdown mini bars */}
                    <div className="space-y-2.5 pt-2">
                        {barData.map(item => (
                            <div key={item.name} className="flex items-center gap-3">
                                <span className="text-slate-500 text-xs w-20 flex-shrink-0">{item.name}</span>
                                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.round(item.score * 100)}%`, background: item.fill }}
                                    />
                                </div>
                                <span className="text-slate-400 text-xs font-mono w-10 text-right">
                                    {Math.round(item.score * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart2 className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-slate-200 font-semibold text-sm">Score Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 1]} tickFormatter={v => `${Math.round(v * 100)}%`} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                {barData.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                    <div className="flex items-center gap-2 mb-5">
                        <Target className="w-4 h-4 text-violet-400" />
                        <h3 className="text-slate-200 font-semibold text-sm">Skill Alignment</h3>
                    </div>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={PIE_COLORS[idx]} />
                                    ))}
                                </Pie>
                                <text x="50%" y="47%" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Inter">
                                    {skillAlignment}%
                                </text>
                                <text x="50%" y="55%" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
                                    Aligned
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InsightCard
                    title="Strengths"
                    items={[...resume.strengths, ...behavioral.strengths].slice(0, 4)}
                    icon={TrendingUp}
                    colorClass="border-emerald-500/20 text-emerald-400"
                />
                <InsightCard
                    title="Concerns"
                    items={[...resume.concerns, ...technical.concerns].slice(0, 4)}
                    icon={AlertTriangle}
                    colorClass="border-amber-500/20 text-amber-400"
                />
                <InsightCard
                    title="Skill Gaps"
                    items={[...resume.gaps, ...technical.gaps].slice(0, 4)}
                    icon={Zap}
                    colorClass="border-rose-500/20 text-rose-400"
                />
                <InsightCard
                    title="Claims Verified"
                    items={[...claims.strengths].slice(0, 4)}
                    icon={CheckCircle}
                    colorClass="border-indigo-500/20 text-indigo-400"
                />
            </div>
        </div>
    );
};

export default Dashboard;
