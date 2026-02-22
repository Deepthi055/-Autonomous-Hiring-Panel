// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { useTheme } from '../ThemeContext';

// export default function PerformanceChart({ data }) {
//   const { isDark } = useTheme();

//   if (!data) return null;

//   const chartData = [
//     { name: 'Resume', score: (data.resume?.score || 0) * 100, fill: '#4f46e5' },
//     { name: 'Technical', score: (data.technical?.score || 0) * 100, fill: '#0ea5e9' },
//     { name: 'Behavioral', score: (data.behavioral?.score || 0) * 100, fill: '#8b5cf6' },
//     { name: 'Claims', score: (data.claims?.score || 0) * 100, fill: '#ec4899' },
//   ];

//   return (
//     <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg p-6 border`}>
//       <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Agent Performance Breakdown</h3>
      
//       <div className="h-64 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData}
//             layout="vertical"
//             margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
//             <XAxis 
//               type="number" 
//               domain={[0, 100]} 
//               tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
//               stroke={isDark ? '#4b5563' : '#d1d5db'}
//             />
//             <YAxis 
//               dataKey="name" 
//               type="category" 
//               tick={{ fill: isDark ? '#e5e7eb' : '#374151', fontWeight: 500 }}
//               stroke={isDark ? '#4b5563' : '#d1d5db'}
//               width={80}
//             />
//             <Tooltip 
//               cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
//               contentStyle={{ 
//                 backgroundColor: isDark ? '#1f2937' : '#fff',
//                 borderColor: isDark ? '#374151' : '#e5e7eb',
//                 color: isDark ? '#fff' : '#000',
//                 borderRadius: '0.5rem'
//               }}
//             />
//             <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.fill} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
//         {chartData.map((item) => (
//           <div key={item.name} className="text-center">
//             <div className="flex items-center justify-center gap-2 mb-1">
//               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
//               <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.name}</span>
//             </div>
//             <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{Math.round(item.score)}%</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '../ThemeContext';

export default function PerformanceChart({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  // Scores are already in 0-100 format - just return as-is
  const normalizeScore = (val) => {
    if (!val) return 0;
    return val > 100 ? val / 100 : val; // If somehow over 100, scale down; otherwise use as-is
  };

  const chartData = [
    {
      name: 'Resume',
      score: normalizeScore(data.resume?.score),
      fill: '#4f46e5'
    },
    {
      name: 'Technical',
      score: normalizeScore(data.technical?.score),
      fill: '#0ea5e9'
    },
    {
      name: 'Behavioral',
      score: normalizeScore(data.behavioral?.score),
      fill: '#8b5cf6'
    },
    {
      name: 'Claims',
      score: normalizeScore(data.claims?.score),
      fill: '#ec4899'
    }
  ];

  return (
    <div
      className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } rounded-2xl shadow-lg p-6 border`}
    >
      <h3
        className={`text-lg font-bold mb-6 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Agent Performance Breakdown
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />

            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              stroke={isDark ? '#4b5563' : '#d1d5db'}
            />

            <YAxis
              dataKey="name"
              type="category"
              tick={{
                fill: isDark ? '#e5e7eb' : '#374151',
                fontWeight: 500
              }}
              stroke={isDark ? '#4b5563' : '#d1d5db'}
              width={100}
            />

            <Tooltip
              formatter={(value) => `${Math.round(value)}%`}
              cursor={{
                fill: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)'
              }}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#fff',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                color: isDark ? '#fff' : '#000',
                borderRadius: '0.5rem'
              }}
            />

            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={30}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></div>
              <span
                className={`text-xs font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </div>
            <p
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {Math.round(item.score)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}