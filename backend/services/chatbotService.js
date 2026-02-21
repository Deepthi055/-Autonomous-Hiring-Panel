const llmService = require('../services/llmService');

/**
 * Chatbot Service - Handles AI assistant interactions
 * Uses OpenRouter for chatbot responses with fallback
 */
class ChatbotService {
  constructor() {
    this.systemPrompt = `You are an AI interview assistant helping candidates prepare for job interviews. 

You can help with:
- Generating additional interview questions
- Providing tips on how to answer specific questions
- Explaining technical concepts
- Giving feedback on interview preparation

Be friendly, professional, and concise in your responses.`;

    // Fallback responses when API is not available
    this.fallbackResponses = {
      'technical': `Here are some technical questions you might encounter:

1. Explain the difference between REST and GraphQL APIs
2. How do you optimize database queries?
3. What are the best practices for error handling in production?
4. Describe your experience with microservices architecture

Would you like me to generate more specific questions for your role?`,
      
      'system design': `Here are some system design questions:

1. Design a URL shortening service like bit.ly
2. How would you design a real-time chat application?
3. Design a distributed caching system
4. How would you handle millions of concurrent users?

These are common system design interview questions. Would you like more details on any of these?`,
      
      'behavioral': `Here are some common behavioral questions:

1. Tell me about a time you had a conflict with a team member
2. Describe a situation where you had to meet a tight deadline
3. What are your greatest strengths and weaknesses?
4. Where do you see yourself in 5 years?

Would you like help preparing answers for any of these?`,
      
      'default': `I can help you prepare for your interview! Here are some things I can assist with:

1. Generate more technical questions for your role
2. Provide system design questions
3. Give behavioral interview tips
4. Explain technical concepts

What would you like help with?`
    };
  }

  /**
   * Generate chatbot response
   */
  async generateResponse(prompt, context = '') {
    console.log('Generating chatbot response for:', prompt.substring(0, 50));

    let fullPrompt = prompt;
    
    if (context) {
      fullPrompt = `Context: ${context}\n\nUser Question: ${prompt}\n\nPlease provide a helpful response.`;
    }

    try {
      // Use OpenRouter for chatbot
      const response = await llmService.callQuestionGen(fullPrompt, this.systemPrompt);
      return response;
    } catch (error) {
      console.error('Chatbot error:', error.message);
      // Return fallback response
      console.log('Using fallback chatbot response');
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * Get fallback response based on prompt
   */
  getFallbackResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('technical')) {
      return this.fallbackResponses['technical'];
    } else if (lowerPrompt.includes('system design')) {
      return this.fallbackResponses['system design'];
    } else if (lowerPrompt.includes('behavioral')) {
      return this.fallbackResponses['behavioral'];
    } else {
      return this.fallbackResponses['default'];
    }
  }
}

module.exports = new ChatbotService();
