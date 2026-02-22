import { Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Header() {
  const { isDark } = useTheme();

  return (
    <div className={`${
      isDark
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
        : 'gradient-header'
    } text-white py-16 px-6 shadow-lg`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={36} className="animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold">Verdict AI - Intelligent Hiring</h1>
        </div>
        <p className={`text-lg max-w-2xl mt-4 ${isDark ? 'text-gray-300' : 'text-indigo-100'}`}>
          AI-powered candidate evaluation platform that provides objective, comprehensive assessments using advanced machine learning algorithms.
        </p>
      </div>
    </div>
  );
}
