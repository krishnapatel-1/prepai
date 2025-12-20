import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) nav("/dashboard");
  }, [nav]);

  return (
    <div className="landing-wrapper">
      <section className="hero">
        <h1>
          AI Platform for Better <br /> Interviews
        </h1>

        <p className="hero-subtext">
          AI-powered mock interviews with real-time feedback and performance
          insights.
        </p>

        <div className="cta-box">
          <button className="search-btn" onClick={() => nav("/login")}>
            Start Interview
          </button>
          <button className="secondary-btn" onClick={() => nav("/signup")}>
            Sign Up Free
          </button>
        </div>

        <div className="info-card">
          <p className="card-title">Why PrepAI?</p>
          <ul>
            <li>🎯 Role-based interview questions</li>
            <li>📊 AI evaluation with score & feedback</li>
            <li>📈 Interview summary & progress tracking</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Landing;
