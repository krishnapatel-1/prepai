const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const Answer = require("../models/Answer");

// Delete a session + its answers
router.delete("/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.uid;

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Delete associated answers
    await Answer.deleteMany({ sessionId });

    // Delete session
    await Session.deleteOne({ _id: sessionId });

    res.json({ success: true, message: "Interview deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

module.exports = router;
