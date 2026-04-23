import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [retakeLoading, setRetakeLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/session/list");
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
        setSessions([]);
      }
    };
    loadSessions();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/", { replace: true });
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?"))
      return;

    try {
      await api.delete(`/delete/${id}`);
      setSessions(sessions.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const retakeSession = async (id) => {
    try {
      setRetakeLoading(true);
      const res = await api.post(`/retake/${id}`);
      nav(`/interview/${res.data.sessionId}`);
    } catch (err) {
      console.error("Retake failed:", err);
    } finally {
      setRetakeLoading(false);
    }
  };

  return (
    <div className="page-wrapper dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Your Interview Dashboard</h2>
        {/* <button className="btn-outline" onClick={logout}>
          Logout
        </button> */}
      </div>

      {/* New Interview */}
      <button
        className="btn-primary start-btn"
        onClick={() => nav("/create")}
      >
        Start New Interview
      </button>

      {sessions.length === 0 && (
        <p className="empty-text">No interviews yet. Start one!</p>
      )}

      {/* Sessions */}
      <div className="sessions">
        {sessions.map((s) => (
          <div key={s._id} className="session-card">
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

            {/* Actions */}
            <div className="session-actions">
              <button
                className="btn-outline"
                onClick={() => nav(`/result/${s._id}`)}
              >
                View Result
              </button>

              <button
                className="btn-primary"
                disabled={retakeLoading}
                onClick={() => retakeSession(s._id)}
              >
                Retake
              </button>

              <button
                className="btn-danger"
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
 