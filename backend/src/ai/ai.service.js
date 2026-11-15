
const { GoogleGenAI } = require("@google/genai");
const { aiAssistantPrompt } = require("./prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(question) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: `${aiAssistantPrompt}\n\nStudent question: ${question}`,
  });

  return response.text;
}

module.exports = { askGemini };
