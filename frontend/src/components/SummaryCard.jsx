import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from '../ThemeContext';

export default function SummaryCard({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const finalScore = data.consensus?.finalScore || 0;
  const confidenceLevel = data.consensus?.confidenceLevel || 0;
  const scorePercentage = Math.round(finalScore * 10);

  const chartData = [
    {
      name: 'Score',
      value: scorePercentage,
      fill: '#4f46e5',
    },
  ];

  let recommendation = 'No Hire';
  let badgeColor = isDark
    ? 'bg-red-900 text-red-200 border-red-700'
    : 'bg-red-100 text-red-800 border-red-300';

  if (scorePercentage >= 70) {
    recommendation = 'Hire';
    badgeColor = isDark
      ? 'bg-green-900 text-green-200 border-green-700'
      : 'bg-green-100 text-green-800 border-green-300';
  } else if (scorePercentage >= 50) {
    recommendation = 'Borderline';
    badgeColor = isDark
      ? 'bg-yellow-900 text-yellow-200 border-yellow-700'
      : 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Evaluation Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Score Circle */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={8}
                  tick={false}
                  fill="#4f46e5"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-5xl font-bold text-indigo-600 mt-2">{scorePercentage}%</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Final Score</p>
        </div>

        {/* Recommendation & Details */}
        <div className="md:col-span-2 flex flex-col justify-center gap-6">
          <div>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Recommendation</p>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold border-2 ${badgeColor}`}>
              {recommendation}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 border ${
              isDark
                ? 'bg-gradient-to-br from-indigo-900 to-indigo-800 border-indigo-700'
                : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-indigo-300' : 'text-gray-600'}`}>Confidence Level</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{Math.round(confidenceLevel * 100)}%</p>
            </div>

            <div className={`rounded-xl p-4 border ${
              isDark
                ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700'
                : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-purple-300' : 'text-gray-600'}`}>Overall Rating</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{scorePercentage}%</p>
            </div>
          </div>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {data.consensus?.summary || 'This score represents a comprehensive evaluation by multiple AI agents analyzing the candidate\'s resume, technical skills, behavioral fit, and claim verification.'}
          </p>
        </div>
      </div>
    </div>
  );
}
