import { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Play, Square, Trash2, Clock, CheckCircle, ArrowRight, ArrowLeft, Loader2, FileText } from 'lucide-react';

export default function InterviewRecorder({ onNext, onBack, data }) {
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, paused, stopped
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [timer, setTimer] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [recordingState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setRecordingState('recording');
    setTimer(0);
    setCurrentRecording({
      id: Date.now(),
      duration: 0,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const pauseRecording = () => {
    setRecordingState('paused');
  };

  const resumeRecording = () => {
    setRecordingState('recording');
  };

  const stopRecording = () => {
    setRecordingState('stopped');
    if (currentRecording) {
      setRecordings(prev => [...prev, { ...currentRecording, duration: timer }]);
    }
  };

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  const playRecording = (id) => {
    setIsPlaying(id);
    setTimeout(() => setIsPlaying(null), 2000);
  };

  const handleTranscribe = () => {
    setTranscribing(true);
    // Simulate transcription
    setTimeout(() => {
      setTranscript(`This is a simulated transcript of the interview recording.

Interviewer: Can you tell me about your experience with React?

Candidate: Absolutely. I've been working with React for about 4 years now. I started with class components and then moved to hooks when they were introduced. I've built several large-scale applications using React, including an e-commerce platform and a real-time dashboard.

Interviewer: What state management solutions have you used?

Candidate: I've primarily used Redux for large applications, but I also have experience with Context API for simpler state management. Recently, I've been exploring Zustand and Jotai for their simplicity.

Interviewer: How do you handle performance optimization in React?

Candidate: There are several approaches I use. First, I make sure to use React.memo for components that don't need to re-render often. I also use useMemo and useCallback to prevent unnecessary re-renders. For large lists, I implement virtualization using libraries like react-window or react-virtual.

Interviewer: Thank you for your detailed answers. That's all the questions I have today.

Candidate: Thank you for the opportunity. I look forward to hearing from you.`);
      setTranscribing(false);
    }, 2000);
  };

  const handleSubmit = () => {
    onNext({
      recordings,
      transcript,
      questions: data?.questions || [],
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Recording</h2>
        <p className="text-gray-500">Record your interview session with the candidate</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Recording Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          {/* Status Indicator */}
          <div className="flex justify-center mb-6">
            <div className={`
              px-6 py-2 rounded-full font-medium flex items-center gap-2
              ${recordingState === 'recording' ? 'bg-rose-100 text-rose-700' : ''}
              ${recordingState === 'paused' ? 'bg-amber-100 text-amber-700' : ''}
              ${recordingState === 'stopped' ? 'bg-gray-100 text-gray-700' : ''}
              ${recordingState === 'idle' ? 'bg-gray-50 text-gray-500' : ''}
            `}>
              {recordingState === 'recording' && (
                <>
                  <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                  Recording
                </>
              )}
              {recordingState === 'paused' && (
                <>
                  <span className="w-3 h-3 bg-amber-500 rounded-full" />
                  Paused
                </>
              )}
              {recordingState === 'stopped' && (
                <>
                  <CheckCircle size={16} />
                  Stopped
                </>
              )}
              {recordingState === 'idle' && 'Ready to Record'}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-gray-800 font-mono">
              {formatTime(timer)}
            </div>
          </div>

          {/* Waveform Animation */}
          {recordingState === 'recording' && (
            <div className="flex justify-center items-center gap-1 mb-8 h-16">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Record Button */}
          <div className="flex justify-center gap-4">
            {recordingState === 'idle' && (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-200 hover:scale-105"
              >
                <Mic size={32} />
              </button>
            )}

            {recordingState === 'recording' && (
              <>
                <button
                  onClick={pauseRecording}
                  className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 transition-all duration-200"
                >
                  <Pause size={24} />
                </button>
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-200 transition-all duration-200 hover:scale-105"
                >
                  <Square size={28} fill="currentColor" />
                </button>
              </>
            )}

            {recordingState === 'paused' && (
              <>
                <button
                  onClick={resumeRecording}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 transition-all duration-200"
                >
                  <Play size={24} fill="currentColor" />
                </button>
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-200 transition-all duration-200 hover:scale-105"
                >
                  <Square size={28} fill="currentColor" />
                </button>
              </>
            )}

            {recordingState === 'stopped' && (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-200 transition-all duration-200"
              >
                <Mic size={24} />
              </button>
            )}
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            {recordingState === 'idle' && 'Click to start recording'}
            {recordingState === 'recording' && 'Recording in progress...'}
            {recordingState === 'paused' && 'Recording paused'}
            {recordingState === 'stopped' && 'Click the mic button to start a new recording'}
          </p>
        </div>

        {/* Recordings List */}
        {recordings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Recordings ({recordings.length})
            </h3>
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playRecording(recording.id)}
                      className="w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center transition-colors"
                    >
                      {isPlaying === recording.id ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play size={16} fill="currentColor" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium text-gray-800">
                        Recording #{recordings.indexOf(recording) + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(recording.duration)} • {recording.timestamp}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="p-2 hover:bg-rose-100 text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript Section */}
        {recordings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={18} />
                Transcript
              </h3>
              {!transcript && !transcribing && (
                <button
                  onClick={handleTranscribe}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Convert to Text
                </button>
              )}
            </div>

            {transcribing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-indigo-600 animate-spin mr-2" />
                <span className="text-gray-600">Transcribing audio...</span>
              </div>
            )}

            {transcript && (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Transcript will appear here..."
              />
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="
              flex items-center gap-2 bg-gray-100 hover:bg-gray-200
              text-gray-700 font-semibold py-3 px-6 rounded-xl
              transition-all duration-200
            "
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={recordings.length === 0}
            className="
              flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
              hover:from-indigo-700 hover:to-purple-700 
              text-white font-semibold py-3 px-8 rounded-xl
              transition-all duration-200 shadow-lg shadow-indigo-200
              hover:shadow-xl hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            "
          >
            Submit for AI Evaluation
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
