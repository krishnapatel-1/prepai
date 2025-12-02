const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, required: true },
    topics: [{ type: String }],
    questionCount: { type: Number, required: true },

    questions: [
      {
        id: Number,
        question: String,
      }
    ],

    averageScore: { type: Number, default: null },

    // ADD THIS 👇
    summary: {
      avgScore: { type: String, default: "" },
      summary: { type: String, default: "" },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
