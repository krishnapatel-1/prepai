const axios = require("axios");

exports.generateQuestions = async (role, topics, count) => {
  try {
   const prompt = `
You are a friendly technical interviewer conducting an interview for a beginner-level candidate.

Generate ${count} interview questions for the role: ${role}.

Topics: ${topics.join(", ")}

GUIDELINES:
- Questions should be suitable for beginners or freshers.
- Avoid very advanced system design or architecture questions.
- Focus on basic understanding, common usage, and simple real-life examples.
- Questions can include:
  - "What is..."
  - "Why do we use..."
  - "How does ... work?"
- Keep questions clear, short, and easy to understand.
- Do not include tricky edge cases or deep optimizations.
- Assume the candidate has basic knowledge but limited real-world experience.

FORMAT:
- Return ONLY a clean numbered list.
- Example:
1. Question one
2. Question two
3. Question three

Do not include explanations or extra text.
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
 