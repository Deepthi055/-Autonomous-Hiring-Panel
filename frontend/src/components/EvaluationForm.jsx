import { ArrowRight, AlertTriangle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function EvaluationForm({ onEvaluate, loading, error }) {
  const { isDark } = useTheme();
  const [resume, setResume] = useState('');
  const [transcript, setTranscript] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume.trim() || !transcript.trim() || !jobDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onEvaluate({ resume, transcript, jobDescription });
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Candidate Evaluation</h2>
      
      {error && (
        <div className={`mb-6 flex gap-3 ${isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
          <AlertTriangle size={20} className={`${isDark ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`font-semibold ${isDark ? 'text-red-200' : 'text-red-900'}`}>Evaluation Error</p>
            <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Resume
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            disabled={loading}
            placeholder="Paste the candidate's resume here..."
            className={`w-full h-28 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Transcript / Work Experience
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={loading}
            placeholder="Paste academic or professional transcript here..."
            className={`w-full h-28 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            placeholder="Paste the job description here..."
            className={`w-full h-28 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'border-gray-300'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              Evaluate Candidate
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
