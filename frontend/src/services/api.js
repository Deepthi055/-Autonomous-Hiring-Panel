const API_BASE = '/api/interview';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// 1. Upload Resume - POST /api/interview/upload-resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_BASE}/upload-resume`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload resume');
  }

  return data;
};

// 2. Generate Questions - POST /api/interview/generate-questions
export const generateQuestions = async (role, resumeText, sessionId = null) => {
  return apiRequest('/generate-questions', {
    method: 'POST',
    body: JSON.stringify({
      role,
      resumeText,
      sessionId
    }),
  });
};

// 3. Chatbot - POST /api/interview/chatbot
export const sendChatMessage = async (prompt, context = null, sessionId = null) => {
  return apiRequest('/chatbot', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      context,
      sessionId
    }),
  });
};

// 4. Evaluate Candidate - POST /api/interview/evaluate
export const evaluateCandidate = async (resume, transcript, jobDescription, sessionId = null) => {
  return apiRequest('/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      resume,
      transcript,
      jobDescription,
      sessionId
    }),
  });
};

// 5. Transcribe Audio - POST /api/interview/transcribe
export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to transcribe audio');
  }

  return data;
};

// 6. Get Session - GET /api/interview/session/:sessionId
export const getSession = async (sessionId) => {
  return apiRequest(`/session/${sessionId}`);
};

export default {
  uploadResume,
  generateQuestions,
  sendChatMessage,
  evaluateCandidate,
  transcribeAudio,
  getSession,
};
