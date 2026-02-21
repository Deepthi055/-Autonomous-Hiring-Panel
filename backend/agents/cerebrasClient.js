const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: 'https://api.cerebras.ai/v1',
});

async function callCerebras(systemPrompt, userPrompt) {
  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from Cerebras');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
}

module.exports = { callCerebras };