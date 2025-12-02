const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const Answer = require("../models/Answer");

router.get("/:sessionId", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const answers = await Answer.find({ sessionId: req.params.sessionId });

    // If answers exist, calculate average score
    if (answers.length > 0) {
      const totalScore = answers.reduce(
        (sum, ans) => sum + (ans.aiScore || 0),
        0
      );

      const averageScore = Math.round(totalScore / answers.length);

      // Save average score to session
      session.averageScore = averageScore;
      await session.save();
    }

    res.json({
      session,
      answers,
    });
  } catch (err) {
    console.log("RESULT ERROR:", err);
    res.status(500).json({ error: "Failed to load result" });
  }
});

module.exports = router;
