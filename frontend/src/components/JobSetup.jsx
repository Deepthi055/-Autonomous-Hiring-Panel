import { Code, Database, Server, Cpu, Layers, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const ROLES = [
  { id: 'backend', label: 'Backend Engineer', icon: Server, desc: 'Node.js, Python, Go' },
  { id: 'frontend', label: 'Frontend Engineer', icon: Code, desc: 'React, Vue, Angular' },
  { id: 'data', label: 'Data Engineer', icon: Database, desc: 'SQL, Spark, ETL' },
  { id: 'ai', label: 'AI/ML Engineer', icon: Cpu, desc: 'PyTorch, TensorFlow' },
  { id: 'devops', label: 'DevOps Engineer', icon: Layers, desc: 'AWS, Docker, K8s' },
];

const JD_TEMPLATES = {
  backend: "We are looking for a Backend Engineer to build scalable APIs...",
  frontend: "We are seeking a Frontend Engineer with strong React skills...",
  data: "Join our data team to build robust ETL pipelines...",
  ai: "Looking for an AI/ML Engineer to deploy LLMs...",
  devops: "Seeking a DevOps Engineer to manage our cloud infrastructure...",
};

export default function JobSetup({ data, onUpdate, onNext }) {
  const { isDark } = useTheme();

  const handleRoleSelect = (roleId) => {
    onUpdate({ 
      role: roleId, 
      description: data.description || JD_TEMPLATES[roleId] 
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Select Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = data.role === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md
                  ${isSelected 
                    ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600' 
                    : `${isDark ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'}`
                  }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{role.label}</div>
                <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{role.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Job Description</h2>
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Provide detailed job requirements..."
          className={`w-full h-48 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
            ${isDark 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!data.role || !data.description}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30"
        >
          Continue to Resume
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}