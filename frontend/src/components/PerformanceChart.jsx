import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../ThemeContext';

export default function PerformanceChart({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const chartData = [
    {
      name: 'Resume Agent',
      score: Math.round((data.resume?.score || 0) * 10),
    },
    {
      name: 'Technical Agent',
      score: Math.round((data.technical?.score || 0) * 10),
    },
    {
      name: 'Behavioral Agent',
      score: Math.round((data.behavioral?.score || 0) * 10),
    },
    {
      name: 'Claims Agent',
      score: Math.round((data.claims?.score || 0) * 10),
    },
  ];

  const colors = ['#4f46e5', '#7c3aed', '#9333ea', '#a855f7'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg shadow-lg border`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-indigo-600">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Agent Performance Breakdown</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#4b5563' : '#e5e7eb'} 
          />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
            label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="score"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-in-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {chartData.map((item, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.name}
            </p>
            <p className="text-2xl font-bold mt-2" style={{ color: colors[index] }}>
              {item.score}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
