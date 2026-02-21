const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadResume,
  transcribeAudio,
  generateQuestions,
  chatbot,
  evaluateCandidate,
  getSession
} = require('../controllers/interviewController');

// Configure multer for file uploads - use absolute path
const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow PDF files for resume
    if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
        return cb(null, true);
      }
      return cb(new Error('Only PDF files are allowed for resume'), false);
    }
    // Allow audio files for transcription
    if (file.fieldname === 'audio') {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg'];
      if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
      }
      return cb(new Error('Only audio files are allowed'), false);
    }
    cb(null, true);
  }
});

// 1️⃣ Upload Resume - POST /api/interview/upload-resume
router.post('/interview/upload-resume', upload.single('resume'), uploadResume);

// 2️⃣ Transcribe Audio - POST /api/interview/transcribe
router.post('/interview/transcribe', upload.single('audio'), transcribeAudio);

// 3️⃣ Generate Interview Questions - POST /api/interview/generate-questions
router.post('/interview/generate-questions', generateQuestions);

// 4️⃣ Chatbot Endpoint - POST /api/interview/chatbot
router.post('/interview/chatbot', chatbot);

// 5️⃣ Evaluate Candidate - POST /api/interview/evaluate
router.post('/interview/evaluate', evaluateCandidate);

// Get session by ID - GET /api/interview/session/:sessionId
router.get('/interview/session/:sessionId', getSession);

module.exports = router;
