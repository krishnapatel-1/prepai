const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Answer = require("../models/Answer");
const axios = require("axios");

// AI evaluate answer
async function evaluateAnswer(question, answer) {
  const prompt = `
You are an expert interviewer.

Evaluate this interview answer.

Question: ${question}
Answer: ${answer}

Return JSON ONLY in this format:

{
  "score": number (0-10),
  "feedback": "brief, professional feedback"
}
`;

  const res = await axios.post(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.AI_API_KEY,
      },
    }
  );

  let text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

// Remove markdown formatting like ```json ... ```
text = text.replace(/```json|```/g, "").trim();

try {
  return JSON.parse(text);
} catch (e) {
  console.log("AI PARSE ERROR — Raw text:", text);
  return { score: 0, feedback: "Could not evaluate answer." };
}

}

// SAVE text answer + AI scoring
router.post("/submit-text", auth, async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, questionText } = req.body;

    // AI evaluation
    const evaluation = await evaluateAnswer(questionText, userAnswer);
 console.log("AI evaluation input:", questionText, userAnswer);
  console.log("AI evaluation result:", evaluation);
    // Save answer
    const created = await Answer.create({
      sessionId,
      questionId,
      userAnswer,
      aiScore: evaluation.score,
      aiFeedback: evaluation.feedback,
    });

    res.json({ success: true, answer: created });
  } catch (err) {
    console.log("ANSWER ERROR:", err);
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

module.exports = router;
