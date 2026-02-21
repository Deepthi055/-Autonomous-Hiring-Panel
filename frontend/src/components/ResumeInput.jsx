import { useState, useRef } from 'react';
import { FileText, Upload, X, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ResumeInput({ onNext, onBack, data }) {
  const [activeTab, setActiveTab] = useState('paste');
  const [resumeContent, setResumeContent] = useState(data?.resumeContent || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);

  /* ============================= */
  /* Drag & Drop */
  /* ============================= */

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
    if (file) handleFile(file);
  };

  /* ============================= */
  /* File Select */
  /* ============================= */

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  /* ============================= */
  /* File Processing */
  /* ============================= */

  const handleFile = async (file) => {
    if (!file.name.endsWith('.pdf')) {
      setUploadError('Only PDF files are allowed');
      return;
    }

    setUploadError('');
    setUploadedFile({
      name: file.name,
      size: (file.size / 1024).toFixed(1),
    });

    setIsProcessing(true);
    setProcessingStatus('Uploading and processing PDF...');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/interview/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.resumeText) {
        setResumeContent(result.resumeText);
        setProcessingStatus('Text extracted successfully!');
      } else {
        setUploadError(result.error || 'Failed to extract text.');
        setProcessingStatus('');
      }
    } catch (error) {
      setUploadError('Upload failed: ' + error.message);
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeContent('');
    setUploadError('');
    setProcessingStatus('');
  };

  const handleContinue = () => {
    if (!resumeContent.trim()) {
      setErrors({ content: 'Please provide resume content or upload a file' });
      return;
    }

    onNext({
      resumeContent,
      uploadedFile,
    });
  };

  return (
    <div className="animate-fadeIn">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Candidate Resume</h2>
        <p className="text-gray-500">Paste resume content or upload a PDF</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'paste'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500'
              }`}
          >
            <FileText size={18} />
            Paste Resume
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'upload'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500'
              }`}
          >
            <Upload size={18} />
            Upload Resume
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">

        {/* ================= Upload Tab ================= */}
        {activeTab === 'upload' && (
          <div className="space-y-4">

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Drag Drop Area */}
            {!uploadedFile && (
              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${isDragging
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload size={40} className="text-indigo-600" />
                  <p className="font-medium text-gray-700">
                    Click to browse or drag & drop PDF here
                  </p>
                  <p className="text-sm text-gray-400">PDF only</p>
                </div>
              </div>
            )}

            {/* Uploaded File */}
            {uploadedFile && (
              <div className="border-2 border-emerald-300 bg-emerald-50 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{uploadedFile.size} KB</p>
                </div>
                <button onClick={removeFile}>
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Processing */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" />
                {processingStatus}
              </div>
            )}

            {/* Error */}
            {uploadError && (
              <div className="text-red-500 text-sm">{uploadError}</div>
            )}
          </div>
        )}

        {/* ================= Paste Tab ================= */}
        {activeTab === 'paste' && (
          <textarea
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            placeholder="Paste resume content here..."
            className="w-full h-80 p-4 border rounded-xl"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-200 rounded-xl">
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={handleContinue}
          disabled={isProcessing}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl"
        >
          Generate Interview Questions <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}