import React, { useState, useEffect } from 'react';
import {
    Mic, Square, Pause, Play, Trash2, Loader2, CheckCircle2, Radio
} from 'lucide-react';
import { useRecorder, formatDuration } from '../hooks/useRecorder';
import { mockTranscribe } from '../utils/aiUtils';

const Waveform = ({ isActive }) => (
    <div className="flex items-center gap-1 h-9 mx-auto w-fit">
        {Array.from({ length: 20 }, (_, i) => (
            <div
                key={i}
                className={`wave-bar ${isActive ? '' : 'opacity-30'}`}
                style={{
                    animationPlayState: isActive ? 'running' : 'paused',
                    height: isActive ? undefined : '4px',
                }}
            />
        ))}
    </div>
);

const RecordingItem = ({ recording, onDelete }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 group hover:border-slate-600 transition-all">
        <div className="p-2 bg-indigo-500/15 rounded-lg">
            <Mic className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-slate-300 text-sm font-medium">Recording #{recording.id % 1000}</p>
            <p className="text-slate-500 text-xs mt-0.5">{recording.timestamp}</p>
        </div>
        <div className="text-indigo-400 font-mono text-sm font-semibold">
            {formatDuration(recording.duration)}
        </div>
        <button
            onClick={() => onDelete(recording.id)}
            className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete recording"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
);

const Recorder = ({ onTranscriptReady }) => {
    const {
        isRecording, isPaused, isStopped, duration,
        recordings, start, pause, resume, stop, deleteRecording,
    } = useRecorder();

    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [transcriptDone, setTranscriptDone] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const handleStart = () => {
        setHasStarted(true);
        setTranscriptDone(false);
        setTranscript('');
        start();
    };

    const handleStop = () => {
        stop();
        setIsTranscribing(true);
        setTimeout(() => {
            const t = mockTranscribe(duration);
            setTranscript(t);
            setIsTranscribing(false);
            setTranscriptDone(true);
            onTranscriptReady && onTranscriptReady(t);
        }, 2500);
    };

    const getStatusLabel = () => {
        if (isTranscribing) return { label: 'Transcribing...', color: 'text-amber-400' };
        if (!hasStarted) return { label: 'Ready to Record', color: 'text-slate-400' };
        if (isRecording && !isPaused) return { label: 'Recording', color: 'text-rose-400' };
        if (isPaused) return { label: 'Paused', color: 'text-amber-400' };
        if (isStopped) return { label: 'Stopped', color: 'text-slate-400' };
        return { label: 'Ready', color: 'text-slate-400' };
    };

    const status = getStatusLabel();

    return (
        <div className="space-y-6">
            {/* Main Recording Panel */}
            <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                {/* Status */}
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 text-sm font-medium ${status.color}`}>
                        {isRecording && !isPaused && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                            </span>
                        )}
                        {status.label}
                    </span>
                </div>

                {/* Timer */}
                <div className="font-mono text-5xl font-bold tracking-widest text-white">
                    {formatDuration(duration)}
                </div>

                {/* Waveform */}
                <div className="w-full max-w-xs">
                    <Waveform isActive={isRecording && !isPaused} />
                </div>

                {/* Main record button */}
                <button
                    id="btn-record-start"
                    onClick={!hasStarted || isStopped ? handleStart : undefined}
                    className={`
            relative w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 font-semibold text-white
            ${!hasStarted || isStopped
                            ? 'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 pulse-record shadow-xl shadow-rose-500/40 cursor-pointer'
                            : 'bg-slate-700 cursor-not-allowed opacity-50'
                        }
          `}
                    disabled={hasStarted && !isStopped}
                    title="Start Recording"
                >
                    <Mic className="w-8 h-8" />
                </button>

                {/* Controls */}
                {hasStarted && !isStopped && (
                    <div className="flex items-center gap-3">
                        {!isPaused ? (
                            <button
                                id="btn-record-pause"
                                onClick={pause}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all text-sm font-medium"
                            >
                                <Pause className="w-4 h-4" />
                                Pause
                            </button>
                        ) : (
                            <button
                                id="btn-record-resume"
                                onClick={resume}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25 transition-all text-sm font-medium"
                            >
                                <Play className="w-4 h-4" />
                                Resume
                            </button>
                        )}
                        <button
                            id="btn-record-stop"
                            onClick={handleStop}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-all text-sm font-medium"
                        >
                            <Square className="w-4 h-4" />
                            Stop
                        </button>
                    </div>
                )}

                {isStopped && !isTranscribing && !transcriptDone && (
                    <p className="text-slate-500 text-sm">Click the mic to record again</p>
                )}
            </div>

            {/* Recordings List */}
            {recordings.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-400" />
                        Recordings ({recordings.length})
                    </h3>
                    <div className="space-y-2">
                        {recordings.map(rec => (
                            <RecordingItem key={rec.id} recording={rec} onDelete={deleteRecording} />
                        ))}
                    </div>
                </div>
            )}

            {/* Transcribing State */}
            {isTranscribing && (
                <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-slate-800/50 border border-amber-500/20">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        <p className="text-amber-400 font-medium">Transcribing audio...</p>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                    <p className="text-slate-500 text-sm">Converting speech to text using AI</p>
                </div>
            )}

            {/* Transcript */}
            {transcriptDone && transcript && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-emerald-400 text-sm font-medium">Transcript Ready</h3>
                    </div>
                    <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        rows={6}
                        className="transcript-area w-full px-4 py-3 rounded-xl text-slate-300 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                        placeholder="Transcript will appear here..."
                    />
                </div>
            )}
        </div>
    );
};

export default Recorder;
