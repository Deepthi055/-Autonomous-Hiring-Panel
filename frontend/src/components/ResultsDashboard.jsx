import {
  FileText,
  Code,
  Users,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

const agentIcons = {
  resume: FileText,
  technical: Code,
  behavioral: Users,
  claims: ShieldCheck,
  consensus: BarChart3,
};

const agentLabels = {
  resume: 'Resume Agent',
  technical: 'Technical Agent',
  behavioral: 'Behavioral Agent',
  claims: 'Claims Agent',
  consensus: 'Consensus Agent',
};

function AgentCard({ agentKey, agentData }) {
  const { isDark } = useTheme();
  const Icon = agentIcons[agentKey];
  const label = agentLabels[agentKey];
  const score = agentData?.score || 0;
  // Handle both 0-1 and 0-100 score formats
  const scorePercentage = Math.round(score > 1 ? score : score * 100);
  const strengths = agentData?.strengths || [];
  const concerns = agentData?.concerns || [];
  const gaps = agentData?.gaps || [];
  const contradictions = agentData?.contradictions || [];

  const getScoreColor = () => {
    if (scorePercentage >= 70) 
      return isDark ? 'text-green-400 bg-green-900 border-green-700' : 'text-green-600 bg-green-50 border-green-200';
    if (scorePercentage >= 50) 
      return isDark ? 'text-yellow-400 bg-yellow-900 border-yellow-700' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return isDark ? 'text-red-400 bg-red-900 border-red-700' : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-300'} overflow-hidden hover:shadow-xl transition duration-200`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} p-6 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon size={28} className="text-indigo-600" />
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</h3>
        </div>
        <div className={`inline-block px-4 py-2 rounded-lg font-bold border-2 ${getScoreColor()}`}>
          {scorePercentage}%
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 space-y-6 ${isDark ? 'text-gray-300' : ''}`}>
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div>
            <p className={`text-sm font-semibold mb-3 uppercase tracking-wide ${isDark ? 'text-green-400' : 'text-green-700'}`}>Strengths</p>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  <span className={`font-bold mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {concerns && concerns.length > 0 && (
          <div>
            <p className={`text-sm font-semibold mb-3 uppercase tracking-wide ${isDark ? 'text-red-400' : 'text-red-700'}`}>Concerns</p>
            <ul className="space-y-2">
              {concerns.map((concern, idx) => (
                <li key={idx} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  <span className={`font-bold mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps */}
        {gaps && gaps.length > 0 && (
          <div>
            <p className={`text-sm font-semibold mb-3 uppercase tracking-wide ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>Skill Gaps</p>
            <ul className="space-y-2">
              {gaps.map((gap, idx) => (
                <li key={idx} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  <span className={`font-bold mt-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contradictions */}
        {contradictions && contradictions.length > 0 && (
          <div>
            <p className={`text-sm font-semibold mb-3 uppercase tracking-wide ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Contradictions</p>
            <ul className="space-y-2">
              {contradictions.map((contradiction, idx) => (
                <li key={idx} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  <span className={`font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>•</span>
                  <span>{contradiction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!strengths?.length &&
          !concerns?.length &&
          !gaps?.length &&
          !contradictions?.length && (
            <p className={`italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>No detailed feedback available</p>
          )}
      </div>
    </div>
  );
}

export default function ResultsDashboard({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const agents = [
    { key: 'resume', data: data.resume },
    { key: 'technical', data: data.technical },
    { key: 'behavioral', data: data.behavioral },
    { key: 'claims', data: data.claims },
  ];

  // Filter out agents with no data (this handles the case where consensus is undefined)
  const visibleAgents = agents.filter(agent => agent.data);

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Detailed Agent Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleAgents.map((agent) => (
            <AgentCard key={agent.key} agentKey={agent.key} agentData={agent.data} />
          ))}
        </div>
      </div>
    </div>
  );
}
