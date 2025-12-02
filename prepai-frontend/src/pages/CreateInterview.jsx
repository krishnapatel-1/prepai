import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const CreateInterview = () => {
  const [role, setRole] = useState("");
  const [topics, setTopics] = useState("");
  const [count, setCount] = useState(5);
  const nav = useNavigate();

  const handleCreate = async () => {
  try {
    const res = await api.post("/session/create", {
      role,
      topics: topics.split(",").map(t => t.trim()),
      questionCount: Number(questionCount)
    });

    navigate(`/interview/${res.data._id}`);
  } catch (err) {
    console.error("Create failed", err);
  }
};

  return (
    <div>
      <h2>Create Interview</h2>

      <input
        placeholder="Job Role (e.g., Frontend Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        placeholder="Topics (e.g., React, JS, CSS)"
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
      />

      <input
        type="number"
        min="1"
        max="10"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />

      <button onClick={handleCreate}>Generate Questions</button>
    </div>
  );
};

export default CreateInterview;
