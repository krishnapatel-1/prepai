const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const Answer = require("../models/Answer");

// List all interview sessions for a user
router.get("/list", auth, async (req, res) => {
  try {
    const userId = req.user.uid;

    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });

    // Add average score for each session
    const finalData = [];

    for (const sess of sessions) {
      const answers = await Answer.find({ sessionId: sess._id });

      let avgScore = null;
      if (answers.length > 0) {
        avgScore =
          answers.reduce((sum, a) => sum + (a.aiScore || 0), 0) /
          answers.length;
        avgScore = avgScore.toFixed(1);
      }

      finalData.push({
        ...sess._doc,
        averageScore: avgScore,
      });
    }

    res.json(finalData);
  } catch (err) {
    console.log("DASHBOARD LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load sessions" });
  }
});

module.exports = router;
