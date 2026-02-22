import { Moon, Sun, BrainCircuit } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Navigation({ onAboutClick }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 shadow-sm`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <BrainCircuit size={32} className="text-indigo-600" />
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VerdictAI
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAboutClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 font-semibold ${
              isDark
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            About
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition duration-200 ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
