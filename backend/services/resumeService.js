const fs = require('fs');
const path = require('path');

/**
 * Resume Service - Extracts text from PDF files
 * Uses pdf-lib for text extraction (similar to MuPDF)
 */
class ResumeService {
  constructor() {
    // Placeholder for any configuration
  }

  /**
   * Extract text from a PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async extractText(filePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
      }

      console.log('Extracting text from:', filePath);

      // Method 1: Try pdf-lib for text extraction
      try {
        const { PDFDocument } = require('pdf-lib');
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        let fullText = '';
        const pageCount = pdfDoc.getPageCount();
        
        for (let i = 0; i < pageCount; i++) {
          const page = pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        if (fullText.trim().length > 50) {
          console.log(`Successfully extracted ${pageCount} pages using pdf-lib`);
          return this.cleanText(fullText);
        }
      } catch (pdfLibError) {
        console.log('pdf-lib extraction failed:', pdfLibError.message);
      }

      // Method 2: Fallback to pdf-parse
      try {
        const pdf = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        
        if (data.text && data.text.trim().length > 50) {
          console.log('Successfully extracted text using pdf-parse');
          return this.cleanText(data.text);
        }
      } catch (pdfError) {
        console.log('pdf-parse failed:', pdfError.message);
      }

      // Method 3: Try OCR for scanned PDFs
      console.log('Attempting OCR extraction...');
      const ocrText = await this.extractWithOCR(filePath);
      if (ocrText && ocrText.trim().length > 50) {
        console.log('Successfully extracted text using OCR');
        return this.cleanText(ocrText);
      }

      throw new Error('Could not extract text from PDF');
    } catch (error) {
      console.error('Resume extraction error:', error);
      throw error;
    }
  }

  /**
   * Extract text using OCR (Tesseract.js)
   * Best for scanned/image-based PDFs
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async extractWithOCR(filePath) {
    try {
      const Tesseract = require('tesseract.js');
      const { fromPath } = require('pdf2pic');
      
      console.log('Starting OCR with pdf2pic...');
      
      // Configure pdf2pic
      const pdf2PicOptions = {
        density: 150,
        saveFilename: 'temp_resume_page',
        savePath: path.join(__dirname, '../uploads'),
        format: 'png',
        width: 1200,
        height: 1600
      };
      
      const convert = fromPath(filePath, pdf2PicOptions);
      
      // Get number of pages
      const info = await convert(0, true);
      const numPages = info.numpages;
      console.log(`PDF has ${numPages} pages, converting to images...`);
      
      let fullText = '';
      
      // Convert each page to image and run OCR
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        console.log(`Processing page ${pageNum} of ${numPages}...`);
        
        try {
          const imageInfo = await convert(pageNum);
          
          // Run Tesseract OCR on the image
          const result = await Tesseract.recognize(imageInfo.path, 'eng', {
            logger: m => {
              if (m.status === 'recognizing text') {
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            }
          });
          
          fullText += '\n\n' + result.data.text;
          
          // Clean up the temp image
          try {
            fs.unlinkSync(imageInfo.path);
          } catch (e) {
            // Ignore cleanup errors
          }
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError.message);
        }
      }
      
      if (!fullText.trim()) {
        throw new Error('OCR did not extract any text');
      }
      
      return fullText;
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from resume: ' + error.message);
    }
  }

  /**
   * Clean and normalize extracted text
   * @param {string} text - Raw extracted text
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable chars
      .trim();
  }
}

module.exports = new ResumeService();
