const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

/**
 * Speech Service
 * Transcribes audio using OpenRouter Whisper API
 */
class SpeechService {
  constructor() {
    this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
    this.whisperModel = 'openai/whisper-1'; // OpenRouter model name
  }

  /**
   * Get OpenRouter API key from environment
   */
  getApiKey() {
    return process.env.OPENROUTER_API_KEY;
  }

  /**
   * Check if API key is configured
   */
  isConfigured() {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey !== 'your_openrouter_api_key_here';
  }

  /**
   * Public transcription method
   */
  async transcribe(filePath) {
    console.log('🎙 Transcribing audio file:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    if (!this.isConfigured()) {
      console.warn('⚠ OpenRouter API key not configured.');
      return this.getPlaceholderTranscript();
    }

    try {
      return await this.transcribeWithOpenRouter(filePath);
    } catch (error) {
      console.error('❌ OpenRouter transcription failed:', error.response?.data || error.message);
      return this.getPlaceholderTranscript();
    }
  }

  /**
   * Transcribe using OpenRouter Whisper
   */
  async transcribeWithOpenRouter(filePath) {
    const apiKey = this.getApiKey();
    const fileName = path.basename(filePath);

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
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (!response.data || !response.data.text) {
      throw new Error('Invalid response from OpenRouter');
    }

    return response.data.text;
  }

  /**
   * Fallback transcript
   */
  getPlaceholderTranscript() {
    return `Transcription service is currently unavailable.
Please configure OPENROUTER_API_KEY in your environment variables.`;
  }
}

module.exports = new SpeechService();