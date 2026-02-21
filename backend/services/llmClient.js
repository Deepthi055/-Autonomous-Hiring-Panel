const llmService = require('../services/llmService');

/**
 * LLM Client Wrapper for Agents
 * Uses Cerebras for agent evaluations
 */
class LLMWrapper {
  /**
   * Complete a prompt and return the response
   */
  async complete(prompt) {
    return llmService.callAgent(prompt, '');
  }

  /**
   * Complete a prompt and parse JSON response
   */
  async completeJson(prompt) {
    return llmService.callAgentJson(prompt, '');
  }
}

// Export a singleton instance
module.exports = new LLMWrapper();
