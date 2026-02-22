const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

/**
 * Speech Service - Transcribes audio using Groq's Whisper API (Free) or OpenAI
 */
class SpeechService {
  constructor() {
    this.groqBaseUrl = 'https://api.groq.com/openai/v1';
    this.openaiBaseUrl = 'https://api.openai.com/v1';
    this.whisperModel = 'whisper-large-v3'; // Groq's Whisper model

    // Determine which service to use
    this.useGroq = !!process.env.GROQ_API_KEY;
    this.useOpenAI = !!process.env.OPENAI_API_KEY;

    // Log configuration on startup
    if (this.useGroq) {
      console.log('✅ SpeechService: Using Groq Whisper (Free)');
    } else if (this.useOpenAI) {
      console.log('✅ SpeechService: Using OpenAI Whisper');
    } else {
      console.warn('⚠️ SpeechService: No API keys configured. Transcription will use placeholders.');
    }
  }

  /**
   * Get API key based on provider
   */
  getApiKey() {
    if (this.useGroq) {
      return process.env.GROQ_API_KEY;
    }
    return process.env.OPENAI_API_KEY;
  }

  /**
   * Check if any transcription service is configured
   */
  isConfigured() {
    return this.useGroq || this.useOpenAI;
  }

  /**
   * Transcribe audio file using Groq Whisper (Free) or OpenAI
   */
  async transcribe(filePath) {
    console.log('🎙️ Transcribing audio file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    if (!this.isConfigured()) {
      console.warn('⚠️ No API keys configured. Using placeholder transcript.');
      return this.getPlaceholderTranscript();
    }

    // Try Groq first (free), then fall back to OpenAI
    if (this.useGroq) {
      try {
        const transcript = await this.transcribeWithGroq(filePath);
        console.log('✅ Transcription successful (Groq).');
        return transcript;
      } catch (error) {
        console.error('❌ Groq transcription failed:', error.response?.data || error.message);
        
        // If Groq fails and OpenAI is available, try OpenAI
        if (this.useOpenAI) {
          console.log('⚠️ Falling back to OpenAI...');
        } else {
          return this.formatErrorMessage(error);
        }
      }
    }

    // Use OpenAI (either as primary or fallback)
    if (this.useOpenAI) {
      try {
        const transcript = await this.transcribeWithOpenAI(filePath);
        console.log('✅ Transcription successful (OpenAI).');
        return transcript;
      } catch (error) {
        console.error('❌ OpenAI transcription failed:', error.response?.data || error.message);
        return this.formatErrorMessage(error);
      }
    }

    return this.getPlaceholderTranscript();
  }

  /**
   * Format error message for user
   */
  formatErrorMessage(error) {
    const errorData = error.response?.data?.error;
    let errorMessage = 'Unknown error';
    
    if (errorData) {
      if (errorData.code === 'insufficient_quota') {
        errorMessage = 'API quota exceeded. Please manually type the response below.';
      } else if (errorData.type === 'invalid_request_error') {
        errorMessage = 'Invalid audio format. Please try recording again or type manually.';
      } else {
        errorMessage = errorData.message || 'Transcription service error';
      }
    }
    
    return `[Transcription unavailable: ${errorMessage}]`;
  }

  /**
   * Transcribe using Groq's Whisper API (FREE)
   */
  async transcribeWithGroq(filePath) {
    const apiKey = process.env.GROQ_API_KEY;
    const fileName = path.basename(filePath);
    
    // Determine MIME type from extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'audio/mp4',
      '.webm': 'audio/webm',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4'
    };
    const mimeType = mimeTypes[ext] || 'audio/mpeg';

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: mimeType
    });
    form.append('model', 'whisper-large-v3');
    form.append('language', 'en');
    form.append('response_format', 'text');

    const response = await axios.post(
      `${this.groqBaseUrl}/audio/transcriptions`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    // Groq returns plain text when response_format is 'text'
    return response.data;
  }

  /**
   * Transcribe using OpenAI's Whisper API
   */
  async transcribeWithOpenAI(filePath) {
    const apiKey = this.getApiKey();
    const fileName = path.basename(filePath);
    
    // Determine MIME type from extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'audio/mp4',
      '.webm': 'audio/webm',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4'
    };
    const mimeType = mimeTypes[ext] || 'audio/mpeg';

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: mimeType
    });
    form.append('model', this.whisperModel);
    form.append('language', 'en');

    const response = await axios.post(
      `${this.openaiBaseUrl}/audio/transcriptions`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (!response.data || typeof response.data.text === 'undefined') {
      throw new Error('Invalid response from OpenAI: "text" field is missing.');
    }

    return response.data.text;
  }

  /**
   * Get placeholder transcript for demo purposes
   */
  getPlaceholderTranscript() {
    return `[System: Transcription unavailable (API Key missing). Please type or paste the interview response here.]`;
  }
}

module.exports = new SpeechService();
