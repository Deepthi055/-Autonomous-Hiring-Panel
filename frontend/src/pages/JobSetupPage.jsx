import React from 'react';
import { Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import RoleSelector from '../components/RoleSelector';
import { JD_TEMPLATES } from '../utils/jobTemplates';

const JobSetupPage = ({ jobDescription, setJobDescription, selectedRole, setSelectedRole, onContinue }) => {
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        if (!jobDescription || jobDescription === JD_TEMPLATES[selectedRole]) {
            setJobDescription(JD_TEMPLATES[role]);
        }
    };

    const handleAutoFill = () => {
        if (selectedRole) {
            setJobDescription(JD_TEMPLATES[selectedRole]);
        }
    };

    const canContinue = selectedRole && jobDescription.trim().length > 30;

    return (
        <div className="step-enter space-y-6">
            {/* Section A – Job Description */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/15 rounded-lg">
                            <Briefcase className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-slate-200 font-semibold text-sm">Job Description</h2>
                            <p className="text-slate-500 text-xs">Define the role requirements</p>
                        </div>
                    </div>
                    {selectedRole && (
                        <button
                            onClick={handleAutoFill}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-500/10 border border-indigo-500/20
                text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Auto-fill template
                        </button>
                    )}
                </div>

                <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={10}
                    placeholder="Provide detailed job requirements, responsibilities, and qualifications..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/50 text-slate-300 text-sm
            placeholder-slate-600 leading-relaxed focus:outline-none focus:border-indigo-500/50 focus:ring-1
            focus:ring-indigo-500/30 resize-none transition-all"
                />
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs">{jobDescription.length} characters</span>
                    {jobDescription.length < 30 && (
                        <span className="text-amber-500 text-xs">Please provide at least 30 characters</span>
                    )}
                </div>
            </div>

            {/* Section B – Select Role */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/40 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-violet-500/15 rounded-lg">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-slate-200 font-semibold text-sm">Select Role</h2>
                        <p className="text-slate-500 text-xs">Choose the position you're hiring for</p>
                    </div>
                </div>
                <RoleSelector selectedRole={selectedRole} onSelect={handleRoleSelect} />
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
                <button
                    id="btn-continue-resume"
                    onClick={onContinue}
                    disabled={!canContinue}
                    className={`
            btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
          `}
                >
                    Continue to Resume
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default JobSetupPage;
