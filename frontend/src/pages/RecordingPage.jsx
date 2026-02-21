import React from 'react';
import { ChevronLeft, ChevronRight, Mic } from 'lucide-react';
import Recorder from '../components/Recorder';

const RecordingPage = ({ transcript, setTranscript, onContinue, onBack }) => {
    const handleTranscriptReady = (text) => {
        setTranscript(text);
    };

    return (
        <div className="step-enter space-y-6">
            {/* Header */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-rose-500/15 rounded-lg">
                        <Mic className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-semibold text-sm">Interview Recording</h2>
                        <p className="text-slate-500 text-xs">Record the candidate's interview responses</p>
                    </div>
                </div>
            </div>

            {/* Recorder Component */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                <Recorder onTranscriptReady={handleTranscriptReady} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    id="btn-back-questions"
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200
            border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Questions
                </button>
                <button
                    id="btn-submit-evaluation"
                    onClick={onContinue}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                >
                    Submit for AI Evaluation
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default RecordingPage;
