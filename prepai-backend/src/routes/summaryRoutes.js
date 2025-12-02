const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Answer = require("../models/Answer");
const Session = require("../models/Session");
const axios = require("axios");

// ---------------------- SUMMARY ROUTE ------------------------
router.get("/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log("📥 SUMMARY REQUEST for session:", sessionId);

    const session = await Session.findById(sessionId);
    const answers = await Answer.find({ sessionId });

    if (!session || answers.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    // Return cached ONLY if actually generated
    if (
      session.summary &&
      session.summary.summary &&
      session.summary.summary.length > 5
    ) {
      console.log("🟢 Returning cached summary.");
      return res.json(session.summary);
    }

    console.log("🟡 Generating NEW summary...");

    const avgScore =
      answers.reduce((sum, a) => sum + (a.aiScore || 0), 0) / answers.length;

    const prompt = `
Summarize this interview result.

${answers
      .map(
        (a) => `
Q: ${session.questions.find((q) => q.id == a.questionId)?.question}
Score: ${a.aiScore}
Feedback: ${a.aiFeedback}
`
      )
      .join("\n")}

Return ONLY JSON:
{
  "summary": "text",
  "strengths": ["a","b"],
  "weaknesses": ["c","d"]
}
`;

    console.log("📡 Sending summary request to Gemini...");

    const resp = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.AI_API_KEY,
        },
      }
    );

    console.log("📥 RAW AI RESPONSE RECEIVED!");

    let output =
      resp.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    console.log("RAW TEXT:", output);

    output = output.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed = null;

    try {
      parsed = JSON.parse(output);
    } catch (e1) {
      const first = output.indexOf("{");
      const last = output.lastIndexOf("}");

      if (first !== -1 && last !== -1) {
        const sub = output.substring(first, last + 1);
        console.log("🔍 Extracted JSON:", sub);

        try {
          parsed = JSON.parse(sub);
        } catch (e2) {
          console.log("❌ Could not parse extracted JSON");
        }
      }
    }

    if (!parsed) {
      console.log("🚨 FINAL PARSE FAILURE");
      parsed = {
        summary: "",
        strengths: [],
        weaknesses: [],
      };
    }

    const finalSummary = {
      avgScore: avgScore.toFixed(1),
      summary: parsed.summary || "",
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
    };

    console.log("✅ FINAL SUMMARY OBJECT:", finalSummary);

    // Save summary ONLY if valid
    if (finalSummary.summary.length > 5) {
      session.summary = finalSummary;
      await session.save();
      console.log("💾 Saved summary to DB");
    } else {
      console.log("⚠ Summary empty — NOT saving to DB.");
    }

    return res.json(finalSummary);
  } catch (error) {
    console.log("SUMMARY ERROR:", JSON.stringify(error.response?.data || error, null, 2));
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

module.exports = router;
