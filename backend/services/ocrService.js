const Tesseract = require('tesseract.js');
const fs = require('fs');

/**
 * OCR Service - Extracts text from scanned PDFs and images
 */
class OCRService {
  constructor() {
    this.worker = null;
  }

  /**
   * Initialize the Tesseract worker
   */
  async initialize() {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('eng');
    }
    return this.worker;
  }

  /**
   * Extract text from an image or scanned PDF
   * @param {string} filePath - Path to the file
   * @returns {Promise<string>} - Extracted text
   */
  async extractText(filePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
      }

      console.log('Starting OCR extraction for:', filePath);

      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      return result.data.text;
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text using OCR: ' + error.message);
    }
  }

  /**
   * Extract text with confidence score
   * @param {string} filePath - Path to the file
   * @returns {Promise<object>} - Object with text and confidence
   */
  async extractTextWithConfidence(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
      }

      const result = await Tesseract.recognize(filePath, 'eng');

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words?.length || 0
      };
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text using OCR: ' + error.message);
    }
  }

  /**
   * Terminate the worker
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

module.exports = new OCRService();
