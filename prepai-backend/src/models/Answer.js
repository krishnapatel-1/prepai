const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  questionId: String,
  userAnswer: String,  // text input
  aiScore: Number,
  aiFeedback: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Answer", answerSchema);
