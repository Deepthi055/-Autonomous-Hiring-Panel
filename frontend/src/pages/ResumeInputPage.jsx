import React, { useState } from 'react';
import { FileText, Upload, ChevronRight, ChevronLeft, Wand2 } from 'lucide-react';
import ResumeUploader from '../components/ResumeUploader';

const TAB_CONFIG = [
    { id: 'paste', label: 'Paste Resume', icon: FileText },
    { id: 'upload', label: 'Upload Resume', icon: Upload },
];

const ResumeInputPage = ({
    resumeContent,
    setResumeContent,
    uploadedFile,
    setUploadedFile,
    onContinue,
    onBack,
}) => {
    const [activeTab, setActiveTab] = useState('paste');

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        if (file) {
            // Simulate reading file content
            setResumeContent(`[Resume uploaded: ${file.name}]\n\nExperienced Software Engineer with 5+ years building scalable backend systems.\n\nTechnical Skills: Node.js, Python, React, PostgreSQL, MongoDB, Redis, AWS, Docker, Kubernetes, Kafka\n\nExperience:\n- Senior Backend Engineer at TechCorp (2021-Present)\n  - Built microservices handling 2M req/day\n  - Led migration to Kubernetes, reducing costs by 40%\n\n- Backend Engineer at StartupXYZ (2019-2021)\n  - Developed REST APIs serving 500K users\n  - Implemented Redis caching, improving response times by 60%\n\nEducation: B.Sc Computer Science, MIT (2019)\n\nCertifications: AWS Solutions Architect, GCP Professional Data Engineer`);
        } else {
            setResumeContent('');
        }
    };

    const canContinue = resumeContent.trim().length > 20 || uploadedFile;

    return (
        <div className="step-enter space-y-6">
            {/* Tab selector */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40 space-y-5">
                <div className="flex gap-1 p-1 bg-slate-900/60 rounded-xl">
                    {TAB_CONFIG.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  tab-btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                                        ? 'active text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-300'
                                    }
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                {activeTab === 'paste' ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-slate-300 text-sm font-medium">Paste Resume Content</label>
                            <span className="text-slate-600 text-xs">{resumeContent.length} characters</span>
                        </div>
                        <textarea
                            id="resume-content"
                            value={resumeContent}
                            onChange={(e) => setResumeContent(e.target.value)}
                            rows={14}
                            placeholder="Paste the candidate's full resume here — include experience, skills, education, certifications..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/50 text-slate-300 text-sm
                placeholder-slate-600 leading-relaxed focus:outline-none focus:border-indigo-500/50 focus:ring-1
                focus:ring-indigo-500/30 resize-none font-mono"
                        />
                        {resumeContent.trim().length < 20 && (
                            <p className="text-amber-500 text-xs">Please paste a resume with sufficient content</p>
                        )}
                    </div>
                ) : (
                    <ResumeUploader uploadedFile={uploadedFile} onFileUpload={handleFileUpload} />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    id="btn-back-job"
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200
            border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    id="btn-generate-questions"
                    onClick={onContinue}
                    disabled={!canContinue}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                    <Wand2 className="w-4 h-4" />
                    Generate Interview Questions
                </button>
            </div>
        </div>
    );
};

export default ResumeInputPage;
