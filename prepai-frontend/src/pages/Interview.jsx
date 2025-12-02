import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Interview = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const nav = useNavigate();

  // Restore saved progress (if page refreshed)
  useEffect(() => {
    const saved = localStorage.getItem(`progress-${id}`);
    if (saved) setCurrentQ(Number(saved));
  }, [id]);

  // Save progress whenever currentQ changes
  useEffect(() => {
    localStorage.setItem(`progress-${id}`, currentQ);
  }, [currentQ, id]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await api.get(`/session/${id}`);
        console.log("Session data:", res.data);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    };

    loadSession();
  }, [id]);

  if (!session) return <h2>Loading interview...</h2>;
  if (!session.questions || session.questions.length === 0)
    return <h3>No questions found. Please create a new interview.</h3>;

  const question = session.questions[currentQ];

  const submitAnswer = async () => {
    // Prevent empty answers
    if (!answer.trim()) {
      alert("Please write an answer before continuing.");
      return;
    }

    try {
      await api.post("/answer/submit-text", {
        sessionId: id,
        questionId: question.id,
        userAnswer: answer,
        questionText: question.question,
      });

      // If last question → clear progress + go to results
      if (currentQ + 1 >= session.questions.length) {
        localStorage.removeItem(`progress-${id}`);
        nav(`/result/${id}`);
        return;
      }

      // Otherwise go to next question
      setCurrentQ(currentQ + 1);
      setAnswer("");

    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Interview Session</h2>

      <h3>
        Question {currentQ + 1} / {session.questions.length}
      </h3>

      <p style={{ fontSize: "20px", margin: "10px 0" }}>
        {question.question}
      </p>

      <textarea
        rows="5"
        style={{ width: "100%", padding: "10px" }}
        value={answer}
        placeholder="Write your answer here..."
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button style={{ marginTop: "10px" }} onClick={submitAnswer}>
        Submit Answer
      </button>
    </div>
  );
};

export default Interview;
