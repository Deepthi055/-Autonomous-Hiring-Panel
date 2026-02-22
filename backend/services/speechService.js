const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

/**
 * Speech Service - Transcribes audio using OpenRouter's Whisper API
 */
class SpeechService {
  constructor() {
    this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
    this.whisperModel = 'openai/whisper-1'; // OpenRouter model name for Whisper

    // Log warning on startup if key is missing
    if (!this.isConfigured()) {
      console.warn('⚠️ SpeechService: OPENROUTER_API_KEY is not configured. Transcription will use placeholders.');
    }
  }

  /**
   * Get OpenRouter API key
   */
  getApiKey() {
    return process.env.OPENROUTER_API_KEY;
  }

  /**
   * Check if OpenRouter is configured
   */
  isConfigured() {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey !== 'your_openrouter_api_key_here';
  }

  /**
   * Transcribe audio file using OpenRouter Whisper
   */
  async transcribe(filePath) {
    console.log('🎙️ Transcribing audio file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    if (!this.isConfigured()) {
      console.warn('⚠️ OpenRouter API key not configured. Using placeholder transcript.');
      return this.getPlaceholderTranscript();
    }

    try {
      const transcript = await this.transcribeWithOpenRouter(filePath);
      console.log('✅ Transcription successful.');
      return transcript;
    } catch (error) {
      console.error('❌ OpenRouter transcription failed:', error.response?.data || error.message);
      
      // Return a clear message so the user knows to type manually
      return `[System Error: Transcription failed (${error.response?.status || 'Unknown'}). Please type or paste the candidate's response here.]`;
    }
  }

  /**
   * Transcribe using OpenRouter's Whisper API
   */
  async transcribeWithOpenRouter(filePath) {
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
      `${this.openRouterBaseUrl}/audio/transcriptions`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5000', // Recommended for OpenRouter
          'X-Title': 'DataVex.ai', // Recommended for OpenRouter
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (!response.data || typeof response.data.text === 'undefined') {
      throw new Error('Invalid response from OpenRouter: "text" field is missing.');
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
