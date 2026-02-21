const resumeService = require('../services/resumeService');
const speechService = require('../services/speechService');
const questionService = require('../services/questionService');
const chatbotService = require('../services/chatbotService');
const evaluationService = require('../services/evaluationService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Store interview sessions in memory (use Redis or DB for production)
const interviewSessions = new Map();

// 1️⃣ Upload Resume - Extract text from PDF
const uploadResume = async (req, res) => {
  try {
    console.log('Received upload request');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const sessionId = uuidv4();
    const filePath = req.file.path;
    console.log('Processing file:', filePath);
    
    const resumeText = await resumeService.extractText(filePath);
    console.log('Extracted text length:', resumeText.length);

    // Store session
    interviewSessions.set(sessionId, {
      resumeText,
      createdAt: new Date()
    });

    res.json({
      success: true,
      sessionId,
      resumeText
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
};

// 2️⃣ Transcribe Audio - Convert speech to text
const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio file uploaded' });
    }

    const transcript = await speechService.transcribe(req.file.path);

    res.json({
      success: true,
      transcript
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3️⃣ Generate Interview Questions
const generateQuestions = async (req, res) => {
  try {
    const { role, resumeText, sessionId } = req.body;

    if (!role || !resumeText) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: role and resumeText' 
      });
    }

    const questions = await questionService.generateQuestions(role, resumeText);

    // Update session if provided
    if (sessionId && interviewSessions.has(sessionId)) {
      const session = interviewSessions.get(sessionId);
      session.generatedQuestions = questions;
      interviewSessions.set(sessionId, session);
    }

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4️⃣ Chatbot Endpoint
const chatbot = async (req, res) => {
  try {
    const { prompt, context, sessionId } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Missing prompt' });
    }

    // Get context from session if provided
    let fullContext = context;
    if (sessionId && interviewSessions.has(sessionId)) {
      const session = interviewSessions.get(sessionId);
      fullContext = context || `Resume: ${session.resumeText?.substring(0, 2000)}`;
    }

    const response = await chatbotService.generateResponse(prompt, fullContext);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5️⃣ Evaluate Candidate
const evaluateCandidate = async (req, res) => {
  try {
    const { resume, transcript, jobDescription, sessionId } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: resume and jobDescription' 
      });
    }

    const result = await evaluationService.evaluateCandidate(resume, transcript, jobDescription);

    // Update session if provided
    if (sessionId && interviewSessions.has(sessionId)) {
      const session = interviewSessions.get(sessionId);
      session.evaluationResult = result;
      interviewSessions.set(sessionId, session);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get session by ID
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = interviewSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.json({ success: true, session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadResume,
  transcribeAudio,
  generateQuestions,
  chatbot,
  evaluateCandidate,
  getSession
};
