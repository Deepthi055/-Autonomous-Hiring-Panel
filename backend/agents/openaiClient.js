const OpenAI = require('openai');

// Use Cerebras if OpenAI API key is not available
const useCerebras = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '';
const apiKey = useCerebras ? process.env.CEREBRAS_API_KEY : process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('Warning: No API key found. Please set OPENAI_API_KEY or CEREBRAS_API_KEY in .env');
}

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: useCerebras ? 'https://api.cerebras.ai/v1' : undefined,
});

async function callOpenAI(systemPrompt, userPrompt) {
  const model = useCerebras ? 'llama-3.3-70b' : 'gpt-4o-mini';
  
  const response = await client.chat.completions.create({
    model: model,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices[0].message.content;
  
  if (!content) {
cere    throw new Error('Empty response from AI');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
}

module.exports = { callOpenAI };
