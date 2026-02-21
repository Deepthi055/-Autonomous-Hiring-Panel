import { useState, useRef } from 'react';
import { FileText, Upload, X, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResumeInput({ onNext, onBack, data }) {
  const [activeTab, setActiveTab] = useState(data?.resumeContent ? 'paste' : 'paste');
  const [resumeContent, setResumeContent] = useState(data?.resumeContent || '');
  const [uploadedFile, setUploadedFile] = useState(data?.uploadedFile || null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.doc'))) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const fileSize = (file.size / 1024).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: fileSize,
      type: file.type,
    });
    
    // Simulate reading the file content for text files
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeContent('');
  };

  const handleContinue = () => {
    const content = activeTab === 'paste' ? resumeContent : resumeContent;
    
    if (!content.trim()) {
      setErrors({ content: 'Please provide resume content or upload a file' });
      return;
    }

    onNext({
      resumeContent: content,
      uploadedFile,
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Candidate Resume</h2>
        <p className="text-gray-500">Paste resume content or upload a file</p>
      </div>

      {/* Tab Interface */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('paste')}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${activeTab === 'paste' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <FileText size={18} />
            Paste Resume
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${activeTab === 'upload' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Upload size={18} />
            Upload Resume
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'paste' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Paste Resume Content
            </label>
            <textarea
              value={resumeContent}
              onChange={(e) => {
                setResumeContent(e.target.value);
                setErrors({ ...errors, content: null });
              }}
              placeholder="Paste the candidate's resume content here..."
              className={`
                w-full h-80 p-4 border-2 rounded-xl resize-none transition-all duration-200
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${errors.content 
                  ? 'border-rose-400 bg-rose-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            />
            {errors.content && (
              <p className="text-rose-500 text-sm">{errors.content}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Resume
            </label>
            
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${isDragging 
                    ? 'border-indigo-400 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Upload size={32} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Drag & drop your resume here
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      or click to browse (PDF, DOC, TXT)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-emerald-300 bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{uploadedFile.size} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            )}
            {errors.content && (
              <p className="text-rose-500 text-sm">{errors.content}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
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
          onClick={handleContinue}
          className="
            flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 
            text-white font-semibold py-3 px-8 rounded-xl
            transition-all duration-200 shadow-lg shadow-indigo-200
            hover:shadow-xl hover:scale-[1.02]
          "
        >
          Generate Interview Questions
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
