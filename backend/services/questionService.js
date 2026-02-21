const llmService = require('../services/llmService');
require('dotenv').config();

/**
 * Question Service - Generates interview questions
 * Uses OpenRouter for question generation with fallback
 */
class QuestionService {
  constructor() {
    // System prompt for question generation
    this.systemPrompt = `You are an expert interview question generator. Generate relevant, high-quality interview questions based on the job role and candidate's resume.

Generate questions in the following categories:
- Technical: Role-specific technical knowledge
- Behavioral: Past experiences and soft skills
- System Design: Architecture and scalability
- Problem Solving: Analytical and troubleshooting skills

Respond with JSON in this format:
{
  "questions": [
    {"id": 1, "text": "question text", "category": "Technical"},
    ...
  ]
}`;
  }

  /**
   * Generate interview questions based on role and resume
   */
  async generateQuestions(role, resumeText) {
    console.log('Generating questions for role:', role);

    const roleContext = this.getRoleContext(role);
    
    const prompt = `Generate 8 interview questions for a ${roleContext}.
Request ID: ${Date.now()}

Resume Content:
${resumeText || 'No resume provided. Generate general questions for this role.'}

Return exactly 8 questions, 2 from each category: Technical, Behavioral, System Design, and Problem Solving.`;

    try {
      // Use OpenRouter for questions
      const response = await llmService.callQuestionGenJson(prompt, this.systemPrompt);
      
      // Parse JSON response
      const parsed = JSON.parse(response);
      
      if (parsed.questions && Array.isArray(parsed.questions)) {
        // Ensure each question has an ID
        const questions = parsed.questions.map((q, index) => ({
          id: index + 1,
          text: q.text || q.question || '',
          category: q.category || 'Technical'
        }));
        return questions;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Question generation error:', error.message);
      // Return fallback questions on error
      console.log('Using fallback questions');
      return this.getFallbackQuestions(role);
    }
  }

  /**
   * Get fallback questions when API fails
   */
  getFallbackQuestions(role) {
    const fallbackQuestions = {
      'backend': [
        { id: 1, text: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?', category: 'Technical' },
        { id: 2, text: 'Describe your experience with database optimization. How do you handle slow queries?', category: 'Technical' },
        { id: 3, text: 'Walk me through how you would design a rate-limiting system for an API.', category: 'System Design' },
        { id: 4, text: 'How do you ensure security in your backend applications?', category: 'Technical' },
        { id: 5, text: 'Describe a challenging bug you encountered and how you resolved it.', category: 'Problem Solving' },
        { id: 6, text: 'How do you handle database transactions in distributed systems?', category: 'Technical' },
        { id: 7, text: 'Tell me about a time you had to work with a difficult team member.', category: 'Behavioral' },
        { id: 8, text: 'How do you stay updated with new technologies in backend development?', category: 'Behavioral' },
      ],
      'frontend': [
        { id: 1, text: 'Explain the virtual DOM and why React uses it.', category: 'Technical' },
        { id: 2, text: 'How do you optimize React application performance?', category: 'Technical' },
        { id: 3, text: 'Design a search autocomplete component. What considerations would you have?', category: 'System Design' },
        { id: 4, text: 'Explain CSS-in-JS vs traditional CSS. What are the pros and cons?', category: 'Technical' },
        { id: 5, text: 'How do you handle state management in large applications?', category: 'Technical' },
        { id: 6, text: 'Describe your approach to making applications accessible.', category: 'Technical' },
        { id: 7, text: 'Tell me about a time you had a conflict with a designer.', category: 'Behavioral' },
        { id: 8, text: 'How do you test your frontend code?', category: 'Technical' },
      ],
      'data': [
        { id: 1, text: 'Explain the difference between OLAP and OLTP systems.', category: 'Technical' },
        { id: 2, text: 'How do you handle missing data in a dataset?', category: 'Technical' },
        { id: 3, text: 'Design a data pipeline that processes real-time streaming data.', category: 'System Design' },
        { id: 4, text: 'What is the difference between batch processing and stream processing?', category: 'Technical' },
        { id: 5, text: 'How do you ensure data quality in your pipelines?', category: 'Technical' },
        { id: 6, text: 'Describe your experience with ETL processes.', category: 'Technical' },
        { id: 7, text: 'Tell me about a time you had to work with unclean data.', category: 'Behavioral' },
        { id: 8, text: 'What tools do you use for data visualization?', category: 'Technical' },
      ],
      'ai-ml': [
        { id: 1, text: 'Explain the difference between supervised and unsupervised learning.', category: 'Technical' },
        { id: 2, text: 'How do you handle overfitting in machine learning models?', category: 'Technical' },
        { id: 3, text: 'Design a recommendation system for an e-commerce platform.', category: 'System Design' },
        { id: 4, text: 'What is the purpose of regularization in machine learning?', category: 'Technical' },
        { id: 5, text: 'How do you evaluate the performance of a classification model?', category: 'Technical' },
        { id: 6, text: 'Explain the bias-variance tradeoff.', category: 'Technical' },
        { id: 7, text: 'Tell me about a machine learning project you led from start to finish.', category: 'Behavioral' },
        { id: 8, text: 'What is your approach to feature engineering?', category: 'Technical' },
      ],
      'devops': [
        { id: 1, text: 'Explain the difference between Docker and Kubernetes.', category: 'Technical' },
        { id: 2, text: 'How do you handle secrets management in your CI/CD pipeline?', category: 'Technical' },
        { id: 3, text: 'Design a CI/CD pipeline for a microservices architecture.', category: 'System Design' },
        { id: 4, text: 'What is Infrastructure as Code and why is it important?', category: 'Technical' },
        { id: 5, text: 'How do you monitor application health in production?', category: 'Technical' },
        { id: 6, text: 'Explain the concept of blue-green deployment.', category: 'Technical' },
        { id: 7, text: 'Tell me about a time you had to respond to a production outage.', category: 'Behavioral' },
        { id: 8, text: 'What tools do you use for container orchestration?', category: 'Technical' },
      ],
    };
    
    const questions = fallbackQuestions[role] || fallbackQuestions['backend'];
    // Shuffle questions to provide variety
    return [...questions].sort(() => Math.random() - 0.5);
  }

  /**
   * Get role context and description
   */
  getRoleContext(role) {
    const roles = {
      'backend': 'Backend Engineer - Focus on APIs, databases, server-side logic, microservices',
      'frontend': 'Frontend Engineer - Focus on UI/UX, React, modern frameworks',
      'data': 'Data Engineer - Focus on ETL, pipelines, data architecture',
      'ai-ml': 'AI/ML Engineer - Focus on machine learning, AI models, MLOps',
      'devops': 'DevOps Engineer - Focus on CI/CD, cloud infrastructure, K8s'
    };
    return roles[role] || 'Software Engineer';
  }
}

module.exports = new QuestionService();
