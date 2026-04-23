import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Interview.css";

const Interview = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* Restore saved progress */
  useEffect(() => {
    const saved = localStorage.getItem(`progress-${id}`);
    if (saved) setCurrentQ(Number(saved));
  }, [id]);

  /* Save progress */
  useEffect(() => {
    localStorage.setItem(`progress-${id}`, currentQ);
  }, [currentQ, id]);

  /* Load session */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await api.get(`/session/${id}`);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    };

    loadSession();
  }, [id]);

  if (!session) {
    return (
      <div className="page-wrapper interview-page">
        <h2>Loading interview...</h2>
      </div>
    );
  }

  if (!session.questions || session.questions.length === 0) {
    return (
      <div className="page-wrapper interview-page">
        <h3>No questions found. Please create a new interview.</h3>
      </div>
    );
  }

  const question = session.questions[currentQ];

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write an answer before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post("/answer/submit-text", {
        sessionId: id,
        questionId: question.id,
        userAnswer: answer,
        questionText: question.question,
      });

      if (currentQ + 1 >= session.questions.length) {
        localStorage.removeItem(`progress-${id}`);
        nav(`/result/${id}`);
        return;
      }

      setCurrentQ((q) => q + 1);
      setAnswer("");
    } catch (err) {
      console.error("Failed to submit answer:", err);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper interview-page">
      <div className="interview-card">
        <h2>Interview Session</h2>

        <p className="progress-text">
          Question {currentQ + 1} of {session.questions.length}
        </p>

        <div className="question-box">
          {question.question}
        </div>

        <textarea
          className="answer-box"
          rows="6"
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitting}
        />

        {error && <p className="error-text">{error}</p>}

        <button
          className="btn-primary submit-btn"
          onClick={submitAnswer}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
};

export default Interview;
 