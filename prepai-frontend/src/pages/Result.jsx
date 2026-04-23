import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Result.css";

const Result = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/result/${id}`);
        setData(res.data);

        const sum = await api.get(`/summary/${id}`);
        setSummary(sum.data);
      } catch (err) {
        console.error("Failed to load result:", err);
      }
    };

    load();
  }, [id]);

  if (!data) {
    return (
      <div className="page-wrapper result-page">
        <h2>Loading result...</h2>
      </div>
    );
  }

  const { session, answers } = data;

  if (!session.questions || session.questions.length === 0) {
    return (
      <div className="page-wrapper result-page">
        <h3>No questions found. Please create a new interview.</h3>
      </div>
    );
  }

  return (
    <div className="page-wrapper result-page">
      <h2 className="result-title">Interview Result</h2>

      {/* QUESTIONS */}
      {session.questions.map((q) => {
        const ans = answers.find(
          (a) => String(a.questionId) === String(q.id)
        );

        return (
          <div key={q.id} className="question-card">
            <h3 className="question-text">Q: {q.question}</h3>

            <p>
              <strong>Your Answer:</strong>{" "}
              {ans?.userAnswer || "Not answered"}
            </p>

            <p>
              <strong>Score:</strong> {ans?.aiScore ?? "N/A"}
            </p>

            <p>
              <strong>Feedback:</strong>{" "}
              {ans?.aiFeedback || "Not available"}
            </p>
          </div>
        );
      })}

      {/* SUMMARY */}
      <div className="summary-card">
        <h2>Overall Summary</h2>

        {summary ? (
          <>
            <p>
              <strong>Average Score:</strong>{" "}
              {summary.avgScore} / 10
            </p>

            <h3>Summary</h3>
            <p>{summary.summary}</p>

            <h3>Strengths</h3>
            <ul>
              {summary.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>Weaknesses</h3>
            <ul>
              {summary.weaknesses?.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Generating summary...</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="result-actions">
        <button
          className="btn-outline"
          onClick={() => nav("/dashboard")}
        >
          Go to Dashboard
        </button>

        <button
          className="btn-primary"
          onClick={async () => {
            try {
              const res = await api.post(`/retake/${id}`);
              nav(`/interview/${res.data.sessionId}`);
            } catch (err) {
              console.error("Retake failed:", err);
            }
          }}
        >
          Retake Interview
        </button>
      </div>
    </div>
  );
};

export default Result;
 