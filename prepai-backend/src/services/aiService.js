const axios = require("axios");

exports.generateQuestions = async (role, topics, count) => {
  try {
    const prompt = `
      Generate ${count} interview questions for a ${role}.
      Topics: ${topics.join(", ")}.
      Only return a clean numbered list (1., 2., 3., ...), nothing else.
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.AI_API_KEY,
        },
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);

  } catch (err) {
    console.error("AI REST ERROR:", err.response?.data || err.message);
    throw err;
  }
};
