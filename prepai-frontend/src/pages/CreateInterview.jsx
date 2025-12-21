import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Createinterview.css";

const CreateInterview = () => {
  const [role, setRole] = useState("");
  const [topics, setTopics] = useState("");
  const [questionCount, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/session/create", {
        role,
        topics: topics.split(",").map((t) => t.trim()),
        questionCount: Number(questionCount),
      });

      nav(`/interview/${res.data._id}`);
    } catch (err) {
      console.error("Create failed", err);
      setError("Failed to create interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <h2>Create Interview</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Job Role</label>
        <input
          type="text"
          placeholder="Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <label>Topics</label>
        <input
          type="text"
          placeholder="React, JavaScript, CSS"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
        />

        <label>Number of Questions</label>
        <input
          type="number"
          min="1"
          max="10"
          value={questionCount}
          onChange={(e) => setCount(e.target.value)}
        />

        <button
          className="btn-primary create-btn"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Creating Interview..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
};

export default CreateInterview;
