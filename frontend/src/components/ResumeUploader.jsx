import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, X } from 'lucide-react';

const ResumeUploader = ({ onFileUpload, uploadedFile }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFileUpload(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) onFileUpload(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
                className={`
          relative flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed
          transition-all duration-300 cursor-pointer group
          ${isDragging
                        ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                        : uploadedFile
                            ? 'border-emerald-500/60 bg-emerald-500/5 cursor-default'
                            : 'border-slate-600 hover:border-indigo-500/50 bg-slate-800/30 hover:bg-slate-800/50'
                    }
        `}
            >
                {uploadedFile ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-emerald-500/20 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-emerald-400 font-semibold">{uploadedFile.name}</p>
                            <p className="text-slate-500 text-sm mt-1">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onFileUpload(null); }}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors mt-1"
                        >
                            <X className="w-3.5 h-3.5" />
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`
              p-4 rounded-full transition-all duration-300
              ${isDragging ? 'bg-indigo-500/20' : 'bg-slate-700/50 group-hover:bg-indigo-500/10'}
            `}>
                            <Upload className={`
                w-10 h-10 transition-colors duration-300
                ${isDragging ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}
              `} />
                        </div>
                        <div>
                            <p className="text-slate-300 font-medium">
                                Drag & drop resume here
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                                or <span className="text-indigo-400 underline underline-offset-2">browse files</span>
                            </p>
                            <p className="text-slate-600 text-xs mt-2">Supports PDF, DOCX, TXT — Max 10MB</p>
                        </div>
                    </div>
                )}

                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/40 rounded-xl">
                        <p className="text-indigo-300 font-semibold text-lg">Drop it here!</p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
};

export default ResumeUploader;
