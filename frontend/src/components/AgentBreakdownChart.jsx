import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTheme } from '../ThemeContext';

export default function AgentBreakdownChart({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const chartData = [
    {
      name: 'Resume',
      value: Math.round((data.resume?.score || 0) * 10),
    },
    {
      name: 'Technical',
      value: Math.round((data.technical?.score || 0) * 10),
    },
    {
      name: 'Behavioral',
      value: Math.round((data.behavioral?.score || 0) * 10),
    },
    {
      name: 'Claims',
      value: Math.round((data.claims?.score || 0) * 10),
    },
  ];

  const colors = ['#4f46e5', '#7c3aed', '#9333ea', '#a855f7'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg shadow-lg border`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-indigo-600">
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Score Breakdown by Agent
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} ${value}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {chartData.map((item, index) => (
          <div 
            key={index} 
            className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.name}
            </p>
            <p className="text-2xl font-bold mt-2" style={{ color: colors[index] }}>
              {item.value}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
