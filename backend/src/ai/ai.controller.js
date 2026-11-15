
const { askGemini } = require("./ai.service");

async function askAI(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid question.",
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Question must not exceed 2000 characters.",
      });
    }

    const answer = await askGemini(question.trim());

    return res.status(200).json({
      success: true,
      answer: answer,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate an AI response. Please try again.",
    });
  }
}

module.exports = { askAI };
