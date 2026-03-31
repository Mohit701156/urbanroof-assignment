const Groq = require('groq-sdk');
const fetch = require('node-fetch');

async function getLLMResponse(prompt, isJson = true) {
  const provider = process.env.MODEL_PROVIDER || 'groq';
  const modelName = process.env.MODEL_NAME || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'mistralai/mistral-7b-instruct:free');

  try {
    if (provider === "openrouter") {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          response_format: isJson ? { type: "json_object" } : undefined
        })
      });
      const data = await response.json();
      let content = data.choices[0].message.content;
      return content;
    } else {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelName,
        response_format: isJson ? { type: "json_object" } : undefined
      });
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("LLM Provider Error:", error);
    throw error;
  }
}

module.exports = {
  getLLMResponse
};
