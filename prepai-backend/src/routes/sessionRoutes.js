const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const { generateQuestions } = require("../services/aiService");

// ✔ CREATE INTERVIEW SESSION
router.post("/create", auth, async (req, res) => {
  try {
    const { role, topics, questionCount } = req.body;

    const questions = await generateQuestions(role, topics, questionCount);

    const session = await Session.create({
      userId: req.user.uid,
      role,
      topics,
      questionCount,
      questions: questions.map((q, i) => ({
        id: i + 1,
        question: q,
      })),
    });

    res.json(session);
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// ✔ GET ALL INTERVIEW SESSIONS FOR USER
router.get("/list", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.uid }).sort({
      createdAt: -1,
    });

    // Format results for dashboard
    const formatted = sessions.map((s) => ({
      _id: s._id,
      role: s.role,
      topics: s.topics,
      createdAt: s.createdAt,
      questionCount: s.questionCount,

      // summary may not exist yet
      averageScore: s.summary ? s.summary.avgScore : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("LIST SESSION ERROR:", err);
    res.status(500).json({ error: "Failed to list sessions" });
  }
});

// ✔ GET SINGLE SESSION BY ID
router.get("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // ensure the user owns the session
    if (session.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(session);
  } catch (err) {
    console.error("GET SESSION ERROR:", err);
    res.status(500).json({ error: "Error loading session" });
  }
});

module.exports = router;
