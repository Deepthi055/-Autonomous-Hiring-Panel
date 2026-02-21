const axios = require('axios');
require('dotenv').config();

/**
 * LLM Service - Handles calls to various LLM providers
 * Supports OpenRouter, Cerebras, Groq, and OpenAI
 */
class LLMService {
  constructor() {
    this.providers = {
      openrouter: {
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultModel: 'meta-llama/llama-3.1-8b-instruct',
        apiKeyEnv: 'OPENROUTER_API_KEY'
      },
      cerebras: {
        name: 'Cerebras',
        baseUrl: 'https://api.cerebras.ai/v1',
        defaultModel: 'llama-3.1-8b',
        apiKeyEnv: 'CEREBRAS_API_KEY'
      },
      groq: {
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        defaultModel: 'llama-3.1-8b-instant',
        apiKeyEnv: 'GROQ_API_KEY'
      },
      openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
        apiKeyEnv: 'OPENAI_API_KEY'
      }
    };
    
    // Provider priorities for different use cases
    this.defaultProvider = 'openrouter'; // Default fallback
  }

  /**
   * Get API key for a specific provider
   */
  getApiKey(provider) {
    const providerConfig = this.providers[provider];
    return process.env[providerConfig?.apiKeyEnv];
  }

  /**
   * Check if a provider is configured
   */
  isProviderConfigured(provider) {
    const apiKey = this.getApiKey(provider);
    return apiKey && apiKey !== `your_${provider}_api_key_here`;
  }

  /**
   * Call LLM with chat completion
   * @param {string} prompt - The prompt to send
   * @param {string} systemPrompt - Optional system prompt
   * @param {string} model - Optional model override
   * @param {string} provider - Specific provider to use (e.g., 'cerebras', 'openrouter')
   */
  async callLLM(prompt, systemPrompt = '', model = null, provider = null) {
    // If provider specified, try that one first
    if (provider) {
      try {
        return await this.callProvider(prompt, systemPrompt, model, provider);
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error.message);
        // Try fallback providers
      }
    }

    // Try default provider order: openrouter -> cerebras -> groq -> openai
    const providers = ['openrouter', 'cerebras', 'groq', 'openai'];
    for (const p of providers) {
      if (p === provider) continue; // Skip already tried
      try {
        return await this.callProvider(prompt, systemPrompt, model, p);
      } catch (error) {
        console.error(`Provider ${p} failed:`, error.message);
      }
    }

    throw new Error('No LLM API key configured. Please set OPENROUTER_API_KEY, CEREBRAS_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in .env');
  }

  /**
   * Call a specific provider
   */
  async callProvider(prompt, systemPrompt, model, provider) {
    const providerConfig = this.providers[provider];
    const apiKey = this.getApiKey(provider);
    
    if (!apiKey) {
      throw new Error(`${providerConfig.name} API key is not configured`);
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await axios.post(
      `${providerConfig.baseUrl}/chat/completions`,
      {
        model: model || providerConfig.defaultModel,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(provider === 'openrouter' && {
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'Autonomous Hiring Panel'
          })
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Call LLM and get JSON response
   */
  async callLLMJson(prompt, systemPrompt = '', model = null, provider = null) {
    // If provider specified, try that one first
    if (provider) {
      try {
        return await this.callProviderJson(prompt, systemPrompt, model, provider);
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error.message);
      }
    }

    // Try default provider order
    const providers = ['openrouter', 'cerebras', 'groq', 'openai'];
    for (const p of providers) {
      if (p === provider) continue;
      try {
        return await this.callProviderJson(prompt, systemPrompt, model, p);
      } catch (error) {
        console.error(`Provider ${p} failed:`, error.message);
      }
    }

    throw new Error('No LLM API key configured');
  }

  /**
   * Call a specific provider for JSON response
   */
  async callProviderJson(prompt, systemPrompt, model, provider) {
    const providerConfig = this.providers[provider];
    const apiKey = this.getApiKey(provider);
    
    if (!apiKey) {
      throw new Error(`${providerConfig.name} API key is not configured`);
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    // Add JSON formatting instruction
    const jsonPrompt = prompt + '\n\nPlease respond with valid JSON only, no additional text.';
    messages.push({ role: 'user', content: jsonPrompt });

    const response = await axios.post(
      `${providerConfig.baseUrl}/chat/completions`,
      {
        model: model || providerConfig.defaultModel,
        messages,
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(provider === 'openrouter' && {
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'Autonomous Hiring Panel'
          })
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Check if any LLM is configured
   */
  isConfigured() {
    return ['openrouter', 'cerebras', 'groq', 'openai'].some(p => this.isProviderConfigured(p));
  }

  /**
   * Get current provider name
   */
  getProviderName() {
    const providers = ['openrouter', 'cerebras', 'groq', 'openai'];
    for (const p of providers) {
      if (this.isProviderConfigured(p)) {
        return this.providers[p].name;
      }
    }
    return 'None';
  }

  // Convenience methods for specific use cases
  
  /**
   * For agents - use Cerebras (or fallback)
   */
  async callAgent(prompt, systemPrompt = '') {
    return this.callLLM(prompt, systemPrompt, null, 'cerebras');
  }

  /**
   * For agents - get JSON response
   */
  async callAgentJson(prompt, systemPrompt = '') {
    return this.callLLMJson(prompt, systemPrompt, null, 'cerebras');
  }

  /**
   * For questions - use OpenRouter (or fallback)
   */
  async callQuestionGen(prompt, systemPrompt = '') {
    return this.callLLM(prompt, systemPrompt, null, 'openrouter');
  }

  /**
   * For questions - get JSON response
   */
  async callQuestionGenJson(prompt, systemPrompt = '') {
    return this.callLLMJson(prompt, systemPrompt, null, 'openrouter');
  }
}

module.exports = new LLMService();
