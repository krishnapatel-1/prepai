import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/session/list");
        console.log("Sessions:", res.data);
        setSessions(res.data);
      } catch (err) {
  console.error("Failed to load sessions", err);
  setSessions([]); // avoid undefined crashes
}
    };

    loadSessions();
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // force redirect
  };

  // Delete Interview
  const deleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?"))
      return;

    try {
      await api.delete(`/delete/${id}`);
      setSessions(sessions.filter((s) => s._id !== id)); // update UI
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Retake Interview
  const retakeSession = async (id) => {
    try {
      const res = await api.post(`/retake/${id}`);
      const newId = res.data.sessionId;
      nav(`/interview/${newId}`);
    } catch (err) {
      console.error("Retake failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      
      {/* HEADER WITH LOGOUT */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Your Interview Dashboard</h2>

        <button
          onClick={logout}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "8px 12px",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>

      <button
        style={{ marginTop: "10px", marginBottom: "20px" }}
        onClick={() => nav("/create-interview")}
      >
        Start New Interview
      </button>

      {sessions.length === 0 && <p>No interviews yet. Start one!</p>}

      <div>
        {sessions.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "6px",
            }}
          >
            <h3>{s.role}</h3>
            <p>
              <b>Topics:</b> {s.topics.join(", ")}
            </p>
            <p>
              <b>Date:</b> {new Date(s.createdAt).toLocaleString()}
            </p>

            <p>
              <b>Average Score:</b>{" "}
              {s.averageScore !== null ? s.averageScore : "Not completed"}
            </p>

            {/* ACTION BUTTONS */}
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => nav(`/result/${s._id}`)}>
                View Result
              </button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => retakeSession(s._id)}
              >
                Retake
              </button>

              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => deleteSession(s._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
