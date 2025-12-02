const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const axios = require("axios");

// Retake interview (create new session using old settings)
router.post("/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Load old session
    const oldSession = await Session.findById(sessionId);
    if (!oldSession) {
      return res.status(404).json({ error: "Old session not found" });
    }

    const questionCount = oldSession.questionCount;

    const prompt = `
Create EXACTLY ${questionCount} interview questions.

Role: ${oldSession.role}
Topics: ${oldSession.topics.join(", ")}

Return JSON ONLY in this format:
[
  { "id": 1, "question": "..." },
  { "id": 2, "question": "..." }
]
NO extra text, no explanation.
`;

    // Call AI API
    const aiRes = await axios.post(
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

    let text = aiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    text = text.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(text);

    // Create new session
    const newSession = await Session.create({
      userId: oldSession.userId,
      role: oldSession.role,
      topics: oldSession.topics,
      questionCount: oldSession.questionCount,  // <--- FIX ADDED
      questions,
    });

    res.json({ success: true, sessionId: newSession._id });

  } catch (err) {
    console.log("RETAKE ERROR:", err);
    res.status(500).json({ error: "Failed to retake interview" });
  }
});

module.exports = router;
