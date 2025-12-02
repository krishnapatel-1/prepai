import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

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

  if (!data) return <h2>Loading result...</h2>;

  const { session, answers } = data;

  if (!session.questions || session.questions.length === 0)
    return <h3>No questions found. Please create a new interview.</h3>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Interview Result</h2>

      {session.questions.map((q) => {
        const ans = answers.find((a) => String(a.questionId) === String(q.id));

        return (
          <div key={q.id} style={{ marginBottom: "20px" }}>
            <h3>Q: {q.question}</h3>
            <p><b>Your Answer:</b> {ans?.userAnswer || "Not answered"}</p>
            <p><b>Score:</b> {ans?.aiScore ?? "N/A"}</p>
            <p><b>Feedback:</b> {ans?.aiFeedback || "Not available"}</p>
          </div>
        );
      })}

      {/* SUMMARY SECTION */}
      <div style={{ marginTop: "40px", padding: "20px", borderTop: "2px solid #999" }}>
        <h2>Overall Summary</h2>

        {summary ? (
          <>
            <p><b>Average Score:</b> {summary.avgScore} / 10</p>
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

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => nav("/dashboard")}>Go to Dashboard</button>

        <button
          style={{ marginLeft: "10px", backgroundColor: "#007bff", color: "white" }}
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
